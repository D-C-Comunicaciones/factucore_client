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
}: {
    warehouseOptions: { value: string; label: string }[];
    priceListOptions: { value: string; label: string }[];
    sellerOptions: { value: string; label: string }[];
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
}) {
    const [selectedSeller, setSelectedSeller] = useState<string>("");

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
            <div className="flex flex-wrap items-end gap-4">

                {/* TIPO DOCUMENTO */}
                <div className="shrink-0">
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Tipo de documento
                    </label>
                    <div className="flex gap-1 bg-gray-50 p-1 border border-gray-200 rounded-lg h-[38px] items-center min-w-[210px]">
                        <button
                            onClick={() => setTipoDoc('factura')}
                            className={`flex-1 h-[30px] rounded-md text-xs font-semibold transition-all whitespace-nowrap px-3 ${
                                tipoDoc === 'factura'
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Factura de venta
                        </button>
                        <button
                            onClick={() => setTipoDoc('tiquete')}
                            className={`flex-1 h-[30px] rounded-md text-xs font-semibold transition-all whitespace-nowrap px-3 ${
                                tipoDoc === 'tiquete'
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-transparent text-gray-500 hover:text-gray-900"
                            }`}
                        >
                            Tiquete
                        </button>
                    </div>
                </div>

                {/* BODEGA */}
                {showWarehouse && (
                    <div className="shrink-0 min-w-[160px]">
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
                    <div className="shrink-0 min-w-[160px]">
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
                <div className="shrink-0 min-w-[170px]">
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
                        value={selectedSeller}
                        onValueChange={setSelectedSeller}
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

                {/* AGREGAR REMISIÓN */}
                <div className="shrink-0 flex items-end h-[38px]">
                    <button 
                        onClick={() => setShowRemissionBar(!showRemissionBar)}
                        className="text-primary text-sm font-medium flex items-center gap-1 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors whitespace-nowrap h-full"
                    >
                        <Plus className="w-4 h-4 shrink-0" />
                        Agregar remisión
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <HelpCircle className="w-3.5 h-3.5 text-primary ml-0.5 shrink-0 cursor-help hover:text-primary/70 transition-colors" />
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[200px]">
                                    Asocia una remisión existente a esta factura.
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
                    if (data?.id) setSelectedSeller(String(data.id));
                }}
            />
        </div>
    );
}