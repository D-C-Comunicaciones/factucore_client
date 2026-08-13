"use client";
import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { NewCurrencyModal } from "@/components/currency/new/NewCurrencyModal";
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
import { NewCostCenterModal } from "@/components/cost-centers/NewCostCenterModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

export function NewRemissionOptions({
    typeRemissionId,
    setTypeRemissionId,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    selectedWarehouseId,
    setSelectedWarehouseId,
    selectedPriceListId,
    setSelectedPriceListId,
    showWarehouse = false,
    showPriceList = false,
    showSeller = false,
    showCostCenter = false,
    showCurrency = false,
    selectedSeller,
    setSelectedSeller,
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    costCenters,
    selectedCostCenter,
    setSelectedCostCenter,
}: {
    typeRemissionId: number;
    setTypeRemissionId: (id: number) => void;
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
    sellerOptions: { value: string; label: string }[];
    selectedWarehouseId: number | null;
    setSelectedWarehouseId: (id: number | null) => void;
    selectedPriceListId: number | null;
    setSelectedPriceListId: (id: number | null) => void;
    showWarehouse?: boolean;
    showPriceList?: boolean;
    showSeller?: boolean;
    showCostCenter?: boolean;
    showCurrency?: boolean;
    selectedSeller?: string | null;
    setSelectedSeller?: (id: string | null) => void;
    currencies?: { value: string; label: string }[];
    selectedCurrency?: string;
    setSelectedCurrency?: (id: string) => void;
    costCenters?: { value: string; label: string }[];
    selectedCostCenter?: string | null;
    setSelectedCostCenter?: (id: string | null) => void;
}) {
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
    const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
    const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
    const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);

    // Optimistic state to immediately show newly created options before the API refetch completes
    const [optimisticWarehouses, setOptimisticWarehouses] = useState<{value: string, label: string}[]>([]);
    const [optimisticPriceLists, setOptimisticPriceLists] = useState<{value: string, label: string}[]>([]);
    const [optimisticSellers, setOptimisticSellers] = useState<{value: string, label: string}[]>([]);
    const [optimisticCurrencies, setOptimisticCurrencies] = useState<{value: string, label: string}[]>([]);
    const [optimisticCostCenters, setOptimisticCostCenters] = useState<{value: string, label: string, description?: string}[]>([]);

    const combinedWarehouses = [...warehouseOptions, ...optimisticWarehouses];
    const combinedPriceLists = [...priceListOptions, ...optimisticPriceLists];
    const combinedSellers = [...sellerOptions, ...optimisticSellers];
    const combinedCurrencies = [...(currencies || []), ...optimisticCurrencies];
    const combinedCostCenters = [...(costCenters || []), ...optimisticCostCenters];

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
                setOptimisticWarehouses(prev => [...prev, { value: String(newWarehouse.id), label: newWarehouse.name || String(newWarehouse.id) }]);
                setSelectedWarehouseId(Number(newWarehouse.id));
            }
            setIsWarehouseModalOpen(false);
            showToast("Bodega creada exitosamente", "success");
        } catch (error) {
            showToast("Error al crear la bodega", "error");
        }
    };

    const handleCreateCurrency = async (data: { name: string; code: string; exchange_rate: string }) => {
        try {
            // Import here to avoid changing file top level imports if possible, or assume it's imported
            const { currenciesApi } = await import("@/lib/currencies");
            const res = await currenciesApi.createCurrency({
                name: data.name,
                code: data.code,
                exchange_rate: data.exchange_rate,
            });
            await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.currencies() });

            setOptimisticCurrencies(prev => [...prev, { value: data.code, label: `${data.code} - ${data.name}` }]);
            if (setSelectedCurrency) {
                setSelectedCurrency(data.code);
            }
            setIsCurrencyModalOpen(false);
            showToast("Moneda creada exitosamente", "success");
        } catch (error) {
            showToast("Error al crear la moneda", "error");
        }
    };

    const handleCreateCostCenter = async (data: any, createNew?: boolean) => {
        try {
            const { costCentersApi } = await import("@/lib/costCenters");
            const res = await costCentersApi.createCostCenter({
                name: data.name,
                code: data.code,
                description: data.description,
            });
            await queryClient.invalidateQueries({ queryKey: ['costCenters'] });

            const newCostCenter = res?.data?.costCenter || res?.data || res;
            if (newCostCenter?.id) {
                setOptimisticCostCenters(prev => [...prev, { value: String(newCostCenter.id), label: newCostCenter.name || String(newCostCenter.id), description: newCostCenter.description || "" }]);
                setSelectedCostCenter?.(String(newCostCenter.id));
            }
            if (!createNew) {
                setIsCostCenterModalOpen(false);
            }
            showToast("Centro de costo creado exitosamente", "success");
        } catch (error) {
            showToast("Error al crear el centro de costo", "error");
            throw error;
        }
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold text-foreground mb-4">Ajustes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3">

                {/* TIPO DE DOCUMENTO */}
                <div className="w-full">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de documento <span className="text-primary">*</span>
                    </label>
                    <div className="flex gap-1 bg-gray-50 p-1 border border-gray-200 rounded-lg h-9 items-center w-full">
                        <button
                            type="button"
                            onClick={() => setTypeRemissionId(1)}
                            className={`flex-1 min-w-0 h-7 rounded-md text-xs font-semibold cursor-pointer transition-all whitespace-nowrap px-2 flex items-center justify-center ${typeRemissionId === 1
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Remisión
                        </button>
                        <button
                            type="button"
                            onClick={() => setTypeRemissionId(2)}
                            className={`flex-1 min-w-0 h-7 rounded-md text-xs font-semibold cursor-pointer transition-all whitespace-nowrap px-2 flex items-center justify-center ${typeRemissionId === 2
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                                }`}
                        >
                            Orden de servicio
                        </button>
                    </div>
                </div>

                {/* MONEDA */}
                {showCurrency && (
                    <div className="w-full">
                        <div className="flex items-center gap-1 mb-2">
                            <label className="text-sm font-medium text-foreground">
                                Moneda
                            </label>
                        </div>
                        <SearchableSelect
                            value={selectedCurrency || ""}
                            onValueChange={(val) => setSelectedCurrency && setSelectedCurrency(val)}
                            options={combinedCurrencies}
                            placeholder="Seleccionar"
                        />
                    </div>
                )}

                {/* VENDEDOR */}
                {showSeller && (
                    <div className="w-full">
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
                                        Vendedor asignado a esta remisión. Se usará para reportes y comisiones.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={selectedSeller ?? ""}
                            onValueChange={(val) => setSelectedSeller?.(val)}
                            options={combinedSellers}
                            placeholder="Seleccionar vendedor"
                            searchPlaceholder="Buscar vendedor..."
                            footer={
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 cursor-pointer"
                                    onClick={() => setIsSellerModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Nuevo vendedor
                                </button>
                            }
                        />
                    </div>
                )}

            </div>

            {(showWarehouse || showCostCenter || showPriceList) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-3 mt-3">

                {/* BODEGA */}
                {showWarehouse && (
                    <div className="w-full">
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
                                        Selecciona la bodega desde donde se despacharán los productos de esta remisión.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={selectedWarehouseId?.toString() ?? ""}
                            onValueChange={(val) => setSelectedWarehouseId(val ? Number(val) : null)}
                            options={combinedWarehouses}
                            placeholder="Selecciona bodega"
                            searchPlaceholder="Buscar bodega..."
                            footer={
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 cursor-pointer"
                                    onClick={() => setIsWarehouseModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Nueva bodega
                                </button>
                            }
                        />
                    </div>
                )}

                {/* CENTRO DE COSTO */}
                {showCostCenter && (
                    <div className="w-full">
                        <div className="flex items-center gap-1 mb-2">
                            <label className="text-sm font-medium text-foreground">
                                Centro de costo
                            </label>
                        </div>
                        <SearchableSelect
                            value={selectedCostCenter || ""}
                            onValueChange={(val) => setSelectedCostCenter && setSelectedCostCenter(val)}
                            options={combinedCostCenters}
                            placeholder="Seleccionar"
                            footer={
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 cursor-pointer"
                                    onClick={() => setIsCostCenterModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Nuevo centro de costo
                                </button>
                            }
                        />
                    </div>
                )}

                {/* LISTA DE PRECIOS */}
                {showPriceList && (
                    <div className="w-full">
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
                                        Define qué lista de precios se aplicará a los productos de esta remisión.
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <SearchableSelect
                            value={selectedPriceListId?.toString() ?? ""}
                            onValueChange={(val) => setSelectedPriceListId(val ? Number(val) : null)}
                            options={combinedPriceLists}
                            placeholder="Selecciona lista"
                            searchPlaceholder="Buscar lista..."
                            footer={
                                <button
                                    className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1 cursor-pointer"
                                    onClick={() => setIsPriceListModalOpen(true)}
                                >
                                    <Plus className="w-4 h-4" />
                                    Nueva lista de precios
                                </button>
                            }
                        />
                    </div>
                )}
            </div>
            )}

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
                    if (data?.id) {
                        setOptimisticPriceLists(prev => [...prev, { value: String(data.id), label: data.name || String(data.id) }]);
                        setSelectedPriceListId(Number(data.id));
                    }
                }}
            />

            <NewSellerModal
                open={isSellerModalOpen}
                onOpenChange={setIsSellerModalOpen}
                onSave={(data: any) => {
                    if (data?.id) {
                        setOptimisticSellers(prev => [...prev, { value: String(data.id), label: data.name || data.first_name || data.business_name || String(data.id) }]);
                        setSelectedSeller?.(String(data.id));
                    }
                }}
            />

            {/* Note: Requires NewCurrencyModal import at top, which we will add next */}
            {isCurrencyModalOpen && (
                <NewCurrencyModal
                    open={isCurrencyModalOpen}
                    onOpenChange={setIsCurrencyModalOpen}
                    onSave={handleCreateCurrency}
                    onCancel={() => setIsCurrencyModalOpen(false)}
                />
            )}

            <NewCostCenterModal
                open={isCostCenterModalOpen}
                onOpenChange={setIsCostCenterModalOpen}
                onSave={handleCreateCostCenter}
                onCancel={() => setIsCostCenterModalOpen(false)}
            />
        </div>
    );
}
