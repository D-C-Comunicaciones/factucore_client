"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewInternalPurchaseOrderHeader } from "@/components/purchase-order/internal/NewInternalPurchaseOrderHeader";
import { NewInternalPurchaseOrderOptions } from "@/components/purchase-order/internal/NewInternalPurchaseOrderOptions";
import { NewInternalPurchaseOrderMain } from "@/components/purchase-order/internal/NewInternalPurchaseOrderMain";
import { NewInternalPurchaseOrderFooter } from "@/components/purchase-order/internal/NewInternalPurchaseOrderFooter";
import { usePurchaseOrderBuilder } from "@/hooks/purchaseOrders/usePurchaseOrderBuilder";
import { useCreatePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";
import { showToast } from "@/components/sonner/CustomToaster";

export default function NewInternalPurchaseOrderPage() {
  const router = useRouter();
  const catalogData = useCatalogs();
  const builder = usePurchaseOrderBuilder();
  const createPurchaseOrder = useCreatePurchaseOrder();

  const purchaseOrderTypeResolution = (catalogData.typeResolutions || []).find((t: any) => /orden.*compra|purchase.*order/i.test(t.name || ""));
  const resolutionTypeFilter = purchaseOrderTypeResolution?.id;
  const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loadingSave, setLoadingSave] = useState(false);

  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showCostCenter, setShowCostCenter] = useState(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);

  const [formState, setFormState] = useState<any>({
    contact_id: null,
    notes: "",
    terms_and_conditions: "",
  });

  useEffect(() => {
    if (resolutions.length > 0) {
      const isValid = resolutions.some((r: Resolution) => r.id === selectedResolutionId);
      if (!isValid) {
        const mainRes = resolutions.find((r: Resolution) => r.is_main) || resolutions[0];
        setSelectedResolutionId(mainRes.id);
      }
    } else {
      setSelectedResolutionId(null);
    }
  }, [resolutions]);

  const activeResolution = resolutions.find((r: Resolution) => r.id === selectedResolutionId) || resolutions[0] || null;

  useEffect(() => {
    if (catalogData.warehouses?.length > 0 && !selectedWarehouseId) {
      const defaultWh = catalogData.warehouses.find((w: any) => w.is_default) || catalogData.warehouses[0];
      setSelectedWarehouseId(defaultWh.id);
    }
  }, [catalogData.warehouses]);

  const warehouseOptions = catalogData.warehouses?.map((w: any) => ({ value: w.id.toString(), label: w.name })) || [];

  const { data: costCentersResp } = useQuery({
    queryKey: ["costCenters", { is_active: true }],
    queryFn: async () => costCentersApi.getCostCenters({ is_active: true }),
  });
  const costCentersData = Array.isArray(costCentersResp?.data?.["cost-centers"])
    ? costCentersResp?.data["cost-centers"]
    : Array.isArray(costCentersResp?.data)
      ? costCentersResp.data
      : [];
  const costCenterOptions = costCentersData.map((cc: any) => ({ value: cc.id.toString(), label: cc.name, description: cc.description || "" }));

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.contact_id) {
      newErrors.contact_id = "El proveedor es requerido";
      setErrors(newErrors);
      showToast("El proveedor es requerido", "error");
      return false;
    }

    if (!selectedResolutionId) {
      newErrors.resolution_id = "La resolución es requerida";
      setErrors(newErrors);
      showToast("La numeración / resolución es requerida", "error");
      return false;
    }

    if (!builder.items || builder.items.length === 0) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la orden de compra", "error");
      return false;
    }

    const hasEmptyItems = builder.items.some((item: any) => !item.item_id);
    if (hasEmptyItems) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Por favor selecciona un concepto en todas las líneas", "error");
      return false;
    }

    const hasInvalidQuantity = builder.items.some((item: any) => item.item_id && (!item.cantidad || item.cantidad <= 0));
    if (hasInvalidQuantity) {
      newErrors.items = "invalid_quantity";
      setErrors(newErrors);
      showToast("Por favor ingrese una cantidad mayor a 0 en los conceptos seleccionados.", "error");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    setLoadingSave(true);
    try {
      const payload = builder.buildPayload({
        type: "internal",
        contact_id: formState.contact_id,
        resolution_id: selectedResolutionId,
        issue_date: formState.issue_date,
        delivery_date: formState.delivery_date,
        warehouse_id: selectedWarehouseId,
        cost_center_id: selectedCostCenter,
        notes: formState.notes,
        terms_and_conditions: formState.terms_and_conditions,
      });

      const created: any = await createPurchaseOrder.mutateAsync(payload);
      showToast("Orden de compra creada correctamente", "success");
      const id = created?.purchase_order?.id || created?.id;
      router.push(id ? `/expenses/purchase-orders/${id}` : "/expenses/purchase-orders");
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || error.message || "Error al crear la orden de compra", "error");
      }
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <NewInternalPurchaseOrderHeader
            showWarehouse={showWarehouse}
            setShowWarehouse={setShowWarehouse}
            showCostCenter={showCostCenter}
            setShowCostCenter={setShowCostCenter}
          />

          <NewInternalPurchaseOrderOptions
            warehouseOptions={warehouseOptions}
            costCenterOptions={costCenterOptions}
            selectedWarehouseId={selectedWarehouseId}
            setSelectedWarehouseId={setSelectedWarehouseId}
            showWarehouse={showWarehouse}
            showCostCenter={showCostCenter}
            selectedCostCenter={selectedCostCenter}
            setSelectedCostCenter={setSelectedCostCenter}
          />

          <NewInternalPurchaseOrderMain
            catalogData={catalogData}
            builder={builder}
            activeResolution={activeResolution}
            resolutions={resolutions || []}
            selectedResolutionId={selectedResolutionId}
            setSelectedResolutionId={setSelectedResolutionId}
            onRefetchResolutions={refetchResolutions}
            formState={formState}
            setFormState={setFormState}
            errors={errors}
          />

          <NewInternalPurchaseOrderFooter
            onCancel={() => router.push("/expenses/purchase-orders")}
            onSave={handleSave}
            loading={loadingSave}
            saveLabel="Crear orden de compra"
          />
        </div>
      </div>
    </div>
  );
}
