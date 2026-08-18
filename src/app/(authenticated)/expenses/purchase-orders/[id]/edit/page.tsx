"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { NewInternalPurchaseOrderHeader } from "@/components/purchase-order/internal/NewInternalPurchaseOrderHeader";
import { NewInternalPurchaseOrderOptions } from "@/components/purchase-order/internal/NewInternalPurchaseOrderOptions";
import { NewInternalPurchaseOrderMain } from "@/components/purchase-order/internal/NewInternalPurchaseOrderMain";
import { NewInternalPurchaseOrderFooter } from "@/components/purchase-order/internal/NewInternalPurchaseOrderFooter";
import { usePurchaseOrderBuilder } from "@/hooks/purchaseOrders/usePurchaseOrderBuilder";
import { usePurchaseOrder, useUpdatePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useResolutions } from "@/hooks/useResolutions";
import { showToast } from "@/components/sonner/CustomToaster";

function toDateInput(dateStr?: string | null): Date {
  if (!dateStr) return new Date();
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default function EditInternalPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const catalogData = useCatalogs();
  const builder = usePurchaseOrderBuilder();
  const updatePurchaseOrder = useUpdatePurchaseOrder();
  const { data: purchaseOrder, isLoading, isError } = usePurchaseOrder(id);

  const purchaseOrderTypeResolution = (catalogData.typeResolutions || []).find((t: any) => /orden.*compra|purchase.*order/i.test(t.name || ""));
  const { resolutions } = useResolutions({ type_resolution: purchaseOrderTypeResolution?.id, is_active: true });
  const activeResolution = resolutions.find((r: any) => r.id === purchaseOrder?.resolution_id) || null;

  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showCostCenter, setShowCostCenter] = useState(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);
  const [formState, setFormState] = useState<any>({ contact_id: null, notes: "", terms_and_conditions: "" });
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loadingSave, setLoadingSave] = useState(false);

  const warehouseOptions = catalogData.warehouses?.map((w: any) => ({ value: w.id.toString(), label: w.name })) || [];
  const costCenterOptions: { value: string; label: string; description?: string }[] = [];

  const prefillApplied = useRef(false);
  useEffect(() => {
    if (purchaseOrder && !prefillApplied.current) {
      prefillApplied.current = true;
      setFormState({
        contact_id: purchaseOrder.contact_id ? String(purchaseOrder.contact_id) : null,
        notes: purchaseOrder.notes || "",
        terms_and_conditions: purchaseOrder.terms_and_conditions || "",
        issue_date: purchaseOrder.issue_date,
        delivery_date: purchaseOrder.delivery_date,
      });
      if (purchaseOrder.warehouse_id) setSelectedWarehouseId(Number(purchaseOrder.warehouse_id));
      if (purchaseOrder.cost_center_id) setSelectedCostCenter(String(purchaseOrder.cost_center_id));

      builder.setItems(
        (purchaseOrder.lines || purchaseOrder.items || []).map((line: any) => {
          const discount = (line.allowance_charges || line.discounts || [])[0];
          const tax = (line.taxes || [])[0];
          return {
            id: crypto.randomUUID(),
            item_id: line.item_id ?? null,
            item: line.name || "",
            description: line.description || "",
            referencia: line.reference || "",
            cantidad: line.quantity ?? "",
            precio: line.unit_price ?? 0,
            discountValue: discount?.value ?? 0,
            discountType: discount?.value_type === "fixed" ? "fixed" : "percentage",
            taxObj: tax || null,
          };
        })
      );

      const globalAdjustments = (purchaseOrder.allowance_charges || [])
        .filter((ac: any) => ac.scope === "global")
        .map((ac: any) => ({
          id: crypto.randomUUID(),
          type: (ac.charge_indicator ? "charge" : "discount") as "charge" | "discount",
          valueType: (ac.value_type === "fixed" ? "fixed" : "percentage") as "fixed" | "percentage",
          value: Number(ac.value) || 0,
          reason: ac.reason || "",
        }));
      if (globalAdjustments.length > 0) {
        builder.setGlobalAdjustments(globalAdjustments);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseOrder]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formState.contact_id) {
      newErrors.contact_id = "El proveedor es requerido";
      setErrors(newErrors);
      showToast("El proveedor es requerido", "error");
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
    if (!validate() || !purchaseOrder) return;

    setLoadingSave(true);
    try {
      const payload: any = builder.buildPayload({
        type: "internal",
        contact_id: formState.contact_id,
        resolution_id: purchaseOrder.resolution_id,
        issue_date: formState.issue_date,
        delivery_date: formState.delivery_date,
        warehouse_id: selectedWarehouseId,
        cost_center_id: selectedCostCenter,
        notes: formState.notes,
        terms_and_conditions: formState.terms_and_conditions,
        // Sin esto, cada edición reenvía status:"open" por defecto y pisa el
        // estado real de la orden (ej. "closed") — se preserva el existente.
        status: purchaseOrder.status,
      });

      // El backend no permite cambiar type/resolution_id/prefix/number al editar
      delete payload.type;
      delete payload.resolution_id;

      await updatePurchaseOrder.mutateAsync({ id, data: payload });
      showToast("Orden de compra actualizada correctamente", "success");
      router.push(`/expenses/purchase-orders/${id}`);
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || error.message || "Error al actualizar la orden de compra", "error");
      }
      console.error(error);
    } finally {
      setLoadingSave(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !purchaseOrder) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-700">No se encontró la orden de compra</p>
        <button onClick={() => router.push("/expenses/purchase-orders")} className="text-primary text-sm font-medium hover:underline">
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <NewInternalPurchaseOrderHeader
            title="Editar orden de compra"
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
            selectedResolutionId={purchaseOrder.resolution_id || null}
            setSelectedResolutionId={() => {}}
            formState={formState}
            setFormState={setFormState}
            errors={errors}
            editMode
            initialIssueDate={toDateInput(purchaseOrder.issue_date)}
            initialDeliveryDate={toDateInput(purchaseOrder.delivery_date)}
            existingNumberLabel={`${purchaseOrder.prefix || ""}${purchaseOrder.number || purchaseOrder.id}`}
          />

          <NewInternalPurchaseOrderFooter
            onCancel={() => router.push(`/expenses/purchase-orders/${id}`)}
            onSave={handleSave}
            loading={loadingSave}
            saveLabel="Guardar cambios"
          />
        </div>
      </div>
    </div>
  );
}
