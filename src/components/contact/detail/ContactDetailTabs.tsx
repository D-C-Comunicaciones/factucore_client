"use client";

import React, { useState } from "react";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactDetailTabsProps {
    contact: any;
}

export function ContactDetailTabs({ contact }: ContactDetailTabsProps) {
    const [activeTab, setActiveTab] = useState("Transacciones");

    const tabs = [
        "Transacciones",
        "Facturas",
        "Facturas de proveedor",
        "Documentos de soporte",
        "Devoluciones en ventas",
        "Notas débito",
        "Notas débito clientes",
        "Cotizaciones",
        "Remisiones",
        "Órdenes de compra",
        "Comprobantes contables",
        "Notas de ajuste"
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Tabs Header */}
            <div className="flex items-center border-b border-slate-200 px-2 pt-2 bg-white">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 flex-shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex-1 overflow-x-auto no-scrollbar flex items-center">
                    <div className="flex px-2 space-x-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                                    activeTab === tab
                                        ? "border-primary text-[#0F2843]"
                                        : "border-transparent text-slate-500 hover:text-slate-800"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 flex-shrink-0">
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>

            {/* Tab Content Header */}
            <div className="flex justify-end p-3 border-b border-slate-100">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-800 font-medium">
                    <Filter className="w-4 h-4 mr-2" /> Filtrar
                </Button>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 bg-slate-50 border-b border-slate-200 px-6 py-3 text-xs font-medium text-slate-500">
                <div>Fecha ↓</div>
                <div>Detalle</div>
                <div>Estado ↓</div>
                <div>Gastos</div>
                <div>Ingresos</div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-b border-slate-200">
                <h2 className="text-xl font-bold text-[#0F2843] mb-3">
                    Aún no tienes transacciones<br />con este contacto
                </h2>
                <p className="text-sm text-slate-500 mb-8">
                    ¡Haz clic en cualquiera de las opciones para crear tu<br />primera transacción!
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" className="h-9 border-slate-200 text-slate-700 font-medium shadow-sm">
                        + Nuevo ingreso
                    </Button>
                    <Button variant="outline" className="h-9 border-slate-200 text-slate-700 font-medium shadow-sm">
                        + Nuevo pago
                    </Button>
                </div>
            </div>

            {/* Pagination Footer */}
            <div className="flex justify-end p-3 text-sm text-slate-400 bg-white gap-4 items-center">
                <span>1-0 de 0</span>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 cursor-not-allowed" disabled>&larr;</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 cursor-not-allowed" disabled>&rarr;</Button>
                </div>
            </div>
        </div>
    );
}
