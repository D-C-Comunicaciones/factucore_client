"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown, Edit, Plus, Copy, Download, Trash2, Paperclip, Image, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ItemResponse } from "@/types/items";

/* ========================================================================== */
/* SUB-COMPONENTS                                                             */
/* ========================================================================== */

function StatusToggle({
    active,
    onToggle,
    isTogglingStatus,
}: {
    active: boolean;
    onToggle: () => void;
    isTogglingStatus?: boolean;
}) {
    return (
        <div className="inline-flex items-center rounded-lg overflow-hidden border border-border/40">
            <button
                type="button"
                onClick={active ? undefined : onToggle}
                disabled={isTogglingStatus}
                className={cn(
                    "px-3 py-1 text-xs font-medium transition-all border-r border-border/40",
                    active
                        ? "bg-primary text-white"
                        : "bg-white text-muted-foreground hover:bg-muted/50"
                )}
            >
                Activado
            </button>
            <button
                type="button"
                onClick={active ? onToggle : undefined}
                disabled={isTogglingStatus}
                className={cn(
                    "px-3 py-1 text-xs font-medium transition-all",
                    !active
                        ? "bg-destructive text-white"
                        : "bg-white text-muted-foreground hover:bg-muted/50"
                )}
            >
                Desactivado
            </button>
        </div>
    );
}

interface ItemHeaderProps {
    item: ItemResponse;
    onToggleStatus: () => void;
    onDelete: () => void;
    isTogglingStatus?: boolean;
}

export function ItemHeader({
    item,
    onToggleStatus,
    onDelete,
    isTogglingStatus,
}: ItemHeaderProps) {
    const router = useRouter();

    return (
        <div className="mb-6">
            <button
                type="button"
                onClick={() => router.push("/items")}
                className="flex items-center gap-1.5 text-[14px] text-slate-500 hover:text-slate-800 transition-colors mb-3 group font-medium"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Volver a ítems
            </button>

            <h1 className="text-[28px] font-bold text-[#1e293b] mb-5">
                {item.basic_info?.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5">
                <StatusToggle active={item.basic_info?.is_active ?? false} onToggle={onToggleStatus} isTogglingStatus={isTogglingStatus} />

                <Button
                    variant="outline"
                    className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-foreground hover:bg-slate-50 transition-colors shadow-none"
                    onClick={() => router.push(`/invoices/new?item=${item.id}`)}
                >
                    <Plus className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <span className="font-medium text-xs text-slate-800">Facturar este ítem</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-foreground hover:bg-slate-50 transition-colors shadow-none"
                >
                    <Plus className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <span className="font-medium text-xs text-slate-800">Comprar este ítem</span>
                </Button>

                <Button
                    variant="outline"
                    className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-foreground hover:bg-slate-50 transition-colors shadow-none"
                    onClick={() => router.push(`/items/${item.id}/edit`)}
                >
                    <Edit className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                    <span className="font-medium text-xs text-slate-800">Editar</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-[#0f172a] hover:bg-slate-50 font-medium text-xs transition-colors shadow-none focus-visible:ring-0"
                        >
                            Más acciones
                            <ChevronDown className="w-3.5 h-3.5 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white text-popover-foreground border-none rounded-xl p-1 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] ring-1 ring-black/5"
                    >
                        <DropdownMenuItem
                            className="hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 transition-colors cursor-pointer py-2 px-3 rounded-lg text-sm text-slate-700 font-medium"
                        >
                            <Paperclip className="w-4 h-4 mr-3 text-slate-500" />
                            Adjuntar archivo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 transition-colors cursor-pointer py-2 px-3 rounded-lg text-sm text-slate-700 font-medium"
                        >
                            <Image className="w-4 h-4 mr-3 text-slate-500" />
                            Adjuntar imagen del ítem
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer py-2 px-3 rounded-lg text-sm text-[#b91c1c] font-medium"
                            onClick={onDelete}
                        >
                            <Trash className="w-4 h-4 mr-3 text-[#b91c1c]" />
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}