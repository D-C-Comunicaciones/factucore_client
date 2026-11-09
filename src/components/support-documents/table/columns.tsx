"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Eye, Pencil, Trash2, Printer, FileCode, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type { SupportDocument } from "@/types/supportDocument";
import { showToast } from "@/components/sonner/CustomToaster";
import { SupportDocumentsService } from "@/lib/supportDocuments";

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

export function DianStatusBadge({ status }: { status: any }) {
    const estadoStr = typeof status === "string" ? status : (status?.name || status?.code || "");
    const estado = estadoStr.toLowerCase();

    if (estado === "aprobada" || estado === "approved" || estado === "aceptada" || estado === "accepted" || estado === "aprobado") {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Aprobado
            </span>
        );
    }

    if (estado === "no aprobada" || estado === "not_approved" || estado === "rechazada" || estado === "rejected" || estado === "no aprobado") {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                    <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="13" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                No aprobado
            </span>
        );
    }

    if (estado === "no electrónica" || estado === "no_electronica") {
        return <span className="text-xs text-gray-600">No electrónica</span>;
    }

    if (estado === "por emitir" || estado === "to_send" || !estado || estado === "pendiente" || estado === "no enviada" || estado === "draft" || estado === "borrador") {
        return (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Por emitir
            </span>
        );
    }

    return <span className="text-xs text-gray-500">{estadoStr || "Desconocido"}</span>;
}

