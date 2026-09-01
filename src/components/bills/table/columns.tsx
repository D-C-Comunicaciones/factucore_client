"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Pencil, Ban, DollarSign, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Bill } from "@/types/bill";

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
    const code = String(status?.code || "").toUpperCase();
    const label = status?.name || "Guardado";

    const styles: Record<string, string> = {
        BORRADOR: "bg-slate-100 text-slate-700",
        GUARDADO: "bg-amber-50 text-amber-800 border border-amber-200/80",
        PAGADO: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        POR_PAGAR: "bg-blue-100 text-blue-700",
        ANULADO: "bg-red-50 text-red-700 border border-red-200",
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${styles[code] ?? "bg-slate-100 text-slate-700"}`}>
            {label}
        </span>
    );
}

export function getBillColumns(
    router: ReturnType<typeof useRouter>,
    onCancel?: (id: number | string) => void
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
                <div className="flex items-center justify-center pl-2" onClick={(e) => e.stopPropagation()}>
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
            id: "bill_number",
            header: ({ column }) => <SortableHeader column={column} label="Número factura proveedor" />,
            cell: ({ row }) => {
                const bill = row.original;
                return (
                    <span className="font-medium text-slate-800 text-xs text-center w-full block">
                        {bill.bill_number || `#${bill.id}`}
                    </span>
                );
            },
        },
        {
            id: "contact",
            header: ({ column }) => <SortableHeader column={column} label="Proveedor" />,
            cell: ({ row }) => {
                const contact = row.original.contact;
                const supplierName = contact?.registration_name || contact?.name || `${contact?.first_name || ""} ${contact?.last_name || ""}`.trim();
                return (
                    <div className="text-xs text-slate-800 text-center">
                        <p className="font-semibold uppercase truncate max-w-[200px] mx-auto">{supplierName || "Sin proveedor"}</p>
                    </div>
                );
            },
        },
        {
            accessorKey: "issue_date",
            header: ({ column }) => <SortableHeader column={column} label="Fecha" />,
            cell: ({ row }) => {
                const dateStr = row.original.issue_date;
                return (
                    <span className="text-xs text-slate-600 whitespace-nowrap text-center block">
                        {dateStr ? String(dateStr).slice(0, 10) : "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "due_date",
            header: ({ column }) => <SortableHeader column={column} label="Vencimiento" />,
            cell: ({ row }) => {
                const dateStr = row.original.due_date;
                return (
                    <span className="text-xs text-slate-600 whitespace-nowrap text-center block">
                        {dateStr ? String(dateStr).slice(0, 10) : "-"}
                    </span>
                );
            },
        },
        {
            accessorKey: "total",
            header: ({ column }) => <SortableHeader column={column} label="Total" />,
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-slate-900 whitespace-nowrap text-center block">
                    ${Number(row.original.total || 0).toLocaleString("es-CO")}
                </span>
            ),
        },
        {
            id: "balance",
            header: ({ column }) => <SortableHeader column={column} label="Por pagar" />,
            cell: ({ row }) => (
                <span className="text-xs font-semibold text-slate-900 whitespace-nowrap text-center block">
                    ${Number(row.original.balance || 0).toLocaleString("es-CO")}
                </span>
            ),
        },
        {
            id: "bill_status",
            header: ({ column }) => <SortableHeader column={column} label="Estado" />,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    <BillStatusBadge status={row.original.bill_status} />
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <span className="sr-only">Acciones</span>,
            cell: ({ row }) => {
                const bill = row.original;

                return (
                    <div className="flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            onClick={() => router.push(`/expenses/payments/new?type=bill&document_id=${bill.id}`)}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                            title="Agregar pago"
                        >
                            <DollarSign className="w-4 h-4" />
                        </button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md cursor-pointer"
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

                                {onCancel && (
                                    <DropdownMenuItem
                                        onClick={() => onCancel(bill.id)}
                                        className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-destructive cursor-pointer rounded-lg hover:bg-destructive/10"
                                    >
                                        <Ban className="w-3.5 h-3.5" />
                                        <span>Anular</span>
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
