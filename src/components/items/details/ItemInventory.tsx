"use client";

import * as React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemInventoryProps {
    inventoryQty: number;
}

export function ItemInventory({ inventoryQty }: ItemInventoryProps) {
    const [expanded, setExpanded] = React.useState(true);

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm mb-4 transition-all duration-300">
            <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <p className="text-base font-bold text-slate-800">
                        En inventario
                    </p>
                    <span className="inline-flex items-center justify-center min-w-[32px] h-7 px-2.5 rounded-full bg-slate-100 text-[13px] font-bold text-slate-700 border border-slate-200/60">
                        {inventoryQty}
                    </span>
                    <span className="text-[13px] text-slate-500 font-medium">
                        (0 en remisiones)
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black transition-colors font-medium text-xs shadow-none"
                    >
                        <Download className="w-3.5 h-3.5 mr-1 text-black" />
                        Historial
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setExpanded(!expanded)}
                        className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black transition-colors font-medium text-xs shadow-none"
                    >
                        {expanded ? "Ocultar detalle" : "Mostrar detalle"}
                    </Button>
                </div>
            </div>

            {expanded && (
                <div className="px-6 pb-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="rounded-lg border border-slate-200 overflow-hidden">

                        <div className="w-full overflow-x-auto hide-scrollbar">
                            <table className="w-full min-w-[600px] text-left">
                                <thead className="bg-slate-50/50 border-b border-border">
                                    <tr>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-left">Bodegas</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">Cantidad inicial</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">Cantidad actual</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">Cantidad mínima</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">Cantidad máxima</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">En remisiones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b border-border hover:bg-muted/50 cursor-pointer">
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap font-medium">Principal</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center">1</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center">1</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center"></td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center"></td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center">0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white rounded-b-xl">
                            <div className="flex items-center gap-3">
                                <span className="text-[13px] font-medium text-slate-500">Resultados por página:</span>
                                <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300">
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </select>
                                <span className="text-[13px] font-medium text-slate-500 ml-1">1-1 De 1</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-slate-500">Página</span>
                                <input
                                    type="number"
                                    defaultValue={1}
                                    className="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1 text-[13px] font-medium text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-slate-300"
                                />
                                <span className="text-[13px] font-medium text-slate-500">De 1</span>
                                <button
                                    type="button"
                                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors ml-1"
                                >
                                    <span className="text-xs">‹</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                                >
                                    <span className="text-xs">›</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}