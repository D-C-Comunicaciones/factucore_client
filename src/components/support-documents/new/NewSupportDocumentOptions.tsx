"use client";

import React, { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Input } from "@/components/ui/input";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { NewCostCenterModal } from "@/components/cost-centers/NewCostCenterModal";
import { warehousesApi } from "@/lib/warehouses";
import { showToast } from "@/components/sonner/CustomToaster";

interface NewSupportDocumentOptionsProps {
    currency: string;
    setCurrency: (c: string) => void;
    warehouseId: string | number | null;
    setWarehouseId: (w: string | number | null) => void;
    warehouses?: any[];
    warehouseOptions?: { value: string; label: string }[];
    costCenterId: string | null;
    setCostCenterId: (c: string | null) => void;
    costCenters?: any[];
    costCenterOptions?: { value: string; label: string; description?: string }[];
    physicalDocumentNumber?: string;
    setPhysicalDocumentNumber?: (n: string) => void;
    physicalReceiptNumber?: string;
    setPhysicalReceiptNumber?: (n: string) => void;
    showCurrency?: boolean;
    showWarehouse?: boolean;
    showCostCenter?: boolean;
}

export function NewSupportDocumentOptions({
    currency,
    setCurrency,
    warehouseId,
    setWarehouseId,
    warehouses = [],
    warehouseOptions: directWarehouseOptions,
    costCenterId,
    setCostCenterId,
    costCenters = [],
    costCenterOptions: directCostCenterOptions,
    physicalDocumentNumber,
    setPhysicalDocumentNumber,
    physicalReceiptNumber,
    setPhysicalReceiptNumber,
    showCurrency = true,
    showWarehouse = true,
    showCostCenter = true,
}: NewSupportDocumentOptionsProps) {
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);

    const effectivePhysicalDocNum = physicalReceiptNumber ?? physicalDocumentNumber ?? "";
    const handleSetPhysicalDocNum = (val: string) => {
        if (typeof setPhysicalReceiptNumber === 'function') {
            setPhysicalReceiptNumber(val);
        }
        if (typeof setPhysicalDocumentNumber === 'function') {
            setPhysicalDocumentNumber(val);
        }
    };

    const warehouseOptions = directWarehouseOptions || warehouses.map((w: any) => ({
        value: String(w.id),
        label: w.name || `Bodega ${w.id}`,
    }));

    const costCenterOptions = directCostCenterOptions || [
        { value: "none", label: "Ninguno" },
        ...costCenters.map((cc: any) => ({
            value: String(cc.id),
            label: cc.name || cc.code || `Centro ${cc.id}`,
        })),
    ];

    const handleCreateWarehouse = async (data: { name: string; address: string; observations: string }) => {
        try {
            const res = await warehousesApi.createWarehouse(data);
            showToast("Bodega creada correctamente", "success");
            setIsWarehouseModalOpen(false);
            if (res?.data?.id) {
                setWarehouseId(res.data.id);
            }
        } catch {
            showToast("Error al crear la bodega", "error");
        }
    };

    const handleCreateCostCenter = async (data: { name: string; code: string; description: string }) => {
        try {
            const { costCentersApi } = await import("@/lib/costCenters");
            const res = await costCentersApi.createCostCenter(data);
            showToast("Centro de costo creado exitosamente", "success");
            setIsCostCenterModalOpen(false);
            const newCC = res?.data?.costCenter || res?.data || res;
            if (newCC?.id) {
                setCostCenterId(String(newCC.id));
            }
        } catch {
            showToast("Error al crear el centro de costo", "error");
        }
    };

    // If nothing is visible, don't render empty container
    if (!showCurrency && !showWarehouse && !showCostCenter) {
        return null;
    }

    return (
        <TooltipProvider delayDuration={200}>
            <div className="bg-white rounded-lg border border-border p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    {/* Moneda */}
                    {showCurrency && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-sm font-medium text-foreground">
                                    Moneda
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Moneda principal para los cálculos del documento soporte.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <SearchableSelect
                                value={currency}
                                onValueChange={setCurrency}
                                options={[
                                    { value: "COP", label: "COP - Colombia P" },
                                    { value: "USD", label: "USD - Dólar" },
                                    { value: "EUR", label: "EUR - Euro" },
                                ]}
                                placeholder="COP"
                                className="w-full text-foreground"
                            />
                        </div>
                    )}

                    {/* Bodega */}
                    {showWarehouse && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-sm font-medium text-foreground">
                                    Bodega
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Bodega donde ingresarán los ítems comprados.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <SearchableSelect
                                value={warehouseId ? String(warehouseId) : (warehouseOptions[0]?.value || "")}
                                onValueChange={(val) => setWarehouseId(val ? Number(val) : null)}
                                options={warehouseOptions}
                                placeholder="Principal"
                                searchPlaceholder="Buscar bodega..."
                                className="w-full text-foreground"
                                footer={
                                    <button
                                        type="button"
                                        onClick={() => setIsWarehouseModalOpen(true)}
                                        className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                                    >
                                        + Nueva bodega
                                    </button>
                                }
                            />
                        </div>
                    )}

                    {/* Centro de costo */}
                    {showCostCenter && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1">
                                <label className="text-sm font-medium text-foreground">
                                    Centro de costo
                                </label>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                        Centro de costo para imputación contable.
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <SearchableSelect
                                value={costCenterId ? String(costCenterId) : "none"}
                                onValueChange={(val) => setCostCenterId(val === "none" ? null : val)}
                                options={costCenterOptions}
                                placeholder="Ninguno"
                                searchPlaceholder="Buscar centro de costo..."
                                className="w-full text-foreground"
                                footer={
                                    <button
                                        type="button"
                                        onClick={() => setIsCostCenterModalOpen(true)}
                                        className="w-full text-left px-2 py-1.5 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors"
                                    >
                                        + Nuevo centro de costo
                                    </button>
                                }
                            />
                        </div>
                    )}

                    {/* Número del comprobante físico */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-1">
                            <label className="text-sm font-medium text-foreground">
                                Número del comprobante físico
                            </label>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                    Número o referencia del comprobante físico emitido por el proveedor.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Input
                            type="text"
                            value={effectivePhysicalDocNum}
                            onChange={(e) => handleSetPhysicalDocNum(e.target.value)}
                            placeholder=""
                            className="bg-white border border-foreground/20 rounded-lg h-9 px-3 text-sm text-foreground hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
                        />
                    </div>
                </div>
            </div>

            {/* Modales auxiliares */}
            <NewWarehouseModal
                open={isWarehouseModalOpen}
                onOpenChange={setIsWarehouseModalOpen}
                onSave={handleCreateWarehouse}
                onCancel={() => setIsWarehouseModalOpen(false)}
            />

            <NewCostCenterModal
                open={isCostCenterModalOpen}
                onOpenChange={setIsCostCenterModalOpen}
                onSave={handleCreateCostCenter}
                onCancel={() => setIsCostCenterModalOpen(false)}
            />
        </TooltipProvider>
    );
}