export function StatusBadge({ status, pendingAmount }: { status: any; pendingAmount?: number }) {
    const rawEstadoStr = typeof status === "string" ? status : (status?.name || "");
    let estado = rawEstadoStr.toLowerCase();

    const isPendingFamily = estado === "por pagar" || estado === "por cobrar" || estado === "pendiente" || estado === "parcial" || estado === "vencida";
    if (isPendingFamily && pendingAmount !== undefined && pendingAmount <= 0.01) {
        estado = "pagado";
    }

    const estadoStr = estado === rawEstadoStr.toLowerCase() ? rawEstadoStr : estado;

    if (estado === "enviada" || estado === "sent" || estado === "emitida") {
        return (
            <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                Emitida
            </span>
        );
    }

    if (estado === "draft" || estado === "borrador") {
        return (
            <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
                Borrador
            </span>
        );
    }

    if (estado === "saved" || estado === "guardada" || estado === "guardado") {
        return (
            <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
                {estadoStr || "Guardado"}
            </span>
        );
    }

    const styles: Record<string, string> = {
        pagada: "bg-green-100 text-green-700",
        pagado: "bg-green-100 text-green-700",
        cobrada: "bg-green-100 text-green-700",
        "por pagar": "bg-blue-100 text-blue-700",
        "por cobrar": "bg-blue-100 text-blue-700",
        parcial: "bg-yellow-100 text-yellow-700",
        pendiente: "bg-primary/10 text-primary",
        vencida: "bg-red-100 text-red-700",
        anulada: "bg-red-100 text-red-700",
        anulado: "bg-red-100 text-red-700",
        activo: "bg-green-100 text-green-700",
        activa: "bg-green-100 text-green-700",
    };

    const style = styles[estado] ?? "bg-gray-100 text-gray-700";
    return (
        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${style}`}>
            {estadoStr ? estadoStr.charAt(0).toUpperCase() + estadoStr.slice(1) : "Desconocido"}
        </span>
    );
}

export function getSupportDocumentColumns(
    router: ReturnType<typeof useRouter>,
    onCancel?: (id: number | string) => void
): ColumnDef<SupportDocument>[] {
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
            accessorKey: "number",
            header: ({ column }) => <SortableHeader column={column} label="Número" />,
            cell: ({ row }) => {
                const doc = row.original;
                const numberStr = `${doc.prefix || ""}${doc.number || doc.id}`;
                return (
                    <span className="text-xs text-gray-900 font-medium text-left">
                        {numberStr}
                    </span>
                );
            },
        },
        {
            id: "contact",
            header: "Proveedor",
            cell: ({ row }) => {
                const contact = row.original.contact;
                const name = contact?.registration_name || contact?.name || `${contact?.first_name || ""} ${contact?.last_name || ""}`.trim();
                return (
                    <span className="text-xs text-gray-900 text-left block truncate max-w-[200px]">
                        {name || "Sin proveedor"}
                    </span>
                );
            },
        },
        {
            accessorKey: "created_at",
            header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="Creación" /></div>,
            cell: ({ row }) => {
                const date = row.original.created_at || row.original.issue_date;
                return <span className="text-xs text-gray-600 text-center block">{date ? String(date).slice(0, 10) : "-"}</span>;
            },
        },
        {
            accessorKey: "due_date",
            header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="Vencimiento" /></div>,
            cell: ({ row }) => {
                const date = row.original.due_date;
                return <span className="text-xs text-gray-600 text-center block">{date ? String(date).slice(0, 10) : "-"}</span>;
            },
        },
        {
            accessorKey: "total",
            header: () => <div className="text-right">Total</div>,
            cell: ({ row }) => {
                const totalNum = Number(row.original.total) || 0;
                return (
                    <div className="text-xs text-gray-900 font-normal text-right">
                        $ {totalNum.toLocaleString("es-CO")}
                    </div>
                );
            },
        },
        {
            id: "balance",
            header: () => <div className="text-right">Por pagar</div>,
            cell: ({ row }) => {
                const balanceNum = Number(row.original.balance) || 0;
                return (
                    <div className="text-xs text-gray-900 font-normal text-right">
                        $ {balanceNum.toLocaleString("es-CO")}
                    </div>
                );
            },
        },
        {
            id: "dian_status",
            header: "Estado DIAN",
            cell: ({ row }) => (
                <div className="text-left">
                    <DianStatusBadge status={row.original.dian_status} />
                </div>
            ),
        },
        {
            id: "support_document_status",
            header: "Estado",
            cell: ({ row }) => {
                return (
                    <div className="text-left">
                        <StatusBadge status={row.original.support_document_status} pendingAmount={Number(row.original.balance)} />
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const doc = row.original;

                const handlePrint = async (e?: React.MouseEvent) => {
                    if (e) e.stopPropagation();
                    try {
                        const blob = await SupportDocumentsService.printPdfBlob(doc.id);
                        const url = window.URL.createObjectURL(blob);
                        window.open(url, "_blank");
                    } catch {
                        showToast("Error al generar PDF del documento", "error");
                    }
                };

                const handleDownloadXml = async (e?: React.MouseEvent) => {
                    if (e) e.stopPropagation();
                    try {
                        const blob = await SupportDocumentsService.downloadXmlBlob(doc.id);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = `DocumentoSoporte_${doc.prefix || ""}${doc.number || doc.id}.xml`;
                        a.click();
                        window.URL.revokeObjectURL(url);
                    } catch {
                        showToast("Error al descargar XML", "error");
                    }
                };

                return (
                    <div className="flex items-center justify-end gap-1">
                        {/* Botón Agregar Pago */}
                        <TooltipProvider delayDuration={150}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 hover:bg-gray-100 transition-colors text-slate-700 focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/expenses/support-documents/${doc.id}?tab=payments`);
                                        }}
                                    >
                                        <div className="flex items-center justify-center -space-x-0.5">
                                            <span className="text-[10px] font-bold mt-0.5 mr-[1px]">$</span>
                                            <Coins className="h-[15px] w-[15px]" strokeWidth={2.5} />
                                        </div>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-[#1e293b] text-white border-none" side="top">
                                    <p className="font-medium">Agregar pago</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        {/* Menú Más Acciones (...) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-gray-100 transition-colors text-slate-700 focus-visible:ring-1 focus-visible:ring-primary cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                                        <circle cx="10" cy="4.5" r="1.2" fill="currentColor" />
                                        <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                                        <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
                                    </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={8} className="mt-2 min-w-[150px] bg-white border border-border shadow-lg rounded-xl p-1">
                                <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                    onSelect={() => router.push(`/expenses/support-documents/${doc.id}`)}
                                    className="cursor-pointer text-xs py-2 hover:bg-muted"
                                >
                                    <Eye className="w-4 h-4 mr-2 text-slate-700" />
                                    Ver detalle
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                    onSelect={() => handlePrint()}
                                    className="cursor-pointer text-xs py-2 hover:bg-muted"
                                >
                                    <Printer className="w-4 h-4 mr-2 text-slate-700" />
                                    Imprimir
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                    onSelect={() => handleDownloadXml()}
                                    className="cursor-pointer text-xs py-2 hover:bg-muted"
                                >
                                    <FileCode className="w-4 h-4 mr-2 text-slate-700" />
                                    Descargar XML
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => e.stopPropagation()}
                                    onSelect={() => router.push(`/expenses/support-documents/${doc.id}/edit`)}
                                    className="cursor-pointer text-xs py-2 hover:bg-muted"
                                >
                                    <Pencil className="w-4 h-4 mr-2 text-slate-700" />
                                    Editar
                                </DropdownMenuItem>
                                {onCancel && (
                                    <DropdownMenuItem
                                        onClick={(e) => e.stopPropagation()}
                                        onSelect={() => onCancel(doc.id)}
                                        className="cursor-pointer text-xs py-2 text-red-600 focus:text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Anular
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
            size: 48,
        },
    ];
}
