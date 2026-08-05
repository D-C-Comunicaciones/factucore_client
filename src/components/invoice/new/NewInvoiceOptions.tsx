"use client";
import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { NewPriceListModal } from "@/components/price-list/NewPriceListModal";
import { NewSellerModal } from "@/components/seller/NewSellerModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

export function NewInvoiceOptions({
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    costCenterOptions = [],
    selectedWarehouseId,
    setSelectedWarehouseId,
    selectedPriceListId,
    setSelectedPriceListId,
    showWarehouse,
    showPriceList,
    tipoDoc,
    setTipoDoc,
    showRemissionBar,
    setShowRemissionBar,
    selectedSeller,
    setSelectedSeller,
    selectedCostCenter,
    setSelectedCostCenter,
}: {
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
    sellerOptions: { value: string; label: string }[];
    costCenterOptions?: { value: string; label: string; description?: string }[];
    selectedWarehouseId: number | null;
    setSelectedWarehouseId: (id: number | null) => void;
    selectedPriceListId: number | null;
    setSelectedPriceListId: (id: number | null) => void;
    showWarehouse: boolean;
    showPriceList: boolean;
    tipoDoc: 'factura' | 'tiquete';
    setTipoDoc: (tipo: 'factura' | 'tiquete') => void;
    showRemissionBar: boolean;
    setShowRemissionBar: (show: boolean) => void;
    selectedSeller?: string | null;
    setSelectedSeller?: (id: string | null) => void;
    selectedCostCenter?: string | null;
    setSelectedCostCenter?: (id: string | null) => void;
}) {
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

    const handleCreateWarehouse = async (data: { name: string; address: string; observations: string }) => {
        try {
            const res = await warehousesApi.createWarehouse({
                name: data.name,
                address: data.address,
                observations: data.observations,
                status: 1
            });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });

            const newWarehouse = res?.data?.warehouse || res?.data || res;
            if (newWarehouse?.id) {
                setSelectedWarehouseId(Number(newWarehouse.id));
            }
            setIsWarehouseModalOpen(false);
            showToast("Bodega creada exitosamente", "success");
        } catch (error) {
            showToast("Error al crear la bodega", "error");
        }
    };

    return (
        <div className="bg-white rounded-lg border border-border p-4 md:p-6">
            <div className="flex flex-nowrap items-end gap-3 w-full overflow-x-auto pb-1">

                {/* TIPO DOCUMENTO */}
                <div className="flex-1 min-w-[170px] max-w-[230px]">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de documento
                    </label>
                    <div className="flex gap-1 bg-gray-50 p-1 border border-gray-200 rounded-lg h-[34px] items-center w-full">
                        <button
                            onClick={() => setTipoDoc('factura')}
                            className={`flex-[3] min-w-0 h-[26px] rounded-md text-xs font-semibold cursor-pointer transition-all whitespace-nowrap px-2 flex items-center justify-center ${tipoDoc === 'factura'
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Factura de venta
                        </button>
                        <button
                            onClick={() => setTipoDoc('tiquete')}
                            className={`flex-1 min-w-0 h-[26px] rounded-md text-xs font-semibold cursor-pointer transition-all whitespace-nowrap px-2 flex items-center justify-center ${tipoDoc === 'tiquete'
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            POS
                        </button>
                    </div>
                </div>

                {/* BODEGA */}
                {showWarehouse && (
                    <div className="flex-1 min-w-[110px] max-w-[180px]">
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
                                        Selecciona la bodega desde donde se despacharán los productos de esta factura.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={selectedWarehouseId?.toString() ?? ""}
                            onValueChange={(val) => setSelectedWarehouseId(val ? Number(val) : null)}
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
                )}

                {/* LISTA DE PRECIOS */}
                {showPriceList && (
                    <div className="flex-1 min-w-[110px] max-w-[180px]">
                        <div className="flex items-center gap-1 mb-2">
                            <label className="text-sm font-medium text-foreground">
                                Lista de precios
                            </label>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                        Define qué lista de precios se aplicará a los productos de esta factura.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={selectedPriceListId?.toString() ?? ""}
                            onValueChange={(val) => setSelectedPriceListId(val ? Number(val) : null)}
                            options={priceListOptions}
                            placeholder="Selecciona lista"
                            searchPlaceholder="Buscar lista..."
                            footer={
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1"
                                    onClick={() => setIsPriceListModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Nueva lista de precios
                                </button>
                            }
                        />
                    </div>
                )}

                {/* VENDEDOR */}
                <div className="flex-1 min-w-[110px] max-w-[180px]">
                    <div className="flex items-center gap-1 mb-2">
                        <label className="text-sm font-medium text-foreground">
                            Vendedor
                        </label>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Vendedor asignado a esta factura. Se usará para reportes y comisiones.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SearchableSelect
                        value={selectedSeller || ""}
                        onValueChange={setSelectedSeller as any}
                        options={sellerOptions}
                        placeholder="Seleccionar vendedor"
                        searchPlaceholder="Buscar vendedor..."
                        footer={
                            <button
                                className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1"
                                onClick={() => setIsSellerModalOpen(true)}
                            >
                                <Plus className="w-4 h-4" />
                                Nuevo vendedor
                            </button>
                        }
                    />
                </div>

                {/* CENTRO DE COSTOS */}
                <div className="flex-1 min-w-[110px] max-w-[180px]">
                    <div className="flex items-center gap-1 mb-2">
                        <label className="text-sm font-medium text-foreground">
                            Centro de costos
                        </label>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Centro de costos asociado a esta factura.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <SearchableSelect
                        value={selectedCostCenter || ""}
                        onValueChange={setSelectedCostCenter as any}
                        options={costCenterOptions}
                        placeholder="Seleccionar centro de costos"
                        searchPlaceholder="Buscar centro de costos..."
                    />
                </div>

                <div className="shrink-0 flex items-end h-[38px] gap-2">
                    <button
                        onClick={() => { }}
                        className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors cursor-pointer whitespace-nowrap h-full"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        Orden de compra
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary ml-0.5 shrink-0 cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Asocia una orden de compra a esta factura.
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </button>
                </div>
            </div>

            <NewWarehouseModal
                open={isWarehouseModalOpen}
                onOpenChange={setIsWarehouseModalOpen}
                onSave={handleCreateWarehouse}
                onCancel={() => setIsWarehouseModalOpen(false)}
            />

            <NewPriceListModal
                open={isPriceListModalOpen}
                onOpenChange={setIsPriceListModalOpen}
                onSave={(data: any) => {
                    if (data?.id) setSelectedPriceListId(Number(data.id));
                }}
            />

            <NewSellerModal
                open={isSellerModalOpen}
                onOpenChange={setIsSellerModalOpen}
                onSave={(data: any) => {
                    if (data?.id) setSelectedSeller?.(String(data.id));
                }}
            />
        </div>
    );
}