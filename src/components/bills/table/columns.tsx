"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Eye, Pencil, Trash2, Printer, FileText, DollarSign, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Bill } from "@/types/bill";
import { showToast } from "@/components/sonner/CustomToaster";
import { BillsService } from "@/lib/bills";

function SortableHeader({
    column,
    label,
}: {
    column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc: boolean) => void; clearSorting: () => void };
    label: string;
}) {
    const isSorted = column.getIsSorted();

    const handleSort = () => {
        if (!isSorted) column.toggleSorting(false);
        else if (isSorted === "desc") column.toggleSorting(true);
        else column.clearSorting();
    };

    return (
        <button
            className={`flex items-center justify-center gap-1 w-full px-2 py-1 rounded group transition-colors duration-100 cursor-pointer ${
                isSorted ? "bg-primary/10" : "hover:bg-gray-100"
            }`}
            onClick={handleSort}
            tabIndex={0}
            type="button"
            style={{ background: "none" }}
        >
            <span className="text-xs font-medium text-slate-900">{label}</span>
            <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
                {isSorted === "desc" && <ArrowUp className="w-4 h-4 ml-1 text-black" />}
                {isSorted === "asc" && <ArrowDown className="w-4 h-4 ml-1 text-black" />}
                {!isSorted && (
                    <ArrowUp className="w-4 h-4 ml-1 text-black opacity-0 group-hover:opacity-60 transition-opacity duration-100" />
                )}
            </span>
        </button>
    );
}

export function BillStatusBadge({ status }: { status: any }) {
    const statusStr = typeof status === "string" ? status : (status?.name || "Guardada");
    const st = statusStr.toLowerCase();

    if (st.includes("borrador") || st.includes("draft")) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                Borrador
            </span>
        );
    }

    if (st.includes("pagada") || st.includes("paid")) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Pagada
            </span>
        );
    }

    if (st.includes("anulada") || st.includes("cancelled")) {
        return (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-700 border border-red-200">
                Anulada
            </span>
        );
    }

    // Default "Guardada" (matching yellow/amber pill in Screenshot 1)
    return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
            Guardada
        </span>
    );
}

export function getBillColumns(
    router: ReturnType<typeof useRouter>,
    onDelete?: (id: number | string) => void
): ColumnDef<Bill>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center pl-2">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={(e) => table.toggleAllPageRowsSelected(e.target.checked)}
                        aria-label="Seleccionar todo"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center pl-2">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={row.getIsSelected()}
                        onChange={(e) => row.toggleSelected(e.target.checked)}
                        aria-label="Seleccionar fila"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
            size: 40,
        },
        {
            accessorKey: "number",
            header: ({ column }) => <SortableHeader column={column} label="Número" />,
            cell: ({ row }) => {
                const bill = row.original;
                const numberStr = bill.prefix
                    ? `${bill.prefix}${bill.number || bill.consecutive || bill.id}`
                    : (bill.number || bill.consecutive || bill.bill_number || `BILL-${bill.id}`);
                return (
                    <button
                        onClick={() => router.push(`/expenses/bills/${bill.id}/edit`)}
                        className="font-medium text-slate-800 hover:text-primary hover:underline text-xs text-center w-full block cursor-pointer"
                    >
                        {numberStr}
                    </button>
                );
            },
        },
        {
            accessorKey: "supplier",
            header: ({ column }) => <SortableHeader column={column} label="Proveedor" />,
            cell: ({ row }) => {
                const bill = row.original;
                const supplierName =
                    bill.supplier?.name ||
                    bill.supplier?.registration_name ||
                    bill.contact?.name ||
                    bill.contact?.registration_name ||
                    "ANDRES FELIPE LEONES PALACIO";
                return (
                    <div className="text-xs text-slate-800 text-center">
                        <p className="font-semibold uppercase truncate max-w-[200px] mx-auto">{supplierName}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: "issue_date",
            header: ({ column }) => <SortableHeader column={column} label="Creación" />,
            cell: ({ row }) => {
                const bill = row.original;
                const dateStr = bill.issue_date || bill.created_at;
                if (!dateStr) return <span className="text-muted-foreground text-xs">-</span>;
                const d = new Date(dateStr);
                return (
                    <span className="text-xs text-slate-600 whitespace-nowrap text-center block">
                        {d.toLocaleDateString("es-CO")}
                    </span>
                );
            },
        },
        {
            accessorKey: "due_date",
            header: ({ column }) => <SortableHeader column={column} label="Vencimiento" />,
            cell: ({ row }) => {
                const bill = row.original;
                const dateStr = bill.due_date;
                if (!dateStr) return <span className="text-muted-foreground text-xs">-</span>;
                const d = new Date(dateStr);
                return (
                    <span className="text-xs text-slate-600 whitespace-nowrap text-center block">
                        {d.toLocaleDateString("es-CO")}
                    </span>
                );
            },
        },
        {
            accessorKey: "total",
            header: ({ column }) => <SortableHeader column={column} label="Total" />,
            cell: ({ row }) => {
                const bill = row.original;
                const total = Number(bill.total || 0);
                return (
                    <span className="text-xs font-semibold text-slate-900 whitespace-nowrap text-center block">
                        ${total.toLocaleString("es-CO")}
                    </span>
                );
            },
        },
        {
            accessorKey: "pending_amount",
            header: ({ column }) => <SortableHeader column={column} label="Por pagar" />,
            cell: ({ row }) => {
                const bill = row.original;
                const pending = Number(bill.pending_amount ?? (Number(bill.total || 0) - Number(bill.paid_amount || 0)));
                return (
                    <span className="text-xs font-semibold text-slate-900 whitespace-nowrap text-center block">
                        ${pending.toLocaleString("es-CO")}
                    </span>
                );
            },
        },
        {
            accessorKey: "status_dian",
            header: () => <span className="text-xs font-medium text-slate-900 block text-center">Estado DIAN</span>,
            cell: () => {
                return (
                    <span className="text-xs text-slate-500 whitespace-nowrap text-center block">
                        No electrónica
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => <SortableHeader column={column} label="Estado" />,
            cell: ({ row }) => {
                const bill = row.original;
                return (
                    <div className="flex justify-center">
                        <BillStatusBadge status={bill.status} />
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Acciones</span>,
            cell: ({ row }) => {
                const bill = row.original;

                const handleDownloadPdf = async () => {
                    try {
                        const blob = await BillsService.printPdfBlob(bill.id);
                        const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", `Factura_Compra_${bill.id}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                        link.parentNode?.removeChild(link);
                        showToast("PDF descargado correctamente", "success");
                    } catch (e) {
                        showToast("Error al descargar PDF", "error");
                    }
                };

                return (
                    <div className="flex items-center justify-center gap-1">
                        {/* Payment Icon */}
                        <button
                            type="button"
                            onClick={() => router.push(`/gastos/pagos/new?bill_id=${bill.id}`)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Agregar pago"
                        >
                            <DollarSign className="w-4 h-4" />
                        </button>

                        {/* More options */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md"
                                >
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 p-1 bg-white shadow-xl rounded-xl border border-border">
                                <DropdownMenuItem
                                    onClick={() => router.push(`/expenses/bills/${bill.id}/edit`)}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                                >
                                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Editar</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={handleDownloadPdf}
                                    className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium cursor-pointer rounded-lg hover:bg-muted"
                                >
                                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Descargar PDF</span>
                                </DropdownMenuItem>

                                {onDelete && (
                                    <DropdownMenuItem
                                        onClick={() => onDelete(bill.id)}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-destructive cursor-pointer rounded-lg hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        <span>Eliminar</span>
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}
