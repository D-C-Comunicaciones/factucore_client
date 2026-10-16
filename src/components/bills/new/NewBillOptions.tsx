"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

interface NewBillOptionsProps {
    warehouseId?: string;
    setWarehouseId?: (val: string) => void;
    warehousesList?: any[];
    showWarehouse?: boolean;
    currencyId?: string;
    setCurrencyId?: (val: string) => void;
    currenciesList?: any[];
}

export function NewBillOptions({
    warehouseId = "1",
    setWarehouseId,
    warehousesList = [],
    showWarehouse = true,
    currencyId,
    setCurrencyId,
    currenciesList = [],
}: NewBillOptionsProps) {
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);

    if (!showWarehouse) return null;

    const warehouseOptions = warehousesList.length > 0
        ? warehousesList.map((w) => ({
            value: String(w.id),
            label: w.name,
        }))
        : [{ value: "1", label: "Principal" }];

    const currencyOptions = currenciesList.map((c: any) => ({
        value: String(c.id),
        label: c.code ? `${c.code} - ${c.name}` : c.name,
    }));

    const handleCreateWarehouse = async (data: { name: string; address: string; observations: string }) => {
        try {
            const res = await warehousesApi.createWarehouse({
                name: data.name,
                address: data.address,
                observations: data.observations,
                status: 1,
            });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });

            const newWarehouse = res?.data?.warehouse || res?.data || res;
            if (newWarehouse?.id) {
                setWarehouseId?.(String(newWarehouse.id));
            }
            setIsWarehouseModalOpen(false);
            showToast("Bodega creada exitosamente", "success");
        } catch {
            showToast("Error al crear la bodega", "error");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-border p-4 md:p-6 mb-6">
            <div className="flex flex-wrap md:flex-nowrap items-end gap-3 w-full">
                <div className="flex-1 min-w-[140px] max-w-[200px]">
                    <div className="flex items-center gap-1 mb-2">
                        <label className="text-sm font-medium text-foreground">
                            Bodega
                        </label>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Selecciona la bodega donde ingresarán los productos de esta compra.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SearchableSelect
                        value={warehouseId}
                        onValueChange={(val) => setWarehouseId?.(val)}
                        options={warehouseOptions}
                        placeholder="Selecciona bodega"
                        searchPlaceholder="Buscar bodega..."
                        footer={
                            <button
                                className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1"
                                onClick={() => setIsWarehouseModalOpen(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Nueva bodega
                            </button>
                        }
                    />
                </div>

                <div className="flex-1 min-w-[140px] max-w-[200px]">
                    <div className="flex items-center gap-1 mb-2">
                        <label className="text-sm font-medium text-foreground">
                            Moneda
                        </label>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Moneda en la que el proveedor facturó esta compra.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SearchableSelect
                        value={currencyId ?? ""}
                        onValueChange={(val) => setCurrencyId?.(val)}
                        options={currencyOptions}
                        placeholder="Selecciona moneda"
                        searchPlaceholder="Buscar moneda..."
                    />
                </div>
            </div>

            <NewWarehouseModal
                open={isWarehouseModalOpen}
                onOpenChange={setIsWarehouseModalOpen}
                onSave={handleCreateWarehouse}
                onCancel={() => setIsWarehouseModalOpen(false)}
            />
        </div>
    );
}
