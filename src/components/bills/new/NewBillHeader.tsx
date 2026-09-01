"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

interface NewBillHeaderProps {
    isEdit?: boolean;
    showWarehouse?: boolean;
    setShowWarehouse?: (val: boolean) => void;
}

export function NewBillHeader({
    isEdit = false,
    showWarehouse = true,
    setShowWarehouse,
}: NewBillHeaderProps) {
    const [isOpen, setIsOpen] = useState(false);
    const title = isEdit ? "Editar factura de compra" : "Nueva factura de compra";

    return (
        <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-primary mb-2 font-medium">
                <Link href="/expenses/bills" className="hover:underline cursor-pointer">
                    Facturas de compra
                </Link>
                <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
                <span className="text-slate-500">{title}</span>
            </div>

            {/* Title & Options button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-[#001D4A]">
                    {title}
                </h1>

                <div className="flex items-center gap-2 relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all border h-[38px] cursor-pointer ${
                            isOpen
                                ? "border-primary bg-white text-primary shadow-sm ring-1 ring-primary/20"
                                : "border-gray-200 bg-white text-gray-700 hover:border-primary hover:text-primary"
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Personalizar opciones</span>
                    </button>

                    {isOpen && (
                        <>
                            {/* Click outside overlay */}
                            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                            {/* Popover (Matching screenshot) */}
                            <div className="absolute right-0 top-full mt-2 w-[220px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 animate-in fade-in-50 slide-in-from-top-1 duration-200">
                                <h4 className="text-[13px] font-bold text-primary mb-2">
                                    Opciones disponibles
                                </h4>
                                <div className="border-t border-gray-100 my-2"></div>

                                <div className="space-y-3 pt-1">
                                    <label className="flex items-center justify-between cursor-pointer group">
                                        <span className="text-[13px] text-gray-700 group-hover:text-gray-900 font-medium">
                                            Bodega
                                        </span>
                                        <input
                                            type="checkbox"
                                            checked={showWarehouse}
                                            onChange={(e) => setShowWarehouse?.(e.target.checked)}
                                            className="w-4 h-4 rounded text-primary border-gray-300 focus:ring-primary accent-primary cursor-pointer"
                                        />
                                    </label>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
