"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, ListOrdered, X } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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

const TYPE_OPTIONS = [
    { value: "", label: "Todos" },
    { value: "manual", label: "Comprobante manual" },
    { value: "bill_payment", label: "Pago factura de compra" },
    { value: "support_document_payment", label: "Pago documento soporte" },
    { value: "invoice", label: "Factura de venta" },
];

const FILTER_OPTIONS = [
    { label: "Fecha", value: "date_range", icon: CalendarDays },
    { label: "Tipo de registro", value: "source_type", icon: ListOrdered },
];

const COLUMNS_COUNT = 9;

export default function JournalLedgerPage() {
    return (
        <Suspense fallback={null}>
            <JournalLedgerContent />
        </Suspense>
    );
}

function JournalLedgerContent() {
    const searchParams = useSearchParams();
    const [search, setSearch] = useState("");
    const [activeFilters, setActiveFilters] = useState<string[]>(() =>
        searchParams?.get("source_type") ? ["source_type"] : []
    );
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [sourceType, setSourceType] = useState(searchParams?.get("source_type") || "");
    const accountId = searchParams?.get("account_id") || "";
    const accountLabel = searchParams?.get("account_label") || "";
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);

    const { data, isLoading, isFetching, isError, refetch } = useJournalEntriesList({
        page,
        per_page: perPage,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        source_type: sourceType || undefined,
        account_id: accountId || undefined,
    });
    const entries = data?.entries || [];
    const pagination = data?.pagination || { current_page: page, per_page: perPage, total: 0, last_page: 1, from: 0, to: 0 };

    const typeLabel = TYPE_OPTIONS.find((o) => o.value === sourceType)?.label || "Todos";

    const handleAddFilter = (value: string) => {
        setActiveFilters((prev) => (prev.includes(value) ? prev : [...prev, value]));
    };

    const handleRemoveFilter = (value: string) => {
        setActiveFilters((prev) => prev.filter((f) => f !== value));
        setPage(1);
        if (value === "date_range") {
            setDateFrom("");
            setDateTo("");
        } else if (value === "source_type") {
            setSourceType("");
        }
    };

    // Flatten each entry's lines into individual rows — the "Asiento" number repeats across all
    // of that entry's lines, matching Alegra's own Libro diario layout.
    const rows = useMemo(() => {
        const out: any[] = [];
        for (const entry of entries) {
            const lines = entry.lines || [];
            lines.forEach((line: any, idx: number) => {
                out.push({
                    key: `${entry.id}-${line.id ?? idx}`,
                    asiento: `${entry.prefix}${entry.number}`,
                    status: entry.status,
                    entry_date: entry.entry_date,
                    tercero: line.contact?.registration_name || line.contact?.name || "-",
                    codigo: line.account?.code || "-",
                    cuenta: line.account?.name || "-",
                    centro_costo: line.cost_center?.name || "-",
                    debit: Number(line.debit || 0),
                    credit: Number(line.credit || 0),
                });
            });
        }
        return out;
    }, [entries]);

    const filtered = search
        ? rows.filter((r) => {
            const q = search.toLowerCase();
            return (
                r.asiento.toLowerCase().includes(q) ||
                r.tercero.toLowerCase().includes(q) ||
                r.cuenta.toLowerCase().includes(q) ||
                r.codigo.toLowerCase().includes(q)
            );
        })
        : rows;

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div>
                    <h1 className="text-lg md:text-xl font-bold text-foreground">Libro diario</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Consulta el movimiento contable con el detalle de tus transacciones registradas.
                    </p>
                </div>

                {accountId && (
                    <div className="flex items-center gap-2 text-xs bg-primary/10 text-primary rounded-lg px-3 py-2 w-fit">
                        <span>Filtrado por cuenta: <strong>{accountLabel || accountId}</strong></span>
                        <a href="/accounting/ledger" className="underline hover:no-underline">Quitar filtro</a>
                    </div>
                )}

                <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="min-h-12 px-4 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex w-full md:w-auto items-center gap-2">
                            <div className="relative w-full md:w-65">
                                <DebouncedInput placeholder="Buscar por cuenta, tercero o asiento" value={search} onChange={setSearch} />
                            </div>
                            <InvoiceFilter options={FILTER_OPTIONS} selected="" onSelect={handleAddFilter} />
                        </div>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
                            {activeFilters.includes("date_range") && (
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
                            )}
                            {activeFilters.includes("date_range") && (
                                <button onClick={() => handleRemoveFilter("date_range")} className="text-muted-foreground hover:text-foreground -ml-1.5 cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {activeFilters.includes("source_type") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="inline-flex items-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium shadow-sm">
                                            <ListOrdered className="w-3.5 h-3.5 mr-1" />
                                            <span className="mr-1">Tipo de registro</span>
                                            <span className="font-normal text-primary/70">{typeLabel}</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" sideOffset={4} className="min-w-[220px]">
                                        {TYPE_OPTIONS.map((opt) => (
                                            <DropdownMenuItem
                                                key={opt.value}
                                                onClick={() => { setSourceType(opt.value); setPage(1); }}
                                                className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                            >
                                                {opt.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                            {activeFilters.includes("source_type") && (
                                <button onClick={() => handleRemoveFilter("source_type")} className="text-muted-foreground hover:text-foreground -ml-1.5 cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    )}

                    <div className="relative overflow-x-auto min-h-[300px] flex flex-col justify-between">
                        <Table className="w-full text-xs text-left">
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Asiento</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Tercero</TableHead>
                                    <TableHead>Código</TableHead>
                                    <TableHead>Cuenta contable</TableHead>
                                    <TableHead>Centro de costo</TableHead>
                                    <TableHead className="text-right">Débito</TableHead>
                                    <TableHead className="text-right">Crédito</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isError ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={COLUMNS_COUNT} className="bg-white text-center align-middle p-0">
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                                <h3 className="text-base font-semibold text-destructive mb-1">Error al cargar el libro diario</h3>
                                                <p className="text-xs text-muted-foreground max-w-sm">Intenta recargar la página.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? (
                                    filtered.map((row) => (
                                        <TableRow key={row.key} className="hover:bg-slate-50 transition-colors">
                                            <TableCell className="font-medium text-primary">{row.asiento}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700 text-[10px]">
                                                    {STATUS_LABELS[row.status] || row.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-600">{row.entry_date}</TableCell>
                                            <TableCell className="text-slate-700">{row.tercero}</TableCell>
                                            <TableCell className="font-mono text-slate-500">{row.codigo}</TableCell>
                                            <TableCell className="text-slate-800">{row.cuenta}</TableCell>
                                            <TableCell className="text-slate-600">{row.centro_costo}</TableCell>
                                            <TableCell className="text-right font-medium text-slate-900">
                                                {row.debit > 0 ? `$ ${row.debit.toLocaleString("es-CO")}` : "-"}
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-slate-900">
                                                {row.credit > 0 ? `$ ${row.credit.toLocaleString("es-CO")}` : "-"}
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
                                                    {search ? "No se encontraron movimientos con ese criterio de búsqueda." : "Aún no se han registrado movimientos contables."}
                                                </p>
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
