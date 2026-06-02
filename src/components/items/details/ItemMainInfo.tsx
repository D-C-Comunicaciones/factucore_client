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
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-base text-slate-800 font-medium mt-1">{value || "-"}</p>
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
            <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm p-6 mb-4">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">

                    {/* LEFT COLUMN */}
                    <div>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-8">
                            <InfoField label="Código" value={item.id} />
                            <InfoField label="Referencia" value={item.basic_info.reference} />
                            <InfoField label="Categoría" value={categoryName} />
                            <InfoField label="Tipo de ítem" value={itemTypeName} />
                            <InfoField label="Unidad de medida" value={unitName} />
                        </div>

                        <div className="mt-8">
                            <InfoField label="Descripción" value={item.basic_info.description} />
                        </div>

                        {isProduct && (
                            <div className="flex items-center gap-10 pt-8 pb-2">
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

                        <div className="mt-8">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setAdvancedOpen(!advancedOpen)}
                                className="inline-flex items-center gap-1.5 hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200"
                            >
                                Opciones avanzadas
                                <ChevronDown
                                    className={cn("w-4 h-4 transition-transform duration-300", advancedOpen && "rotate-180")}
                                />
                            </Button>

                            <div className={cn(
                                "mt-6 border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-12 transition-all duration-300 overflow-hidden",
                                advancedOpen ? "opacity-100 max-h-[600px] visible" : "opacity-0 max-h-0 -mt-6 -pt-6 border-none invisible"
                            )}>
                                <div className="flex-1 space-y-4">
                                    <p className="font-semibold text-slate-800">Configuración contabilidad</p>
                                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                                        <div>
                                            <p className="text-sm text-slate-500">Cuenta Contable</p>
                                            <p className="text-base font-medium text-primary mt-1">Ventas</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Cuenta de inventario</p>
                                            <p className="text-base font-medium text-primary mt-1">Inventarios</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500">Cuenta de costo de venta</p>
                                            <p className="text-base font-medium text-primary mt-1">Costos del inventario</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full sm:w-[300px]">
                                    <p className="font-semibold text-slate-800">Campos adicionales</p>
                                    <p className="text-sm text-slate-500 mt-4">No hay campos adicionales</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6">
                        <button
                            type="button"
                            onClick={() => setIsGalleryOpen(true)}
                            className="w-full aspect-square max-h-[280px] rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center transition-colors cursor-pointer group hover:border-primary/40 hover:bg-primary/5 overflow-hidden"
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

                            <div className="grid grid-cols-2 gap-4 py-3 border-b border-slate-200">
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
                                    <div className="flex items-end justify-end">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="text-xs text-primary hover:text-primary/80 transition-colors h-auto p-0 font-semibold"
                                        >
                                            Cargar costo promedio
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}