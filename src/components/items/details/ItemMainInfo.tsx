"use client";

import * as React from "react";
import { ChevronDown, Box, Tag, ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ItemResponse } from "@/types/items";
import { ProductGalleryModal } from "./ProductGalleryModal";
import { Button } from "@/components/ui/button";

interface ItemMainInfoProps {
    item: ItemResponse;
    categoryName: string | null;
    unitName: string;
    itemTypeName: string;
    taxName: string;
    formatMoney: (val: number | undefined | null) => string;
}

function InfoField({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-sm text-slate-500 mb-1">{label}</p>
            <div className="border-b border-slate-200/60 pb-1.5">
                <p className="text-[15px] text-slate-800 font-medium">{value || "-"}</p>
            </div>
        </div>
    );
}

function InfoChip({
    icon: Icon,
    label,
    value,
    active,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    active: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <div
                className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center",
                    active ? "bg-primary/10" : "bg-slate-100"
                )}
            >
                <Icon
                    className={cn(
                        "w-4 h-4",
                        active ? "text-primary" : "text-slate-400"
                    )}
                />
            </div>
            <div>
                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                <p
                    className={cn(
                        "text-[13px] font-bold",
                        active ? "text-primary" : "text-slate-300"
                    )}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}

export function ItemMainInfo({
    item,
    categoryName,
    unitName,
    itemTypeName,
    taxName,
    formatMoney,
}: ItemMainInfoProps) {
    const [advancedOpen, setAdvancedOpen] = React.useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);

    if (!item) return null;

    const isProduct = item.basic_info.type_item_id === 1;
    const isInventoriable = item.inventory?.is_inventoriable !== false;
    const allowNegative = item.inventory?.allow_negative_stock ?? false;

    const basePrice = parseFloat(item.pricing?.base_price ?? "0");
    const totalPrice = parseFloat(item.pricing?.total_price ?? "0");
    const costPrice = parseFloat(item.pricing?.default_cost_price ?? "0");

    return (
        <>
            <ProductGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                images={item.images?.map(img => ({ url: img.url, isFavorite: false })) || []}
            />
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-8 mb-4">
                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
                    {/* LEFT COLUMN - White */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                <InfoField label="Código" value={item.id} />
                                <InfoField label="Referencia" value={item.basic_info.reference} />
                                <InfoField label="Categoría" value={categoryName} />
                                <InfoField label="Tipo de ítem" value={itemTypeName} />
                                <InfoField label="Unidad de medida" value={unitName} />
                                <InfoField
                                    label="Código estándar"
                                    value={item.basic_info.standard_code ? `${item.basic_info.standard_code.code} - ${item.basic_info.standard_code.name}` : "-"}
                                />
                                <InfoField label="Código de barras" value={item.basic_info.barcode} />
                            </div>

                            <div className="mt-8">
                                <InfoField label="Descripción" value={item.basic_info.description || "-"} />
                            </div>

                            {isProduct && (
                                <div className="flex items-center gap-10 pt-8 pb-8">
                                    <InfoChip
                                        icon={Box}
                                        label="Ítem inventariable"
                                        value={isInventoriable ? "Activado" : "Desactivado"}
                                        active={isInventoriable}
                                    />
                                    <InfoChip
                                        icon={Tag}
                                        label="Venta en negativo"
                                        value={allowNegative ? "Activado" : "Desactivado"}
                                        active={allowNegative}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Opciones avanzadas BUTTON */}
                        <div className="mt-auto flex items-end relative z-10 -mb-[1px] ml-4">
                            <button
                                type="button"
                                onClick={() => setAdvancedOpen(!advancedOpen)}
                                className={cn(
                                    "inline-flex items-center gap-1.5 h-9 px-4 text-primary font-medium text-sm transition-colors duration-200",
                                    advancedOpen
                                        ? "bg-white border border-slate-200/60 border-b-white rounded-t-lg"
                                        : "rounded-lg border border-transparent hover:bg-slate-50"
                                )}
                            >
                                Opciones avanzadas
                                <ChevronDown
                                    className={cn("w-4 h-4 transition-transform duration-300", advancedOpen && "rotate-180")}
                                />
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Gray */}
                    <div className={cn(
                        "bg-[#f8fafc] border border-slate-200/60 p-6 flex flex-col space-y-6",
                        advancedOpen ? "rounded-t-xl border-b-0 pb-6" : "rounded-xl"
                    )}>
                        <button
                            type="button"
                            onClick={() => setIsGalleryOpen(true)}
                            className="w-full aspect-square max-h-[280px] rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center transition-colors cursor-pointer group hover:border-primary/40 hover:bg-primary/5 overflow-hidden bg-white"
                        >
                            {item.images && item.images.length > 0 ? (
                                <img
                                    src={item.images[0].url}
                                    alt={item.basic_info.name}
                                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full flex items-center justify-center transition-colors">
                                    <ImagePlus className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                                </div>
                            )}
                        </button>

                        <div className="space-y-4">
                            <div className="flex items-end justify-between border-b border-slate-200 pb-3">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-semibold text-slate-500">Precio Total</p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {formatMoney(totalPrice)}
                                    </p>
                                </div>
                                <span className="text-xs font-medium text-slate-500 mb-1">COP</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3">
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-1">Precio sin impuesto</p>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {formatMoney(basePrice)}
                                    </p>
                                    <p className="text-xs text-slate-400">COP</p>
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-slate-500 mb-1">Impuesto</p>
                                    <p className="text-sm font-semibold text-slate-700">{taxName}</p>
                                </div>
                            </div>

                            {isProduct && (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <p className="text-xs font-medium text-slate-500 mb-1">Costo inicial</p>
                                        <p className="text-sm font-semibold text-slate-700">{formatMoney(costPrice)}</p>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ADVANCED SECTION */}
                <div className={cn(
                    "transition-all duration-300",
                    advancedOpen ? "opacity-100 max-h-[600px] visible" : "opacity-0 max-h-0 invisible overflow-hidden"
                )}>
                    <div className={cn(advancedOpen && "border-t border-slate-200/60")}>
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
                            {/* LEFT COLUMN ADVANCED - White */}
                            <div className="pt-8">
                                <p className="font-semibold text-slate-800 mb-6">Configuración contabilidad</p>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                                    <InfoField label="Cuenta Contable" value="Ventas" />
                                    <InfoField label="Cuenta de inventario" value="Inventarios" />
                                    <InfoField label="Cuenta de costo de venta" value="Costos del inventario" />
                                </div>
                            </div>

                            {/* RIGHT COLUMN ADVANCED - Gray */}
                            <div className="bg-[#f8fafc] border-x border-b border-slate-200/60 rounded-b-xl p-6">
                                <p className="font-semibold text-slate-800">Campos adicionales</p>
                                <p className="text-sm text-slate-500 mt-4">No hay campos adicionales</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}