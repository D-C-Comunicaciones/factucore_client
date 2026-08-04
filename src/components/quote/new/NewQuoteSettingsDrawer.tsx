import { useState, useEffect } from "react";
import { X, HelpCircle, Pin, Plus } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { NewPriceListModal } from "@/components/price-list/NewPriceListModal";
import { NewSellerModal } from "@/components/seller/NewSellerModal";
import { NewCostCenterModal } from "@/components/cost-centers/NewCostCenterModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

export type FixedFields = {
  warehouse: boolean;
  seller: boolean;
  costCenter: boolean;
  currency: boolean;
  priceList: boolean;
};

export function NewQuoteSettingsDrawer({
  isOpen,
  onClose,
  fixedFields,
  setFixedFields,
  warehouseOptions,
  selectedWarehouseId,
  setSelectedWarehouseId,
  sellerOptions,
  selectedSeller,
  setSelectedSeller,
  priceListOptions,
  selectedPriceListId,
  setSelectedPriceListId,
  currencies,
  selectedCurrency,
  setSelectedCurrency,
  costCenters,
  selectedCostCenter,
  setSelectedCostCenter,
}: {
  isOpen: boolean;
  onClose: () => void;
  fixedFields: FixedFields;
  setFixedFields: (fields: FixedFields) => void;
  warehouseOptions: { value: string; label: string }[];
  selectedWarehouseId: number | null;
  setSelectedWarehouseId: (id: number | null) => void;
  sellerOptions: { value: string; label: string }[];
  selectedSeller?: string | null;
  setSelectedSeller?: (id: string | null) => void;
  priceListOptions: { value: string; label: string }[];
  selectedPriceListId: number | null;
  setSelectedPriceListId: (id: number | null) => void;
  currencies: { value: string; label: string }[];
  selectedCurrency: string;
  setSelectedCurrency: (id: string) => void;
  costCenters: { value: string; label: string }[];
  selectedCostCenter: string | null;
  setSelectedCostCenter: (id: string | null) => void;
}) {
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isPriceListModalOpen, setIsPriceListModalOpen] = useState(false);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);

  const [localFixedFields, setLocalFixedFields] = useState<FixedFields>(fixedFields);

  // Sync local state when the drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalFixedFields(fixedFields);
    }
  }, [isOpen, fixedFields]);

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

  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [optimisticCostCenters, setOptimisticCostCenters] = useState<{value: string, label: string, description?: string}[]>([]);
  const combinedCostCenters = [...(costCenters || []), ...optimisticCostCenters];

  const handleCreateCostCenter = async (data: any, createNew?: boolean) => {
    try {
      const { costCentersApi } = await import("@/lib/costCenters");
      const res = await costCentersApi.createCostCenter({
        name: data.name,
        code: data.code,
        description: data.description,
        status: 1
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

  const handleSave = () => {
    setFixedFields(localFixedFields);
    onClose();
  };

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/20 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Más ajustes</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Parámetros adicionales</h3>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-sm font-medium text-primary flex items-center gap-1 hover:text-primary/80 transition-colors cursor-pointer">
                  <Pin className="w-3.5 h-3.5" /> Fijar campos al formulario
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-3" align="end">
                <div className="space-y-3">
                  {Object.entries({
                    warehouse: "Bodega",
                    seller: "Vendedor",
                    costCenter: "Centro de costo",
                    currency: "Monedas",
                    priceList: "Lista de precios"
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`fix-${key}`}
                        checked={localFixedFields[key as keyof FixedFields]}
                        onCheckedChange={(checked) => {
                          setLocalFixedFields({
                            ...localFixedFields,
                            [key]: !!checked
                          });
                        }}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary border-primary cursor-pointer"
                      />
                      <label htmlFor={`fix-${key}`} className="text-sm font-medium leading-none cursor-pointer">
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bodega</label>
              <SearchableSelect
                value={selectedWarehouseId?.toString() ?? ""}
                onValueChange={(val) => setSelectedWarehouseId(val ? Number(val) : null)}
                options={warehouseOptions}
                placeholder="Principal"
                className="w-full text-foreground"
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

            {setSelectedSeller && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Vendedor</label>
                <SearchableSelect
                  value={selectedSeller ?? ""}
                  onValueChange={(val) => setSelectedSeller(val)}
                  options={sellerOptions}
                  placeholder="Seleccionar"
                  className="w-full text-foreground"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Centro de costo</label>
              <SearchableSelect
                value={selectedCostCenter ?? ""}
                onValueChange={(val) => setSelectedCostCenter(val)}
                options={combinedCostCenters}
                placeholder="Seleccionar"
                className="w-full text-foreground"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Moneda</label>
              <SearchableSelect
                value={selectedCurrency}
                onValueChange={(val) => setSelectedCurrency(val)}
                options={currencies}
                placeholder="Seleccionar"
                className="w-full text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Lista de precios</label>
              <SearchableSelect
                value={selectedPriceListId?.toString() ?? ""}
                onValueChange={(val) => setSelectedPriceListId(val ? Number(val) : null)}
                options={priceListOptions}
                placeholder="General"
                className="w-full text-foreground"
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
            Guardar
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
          if (data?.id && setSelectedSeller) setSelectedSeller(String(data.id));
        }}
      />
      <NewCostCenterModal
        open={isCostCenterModalOpen}
        onOpenChange={setIsCostCenterModalOpen}
        onSave={handleCreateCostCenter}
        onCancel={() => setIsCostCenterModalOpen(false)}
      />
    </>
  );
}
