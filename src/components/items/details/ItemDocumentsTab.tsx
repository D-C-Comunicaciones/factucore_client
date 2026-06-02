"use client";

import * as React from "react";
import { Filter, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
    { key: "ventas", label: "Facturas de venta" },
    { key: "compras", label: "Facturas de compras" },
    { key: "soporte", label: "Documentos soporte" },
    { key: "credito", label: "Notas de crédito" },
    { key: "debito", label: "Notas débito" },
    { key: "debito_clientes", label: "Notas débito clientes" },
    { key: "cotizaciones", label: "Cotizaciones" },
    { key: "ordenes", label: "Órdenes de compra" },
    { key: "transferencias", label: "Transferencias" },
    { key: "ajuste", label: "Notas de ajuste" },
];

export function ItemDocumentsTab() {
    const [activeTab, setActiveTab] = React.useState("ventas");

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = React.useState(false);
    const [canScrollRight, setCanScrollRight] = React.useState(false);

    const updateScrollButtons = React.useCallback(() => {
        const el = scrollContainerRef.current;

        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 0);

        setCanScrollRight(
            el.scrollLeft + el.clientWidth < el.scrollWidth - 2
        );
    }, []);

    const scrollLeft = () => {
        const el = scrollContainerRef.current;

        if (!el) return;

        el.scrollBy({
            left: -300,
            behavior: "smooth",
        });
    };

    const scrollRight = () => {
        const el = scrollContainerRef.current;

        if (!el) return;

        el.scrollBy({
            left: 300,
            behavior: "smooth",
        });
    };

    React.useEffect(() => {
        updateScrollButtons();

        const el = scrollContainerRef.current;

        if (!el) return;

        el.addEventListener("scroll", updateScrollButtons);
        window.addEventListener("resize", updateScrollButtons);

        return () => {
            el.removeEventListener("scroll", updateScrollButtons);
            window.removeEventListener("resize", updateScrollButtons);
        };
    }, [updateScrollButtons]);

    return (
        <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden mb-4 w-full">
            {/* TABS */}
            <div className="relative border-b border-slate-200 w-full overflow-hidden">

                {canScrollLeft && (
                    <button
                        type="button"
                        onClick={scrollLeft}
                        className="absolute left-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-r from-white via-white to-transparent text-slate-400 hover:text-primary transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                )}

                <div className="overflow-hidden w-full">
                    <div
                        ref={scrollContainerRef}
                        className="flex flex-nowrap overflow-hidden scroll-smooth"
                        style={{
                            scrollBehavior: "smooth",
                        }}
                    >
                        {TABS.map((tab) => (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={cn(
                                    "px-4 py-3 whitespace-nowrap border-b-2 flex-shrink-0 text-[14px] font-medium transition-all duration-200",
                                    activeTab === tab.key
                                        ? "text-primary border-primary"
                                        : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {canScrollRight && (
                    <button
                        type="button"
                        onClick={scrollRight}
                        className="absolute right-0 top-0 bottom-0 z-20 w-10 flex items-center justify-center bg-gradient-to-l from-white via-white to-transparent text-slate-400 hover:text-primary transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="p-6">
                <div className="border border-slate-200 rounded-lg overflow-hidden">

                    {/* FILTER */}
                    <div className="px-5 py-3 border-b border-slate-200 flex items-center bg-white">
                        <button
                            type="button"
                            className="flex items-center gap-1.5 text-[14px] font-medium text-slate-600 hover:text-slate-800 transition-colors"
                        >
                            <Filter className="w-4 h-4 text-slate-500" />
                            Filtrar
                        </button>
                    </div>

                    {/* EMPTY */}
                    <div className="flex items-center justify-center py-16 bg-white">
                        <p className="text-[14px] font-medium text-slate-500">
                            No hay contenido disponible
                        </p>
                    </div>

                    {/* PAGINATION */}
                    <div className="px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-[13px] font-medium text-slate-500">
                                Resultados por página:
                            </span>

                            <select className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/30">
                                <option>10</option>
                                <option>25</option>
                                <option>50</option>
                            </select>

                            <span className="text-[13px] font-medium text-slate-500">
                                1-1 De 1
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-[13px] font-medium text-slate-500">
                                Página
                            </span>

                            <input
                                type="number"
                                defaultValue={1}
                                className="w-12 bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[13px] font-medium text-center text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary/30"
                            />

                            <span className="text-[13px] font-medium text-slate-500">
                                De 1
                            </span>

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
        </div>
    );
}