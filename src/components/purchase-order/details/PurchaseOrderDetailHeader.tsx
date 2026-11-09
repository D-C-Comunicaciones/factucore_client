"use client";

import Link from "next/link";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PurchaseOrderStatusBadge } from "@/components/purchase-order/table/columns";
import type { PurchaseOrder } from "@/types/purchaseOrder";

interface PurchaseOrderDetailHeaderProps {
    purchaseOrder: PurchaseOrder;
    isAssociatedToInvoice: boolean;
    onEdit: () => void;
    onDeleteClick: () => void;
}

export function PurchaseOrderDetailHeader({
    purchaseOrder,
    isAssociatedToInvoice,
    onEdit,
    onDeleteClick,
}: PurchaseOrderDetailHeaderProps) {
    const defaultBtnClass =
        "h-9 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-colors shadow-sm font-medium";

    return (
        <div>
            <Link href="/sales/purchase-orders" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline mb-2">
                <ArrowLeft className="w-4 h-4" /> Volver a órdenes de compra recibidas
            </Link>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-2xl font-semibold text-[#0F2843] flex items-center gap-3">
                    Orden de compra {purchaseOrder.reference || `#${purchaseOrder.id}`}
                    <PurchaseOrderStatusBadge status={purchaseOrder.status} />
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" className={defaultBtnClass} onClick={onEdit}>
                        <Pencil className="w-4 h-4 mr-2" /> Editar
                    </Button>

                    {isAssociatedToInvoice ? (
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <Button variant="outline" size="sm" disabled className={`${defaultBtnClass} text-destructive`}>
                                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                                        </Button>
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                                    No se puede eliminar: ya está asociada a una factura.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            className={`${defaultBtnClass} text-destructive hover:text-destructive`}
                            onClick={onDeleteClick}
                        >
                            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
