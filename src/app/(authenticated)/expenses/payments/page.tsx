"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Funnel, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useExpensePaymentsList } from "@/hooks/expensePayments/useExpensePayments";

const TYPE_OPTIONS = [
    { value: "", label: "Todos" },
    { value: "support_document", label: "Documento soporte" },
    { value: "bill", label: "Factura de compra" },
];

export default function ExpensePaymentsPage() {
    const router = useRouter();
    const [search, setSearch] = React.useState("");
    const [documentType, setDocumentType] = React.useState("");
    const [dateFrom, setDateFrom] = React.useState("");
    const [dateTo, setDateTo] = React.useState("");

    const { data, isLoading, isError } = useExpensePaymentsList({
        per_page: 100,
        document_type: documentType || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
    });
    const payments = data || [];

    const filtered = search
        ? payments.filter((p: any) => {
            const q = search.toLowerCase();
            const contactName = (p.contact?.registration_name || p.contact?.name || "").toLowerCase();
            const docNumber = (p.document_number || "").toLowerCase();
            return contactName.includes(q) || docNumber.includes(q);
        })
        : payments;

    const hasActiveFilters = Boolean(documentType || dateFrom || dateTo);
    const typeLabel = TYPE_OPTIONS.find((o) => o.value === documentType)?.label || "Todos";

    const columnsCount = 6;

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6">
                <div className="mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Pagos</h1>
                        <Button
                            size="sm"
                            onClick={() => router.push("/expenses/payments/new")}
                            className="bg-primary hover:bg-primary/90 text-white font-medium cursor-pointer text-xs flex items-center gap-1 h-8 px-3 rounded-lg shadow-xs"
                        >
                            <Plus className="w-3.5 h-3.5 mr-0.5" />
                            <span>Nuevo pago</span>
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Pagos a proveedores — sobre Documentos Soporte o Facturas de Compra. Independiente de los pagos recibidos de clientes (Ingresos &gt; Pagos).
                    </p>
                </div>

                <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-3 border-b border-gray-200">
                        <Input
                            placeholder="Buscar por proveedor o número de documento"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="max-w-xs h-9 text-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-gray-200 bg-white">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium shadow-sm transition-colors ${documentType ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40"}`}
                                >
                                    <Funnel className="w-4 h-4 mr-1 text-gray-400" />
                                    <span className="mr-1">Tipo</span>
                                    <span className="font-normal text-gray-500">{typeLabel}</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" sideOffset={4} className="min-w-[200px]">
                                {TYPE_OPTIONS.map((opt) => (
                                    <DropdownMenuItem
                                        key={opt.value}
                                        onClick={() => setDocumentType(opt.value)}
                                        className="hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors cursor-pointer"
                                    >
                                        {opt.label}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-medium shadow-sm transition-colors ${(dateFrom || dateTo) ? "border-primary/30 bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40"}`}
                                >
                                    <Funnel className="w-4 h-4 mr-1 text-gray-400" />
                                    <span className="mr-1">Fecha</span>
                                    <span className="font-normal text-gray-500">
                                        {dateFrom || dateTo ? `${dateFrom || "…"} – ${dateTo || "…"}` : "Todas"}
                                    </span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" sideOffset={4} className="min-w-[240px] p-3 space-y-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Desde</label>
                                    <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-8 text-xs" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground">Hasta</label>
                                    <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-8 text-xs" />
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {hasActiveFilters && (
                            <button
                                onClick={() => { setDocumentType(""); setDateFrom(""); setDateTo(""); }}
                                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-1 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" /> Limpiar filtros
                            </button>
                        )}
                    </div>

                    <div className="relative overflow-x-auto min-h-[300px] flex flex-col justify-between">
                        <Table className="w-full text-xs text-center border-collapse">
                            <TableHeader>
                                <TableRow className="border-b border-gray-200 bg-gray-50/50">
                                    <TableHead className="text-center">Fecha</TableHead>
                                    <TableHead className="text-center">Pago #</TableHead>
                                    <TableHead className="text-center">Proveedor</TableHead>
                                    <TableHead className="text-center">Documento</TableHead>
                                    <TableHead className="text-center">Tipo</TableHead>
                                    <TableHead className="text-center">Monto</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="divide-y divide-gray-100 bg-white">
                                {isError ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                                <h3 className="text-base font-semibold text-destructive mb-1">Error al cargar los pagos</h3>
                                                <p className="text-xs text-muted-foreground max-w-sm">Intenta recargar la página.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filtered.length > 0 ? (
                                    filtered.map((p: any) => {
                                        const isBill = p.document_type === "bill";
                                        const targetUrl = isBill
                                            ? `/expenses/bills/${p.document_id}`
                                            : `/expenses/support-documents/${p.document_id}`;
                                        return (
                                            <TableRow
                                                key={`${p.document_type}-${p.id}`}
                                                onClick={() => p.document_id && router.push(targetUrl)}
                                                className="hover:bg-slate-50 transition-colors duration-100 cursor-pointer"
                                            >
                                                <TableCell className="px-3 py-3 text-slate-600">{p.payment_date}</TableCell>
                                                <TableCell className="px-3 py-3 font-medium text-slate-900">{p.prefix}{p.number}</TableCell>
                                                <TableCell className="px-3 py-3 text-slate-700">
                                                    {p.contact?.registration_name || p.contact?.name || "-"}
                                                </TableCell>
                                                <TableCell className="px-3 py-3 text-primary">{p.document_number || "-"}</TableCell>
                                                <TableCell className="px-3 py-3">
                                                    <span className={`inline-flex px-2 py-1 rounded-full font-medium ${isBill ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                                                        {isBill ? "Factura de compra" : "Documento soporte"}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="px-3 py-3 font-medium text-slate-900">
                                                    $ {Number(p.amount || 0).toLocaleString("es-CO")}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : isLoading ? (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                            <div className="h-64 bg-white" />
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow className="hover:bg-transparent">
                                        <TableCell colSpan={columnsCount} className="bg-white text-center align-middle p-0">
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                                    <svg className="w-8 h-8 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <h3 className="text-base font-semibold text-foreground mb-1">Sin resultados</h3>
                                                <p className="text-xs text-muted-foreground max-w-sm">
                                                    {search ? "No se encontraron pagos con ese criterio de búsqueda." : "Aún no se han registrado pagos a proveedores."}
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
                </div>
            </div>
        </div>
    );
}
