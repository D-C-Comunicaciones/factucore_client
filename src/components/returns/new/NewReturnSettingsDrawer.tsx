"use client";

import { useState, useEffect } from "react";
import { X, HelpCircle } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface ReturnSearchSettings {
    currency: string;
    costCenter: string;
    warehouse: string;
    priceList: string;
    deliveryOrder: string;
    purchaseOrder: string;
}

export const DEFAULT_RETURN_SEARCH_SETTINGS: ReturnSearchSettings = {
    currency: "none",
    costCenter: "",
    warehouse: "none",
    priceList: "none",
    deliveryOrder: "",
    purchaseOrder: "",
};

const NONE_OPTION = { value: "none", label: "No seleccionado" };
const SAME_AS_INVOICE_OPTION = { value: "same_as_invoice", label: "Igual a la factura" };

export function NewReturnSettingsDrawer({
    isOpen,
    onClose,
    settings,
    onSave,
    costCenterOptions,
    warehouseOptions,
    priceListOptions,
}: {
    isOpen: boolean;
    onClose: () => void;
    settings: ReturnSearchSettings;
    onSave: (settings: ReturnSearchSettings) => void;
    costCenterOptions: { value: string; label: string; description?: string }[];
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
}) {
    const [local, setLocal] = useState<ReturnSearchSettings>(settings);

    // Sync local draft state whenever the drawer opens
    useEffect(() => {
        if (isOpen) setLocal(settings);
    }, [isOpen, settings]);

    const handleSave = () => {
        onSave(local);
        onClose();
    };

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/20 z-40 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />
            <div
                className={cn(
                    "fixed inset-y-0 right-0 w-[380px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">Más ajustes de tu devolución</h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors cursor-pointer">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <h3 className="text-sm font-medium text-muted-foreground">Buscar documentos por</h3>

                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-medium text-foreground">
                                Moneda <span className="text-primary">*</span>
                            </label>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                                        Filtra los documentos según la moneda usada en la factura original.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={local.currency}
                            onValueChange={(val) => setLocal((prev) => ({ ...prev, currency: val }))}
                            options={[NONE_OPTION, SAME_AS_INVOICE_OPTION]}
                            placeholder="No seleccionado"
                            className="w-full text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Centro de costo <span className="text-primary">*</span>
                        </label>
                        <SearchableSelect
                            value={local.costCenter}
                            onValueChange={(val) => setLocal((prev) => ({ ...prev, costCenter: val }))}
                            options={costCenterOptions}
                            placeholder="No seleccionado"
                            searchPlaceholder="Buscar centro de costo..."
                            emptyMessage="No se han encontrado centros de costo"
                            className="w-full text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Bodega <span className="text-primary">*</span>
                        </label>
                        <SearchableSelect
                            value={local.warehouse}
                            onValueChange={(val) => setLocal((prev) => ({ ...prev, warehouse: val }))}
                            options={[NONE_OPTION, SAME_AS_INVOICE_OPTION, ...warehouseOptions]}
                            placeholder="No seleccionado"
                            searchPlaceholder="Buscar bodega..."
                            className="w-full text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-medium text-foreground">
                                Lista de precios <span className="text-primary">*</span>
                            </label>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                                        Filtra los documentos según la lista de precios usada en la factura original.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={local.priceList}
                            onValueChange={(val) => setLocal((prev) => ({ ...prev, priceList: val }))}
                            options={[NONE_OPTION, SAME_AS_INVOICE_OPTION, ...priceListOptions]}
                            placeholder="No seleccionado"
                            searchPlaceholder="Buscar lista de precios..."
                            className="w-full text-foreground"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Orden de entrega</label>
                        <Input
                            value={local.deliveryOrder}
                            onChange={(e) => setLocal((prev) => ({ ...prev, deliveryOrder: e.target.value }))}
                            className="w-full rounded-lg h-9"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Orden de compra</label>
                        <Input
                            value={local.purchaseOrder}
                            onChange={(e) => setLocal((prev) => ({ ...prev, purchaseOrder: e.target.value }))}
                            className="w-full rounded-lg h-9"
                        />
                    </div>
                </div>

                <div className="p-4 border-t border-border flex items-center justify-between gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 text-sm font-medium text-foreground border border-border rounded-lg hover:bg-muted transition-colors cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className="flex-1 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        Guardar cambios
                    </button>
                </div>
            </div>
        </>
    );
}
