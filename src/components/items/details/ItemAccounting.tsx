"use client";

import * as React from "react";
import { Info, Printer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ItemAccounting() {
    const [expanded, setExpanded] = React.useState(false);
    const [bannerOpen, setBannerOpen] = React.useState(true);

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm mb-8 transition-all duration-300">
            {!expanded ? (
                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                    <p className="text-[17px] font-bold text-slate-800">Contabilidad</p>
                    <Button
                        variant="outline"
                        onClick={() => setExpanded(true)}
                        className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black transition-colors font-medium text-xs shadow-none"
                    >
                        Mostrar detalle
                    </Button>
                </div>
            ) : (
                <div className="p-6 transition-all duration-300">
                    <div className="flex flex-wrap items-start justify-between mb-5">
                        <div>
                            <p className="text-[17px] font-bold text-slate-800 mb-2">Contabilidad</p>
                            <p className="text-[14px] font-semibold text-slate-700 mb-1">
                                Asiento contable: <span className="font-normal text-slate-600">II-1</span>
                            </p>
                            <p className="text-[14px] font-semibold text-slate-700">
                                Fecha: <span className="font-normal text-slate-600">30/05/2026</span>
                            </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setExpanded(false)}
                                className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black transition-colors font-medium text-xs shadow-none"
                            >
                                Ocultar detalle
                            </Button>
                            <Button
                                variant="outline"
                                className="h-auto px-3 py-1 rounded-lg border border-slate-300 bg-white text-black hover:bg-slate-100 hover:text-black transition-colors font-medium text-xs shadow-none"
                            >
                                <Printer className="w-3.5 h-3.5 mr-1 text-black" />
                                Imprimir
                            </Button>
                        </div>
                    </div>

                    {bannerOpen && (
                        <div className="bg-[#eff2ff] border border-[#dbeafe] rounded-lg p-4 flex items-start gap-3 mb-6 relative animate-in fade-in slide-in-from-top duration-300">
                            <div className="mt-0.5">
                                <Info className="w-5 h-5 text-[#4f46e5]" />
                            </div>
                            <p className="text-[14px] text-[#334155] font-medium pr-8">
                                Visualiza el movimiento contable de este comprobante. Puedes personalizar las cuentas contables y sus códigos
                            </p>
                            <button
                                onClick={() => setBannerOpen(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors duration-200"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="rounded-lg border border-slate-200 overflow-hidden">
                        <div className="w-full overflow-x-auto hide-scrollbar">
                            <table className="w-full min-w-[700px] text-left">
                                <thead className="bg-slate-50/50 border-b border-border">
                                    <tr>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Tercero</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Código</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Cuenta Contable</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap text-center">Centro de costo</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Cargo</th>
                                        <th className="h-9 px-2 text-xs font-medium text-muted-foreground whitespace-nowrap">Abono</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white">
                                    <tr className="border-b border-border hover:bg-muted/50">
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap font-medium">Inventarios</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap font-medium">$1.123,000000</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap"></td>
                                    </tr>
                                    <tr className="border-b border-border hover:bg-muted/50">
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap font-medium">Ajustes iniciales en inventario</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap text-center">---</td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap"></td>
                                        <td className="h-10 px-2 py-2 text-xs text-foreground whitespace-nowrap font-medium">$1.123,000000</td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-white border-t-2 border-slate-200">
                                    <tr>
                                        <td colSpan={4} className="px-5 py-4 font-bold text-[14px] text-slate-800 text-right">TOTAL</td>
                                        <td className="px-5 py-4 font-bold text-[14px] text-slate-800">$1.123,000000</td>
                                        <td className="px-5 py-4 font-bold text-[14px] text-slate-800">$1.123,000000</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}