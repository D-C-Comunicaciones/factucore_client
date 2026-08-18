"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";
import { NewCostCenterModal } from "@/components/cost-centers/NewCostCenterModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

export function NewInternalPurchaseOrderOptions({
  warehouseOptions,
  costCenterOptions = [],
  selectedWarehouseId,
  setSelectedWarehouseId,
  showWarehouse,
  showCostCenter,
  selectedCostCenter,
  setSelectedCostCenter,
}: {
  warehouseOptions: { value: string; label: string }[];
  costCenterOptions?: { value: string; label: string; description?: string }[];
  selectedWarehouseId: number | null;
  setSelectedWarehouseId: (id: number | null) => void;
  showWarehouse: boolean;
  showCostCenter: boolean;
  selectedCostCenter?: string | null;
  setSelectedCostCenter?: (id: string | null) => void;
}) {
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isCostCenterModalOpen, setIsCostCenterModalOpen] = useState(false);
  const [optimisticCostCenters, setOptimisticCostCenters] = useState<{ value: string; label: string; description?: string }[]>([]);
  const combinedCostCenterOptions = [...costCenterOptions, ...optimisticCostCenters];

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
        setSelectedWarehouseId(Number(newWarehouse.id));
      }
      setIsWarehouseModalOpen(false);
      showToast("Bodega creada exitosamente", "success");
    } catch (error) {
      showToast("Error al crear la bodega", "error");
    }
  };

  const handleCreateCostCenter = async (data: { name: string; code: string; description: string }, createNew?: boolean) => {
    try {
      const { costCentersApi } = await import("@/lib/costCenters");
      const res = await costCentersApi.createCostCenter({
        name: data.name,
        code: data.code,
        description: data.description,
      });
      await queryClient.invalidateQueries({ queryKey: ["costCenters"] });

      const newCostCenter = res?.data?.costCenter || res?.data || res;
      if (newCostCenter?.id) {
        setOptimisticCostCenters((prev) => [
          ...prev,
          { value: String(newCostCenter.id), label: newCostCenter.name || String(newCostCenter.id), description: newCostCenter.description || "" },
        ]);
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

  if (!showWarehouse && !showCostCenter) return null;

  return (
    <div className="bg-white rounded-lg border border-border p-4 md:p-6">
      <div className="flex flex-nowrap items-end gap-3 w-full overflow-x-auto pb-1">
        {showWarehouse && (
          <div className="flex-1 min-w-[110px] max-w-[220px]">
            <label className="block text-sm font-medium text-foreground mb-2">Bodega</label>
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

        {showCostCenter && (
          <div className="flex-1 min-w-[110px] max-w-[220px]">
            <label className="block text-sm font-medium text-foreground mb-2">Centro de costo</label>
            <SearchableSelect
              value={selectedCostCenter || ""}
              onValueChange={setSelectedCostCenter as any}
              options={combinedCostCenterOptions}
              placeholder="Ninguno"
              searchPlaceholder="Buscar centro de costos..."
              footer={
                <button
                  className="w-full text-left px-3 py-2 text-sm text-primary font-medium hover:bg-primary/5 transition-colors flex items-center gap-1"
                  onClick={() => setIsCostCenterModalOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  Nuevo centro de costos
                </button>
              }
            />
          </div>
        )}
      </div>

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
    </div>
  );
}
