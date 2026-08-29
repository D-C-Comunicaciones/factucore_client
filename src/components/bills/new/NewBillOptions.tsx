import React from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

interface NewBillOptionsProps {
    warehouseId?: string;
    setWarehouseId?: (val: string) => void;
    warehousesList?: any[];
    showWarehouse?: boolean;
}

export function NewBillOptions({
    warehouseId = "1",
    setWarehouseId,
    warehousesList = [],
    showWarehouse = true,
}: NewBillOptionsProps) {
    if (!showWarehouse) return null;

    const warehouseOptions = warehousesList.length > 0
        ? warehousesList.map((w) => ({
            value: String(w.id),
            label: w.name,
        }))
        : [{ value: "1", label: "Principal" }];

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
                    />
                </div>
            </div>
        </div>
    );
}
