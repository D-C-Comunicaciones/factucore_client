"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DebouncedInput } from "@/components/ui/debounced-input";
import { InvoiceFilter } from "@/components/invoice/InvoiceFilter";
import { SupportDocumentTablePagination } from "@/components/support-documents/table/SupportDocumentTablePagination";
import { useJournalEntriesList } from "@/hooks/accounting/useAccounting";

const STATUS_LABELS: Record<string, string> = {
    draft: "Borrador",
    posted: "Contabilizado",
    voided: "Anulado",
};

const FILTER_OPTIONS = [{ label: "Fecha", value: "date_range", icon: CalendarDays }];

const COLUMNS_COUNT = 5;

export default function JournalEntriesPage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [dateFilterActive, setDateFilterActive] = useState(false);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    // "Comprobante contable" only lists manually captured vouchers — auto-generated entries from
    // payments/invoices/etc. show up in "Libro diario" instead, matching Alegra's own split.
    const { data, isLoading, isFetching, isError, refetch } = useJournalEntriesList({
        page,
        per_page: perPage,
        source_type: "manual",
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
    });
    const entries = data?.entries || [];
    const pagination = data?.pagination || { current_page: page, per_page: perPage, total: 0, last_page: 1, from: 0, to: 0 };

    const filtered = search
        ? entries.filter((e: any) => {
            const q = search.toLowerCase();
            const numero = `${e.prefix}${e.number}`.toLowerCase();
            return numero.includes(q) || (e.description || "").toLowerCase().includes(q);
        })
        : entries;

    const handleRemoveDateFilter = () => {
        setDateFilterActive(false);
        setDateFrom("");
        setDateTo("");
        setPage(1);
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Comprobantes contables</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Registra ajustes y traslados del saldo contable entre tus cuentas.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={() => router.push("/accounting/journal-entries/new")}
                        className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                    >
                        <Plus className="w-3.5 h-3.5 mr-0.5" />
                        <span>Nuevo comprobante</span>
                    </Button>
                </div>

                <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <div className="relative w-full md:w-65">
                                <DebouncedInput placeholder="Buscar por número u observación" value={search} onChange={setSearch} />
                            </div>
                            <InvoiceFilter options={FILTER_OPTIONS} selected="" onSelect={() => setDateFilterActive(true)} />
                        </div>
                    </div>

                    {dateFilterActive && (
                        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium shadow-sm">
                                        <CalendarDays className="w-3.5 h-3.5 mr-1" />
                                        <span className="mr-1">Fecha</span>
                                        <span className="font-normal text-primary/70">
                                            {dateFrom || dateTo ? `${dateFrom || "…"} – ${dateTo || "…"}` : "Todas"}
                                        </span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" sideOffset={4} className="min-w-[240px] p-3 space-y-2">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Desde</label>
                                        <DebouncedInput type="date" value={dateFrom} onChange={(v) => { setDateFrom(v); setPage(1); }} icon={null} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-muted-foreground">Hasta</label>
                                        <DebouncedInput type="date" value={dateTo} onChange={(v) => { setDateTo(v); setPage(1); }} icon={null} />
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <button onClick={handleRemoveDateFilter} className="text-muted-foreground hover:text-foreground -ml-1.5 cursor-pointer">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    <div className="relative overflow-x-auto min-h-[300px] flex flex-col justify-between">
                        <Table className="w-full text-xs text-left">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Numeración</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Observaciones</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isError ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={COLUMNS_COUNT} className="bg-white text-center align-middle p-0">
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                                <h3 className="text-base font-semibold text-destructive mb-1">Error al cargar los comprobantes</h3>
                                                <p className="text-xs text-muted-foreground max-w-sm">Intenta recargar la página.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? (
                                    filtered.map((entry: any) => (
                                        <TableRow
                                            key={entry.id}
                                            className="hover:bg-slate-50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/accounting/ledger?source_type=manual`)}
                                        >
                                            <TableCell className="font-medium text-primary">{entry.prefix}{entry.number}</TableCell>
                                            <TableCell className="text-slate-600">{entry.entry_date}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 text-[10px]">
                                                    {STATUS_LABELS[entry.status] || entry.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-700">{entry.description || "-"}</TableCell>
                                            <TableCell className="text-right font-medium text-slate-900">
                                                $ {Number(entry.total_debit || 0).toLocaleString("es-CO")}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : isLoading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={COLUMNS_COUNT} className="bg-white text-center align-middle p-0">
                                            <div className="h-64 bg-white" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={COLUMNS_COUNT} className="bg-white text-center align-middle p-0">
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                                    <svg className="w-8 h-8 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-semibold text-foreground mb-1">Sin resultados</h3>
                                                <p className="text-xs text-muted-foreground max-w-sm">
                                                    {search ? "No se encontraron comprobantes con ese criterio de búsqueda." : "Aún no has creado tu primer comprobante contable."}
                                                </p>
                                                {!search && (
                                                    <Button
                                                        onClick={() => router.push("/accounting/journal-entries/new")}
                                                        size="sm"
                                                        className="bg-primary hover:bg-primary/90 text-white cursor-pointer mt-4 text-xs h-8"
                                                    >
                                                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Nuevo comprobante
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {isLoading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
                            </div>
                        )}
                    </div>

                    <SupportDocumentTablePagination
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        pagination={{
                            current_page: pagination.current_page ?? page,
                            per_page: pagination.per_page ?? perPage,
                            total: pagination.total ?? 0,
                            last_page: pagination.last_page ?? 1,
                            from: pagination.from ?? null,
                            to: pagination.to ?? null,
                        }}
                        onRefresh={() => refetch()}
                        refreshing={isFetching}
                    />
                </div>
            </div>
        </div>
    );
}
