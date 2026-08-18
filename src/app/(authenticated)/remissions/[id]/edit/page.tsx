"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewRemissionFooter } from "@/components/remission/new/NewRemissionFooter";
import { NewRemissionHeader } from "@/components/remission/new/NewRemissionHeader";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { NewRemissionMain } from "@/components/remission/new/NewRemissionMain";
import { NewRemissionSettingsDrawer } from "@/components/remission/new/NewRemissionSettingsDrawer";
import { PreviewModal } from "@/components/invoice/new/PreviewModal";
import { RemissionDetailSkeleton } from "@/components/remission/details/RemissionDetailSkeleton";
import { useRemission, useUpdateRemission } from "@/hooks/remissions/useRemissions";
import { useRemissionBuilder } from "@/hooks/remissions/useRemissionBuilder";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { RemissionsService } from "@/lib/remissions";
import { mapRemissionItemsToLines, mapRemissionGlobalAdjustments } from "@/lib/remissionLineMapping";
import { AuthService } from "@/lib/auth";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";

import { showToast } from "@/components/sonner/CustomToaster";

// Las fechas del backend vienen como DD/MM/YYYY
function parseDDMMYYYYToISO(str?: string | null): string | undefined {
  if (!str) return undefined;
  const [day, month, year] = str.split('/');
  if (!day || !month || !year) return undefined;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function parseDDMMYYYYToDate(str?: string | null): Date | null {
  if (!str) return null;
  const [day, month, year] = str.split('/').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
}

export default function EditRemissionPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | number | undefined;
  const enabled = typeof id === 'string' || typeof id === 'number';

  const { data: remissionResponse, isLoading, isError } = useRemission(enabled ? id! : "");
  const updateRemission = useUpdateRemission();
  const catalogData = useCatalogs();
  const { data: sellersData } = useSellersList();

  const remissionTypeResolution = (catalogData.typeResolutions || []).find((t: any) => /remisi/i.test(t.name || ""));
  const resolutionTypeFilter = remissionTypeResolution?.id;
  const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Set is_main resolution as default until the remission's own resolution is loaded
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
  const storedCompany = AuthService.getCompany<any>();

  const [formState, setFormState] = useState<any>({
    notes: "",
    contact_id: null,
    seller_id: null,
    currency_id: "COP"
  });
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  const [typeRemissionId, setTypeRemissionId] = useState<number>(1);

  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const RemissionBuilder = useRemissionBuilder();

  // Snapshot de los valores originales de la remisión, usado para calcular qué cambió al guardar
  const baselineRef = useRef<any>(null);

  const remission = remissionResponse?.data?.remission;
  const remissionItems = (remissionResponse?.data as any)?.items || remission?.lines || remission?.remission_lines || [];

  const prefillAppliedRef = useRef(false);
  useEffect(() => {
    if (!prefillAppliedRef.current && remission) {
      prefillAppliedRef.current = true;

      const mappedItems = mapRemissionItemsToLines(remissionItems);
      const mappedAdjustments = mapRemissionGlobalAdjustments(remission);
      RemissionBuilder.setItems(mappedItems as any);
      RemissionBuilder.setGlobalAdjustments(mappedAdjustments as any);

      const warehouseId = remission.warehouse?.id ?? remission.warehouse_id ?? null;
      const priceListId = remission.price_list?.id ?? remission.price_list_id ?? null;
      const sellerIdRaw = remission.seller?.id ?? remission.seller_id;
      const costCenterIdRaw = remission.cost_center?.id ?? remission.cost_center_id;
      const currencyId = remission.currency?.code ?? remission.currency_id ?? "COP";
      const sellerId = sellerIdRaw != null ? String(sellerIdRaw) : null;
      const costCenterId = costCenterIdRaw != null ? String(costCenterIdRaw) : null;
      const notes = remission.notes || remission.observation || "";
      const termsAndConditions = remission.terms_and_conditions || "";
      const issueDateISO = parseDDMMYYYYToISO(remission.issue_date);
      const expiratopDateISO = parseDDMMYYYYToISO(remission.expiration_date);
      const typeRemission = Number(remission.type_remission_id) || 1;

      if (warehouseId) setSelectedWarehouseId(Number(warehouseId));
      if (priceListId) setSelectedPriceListId(Number(priceListId));
      if (remission.resolution_id) setSelectedResolutionId(Number(remission.resolution_id));
      setTypeRemissionId(typeRemission);

      setFormState((prev: any) => ({
        ...prev,
        contact_id: remission.contact_id ?? null,
        seller_id: sellerId,
        cost_center_id: costCenterId,
        currency_id: currencyId,
        notes,
        terms_and_conditions: termsAndConditions,
      }));

      baselineRef.current = {
        items: mappedItems,
        globalAdjustments: mappedAdjustments,
        warehouseId: warehouseId != null ? Number(warehouseId) : null,
        priceListId: priceListId != null ? Number(priceListId) : null,
        sellerId,
        costCenterId,
        currencyId,
        notes,
        termsAndConditions,
        contactId: remission.contact_id ?? null,
        resolutionId: remission.resolution_id ?? null,
        typeRemissionId: typeRemission,
        issueDateISO,
        expiratopDateISO,
      };
    }
  }, [remission, remissionItems]);

  const initialDueDate = remission ? parseDDMMYYYYToDate(remission.expiration_date) : null;

  // Drawer and fixed fields state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fixedFields, setFixedFields] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("remissionFixedFields");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      warehouse: false,
      seller: false,
      costCenter: false,
      currency: false,
      priceList: false,
    };
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("remissionFixedFields", JSON.stringify(fixedFields));
    }
  }, [fixedFields]);
  const [selectedCurrency, setSelectedCurrency] = useState("COP");
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);

  const currencies = [{ value: "COP", label: "COP - Peso Colombiano" }];

  const { data: costCentersResp } = useQuery({
    queryKey: ['costCenters', { is_active: true }],
    queryFn: async () => {
      return await costCentersApi.getCostCenters({ is_active: true });
    }
  });
  const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers'])
    ? costCentersResp?.data['cost-centers']
    : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);

  const costCenters = costCentersData.map((cc: any) => ({ value: cc.id.toString(), label: cc.name, description: cc.description || "" }));

  // Set default warehouse and price list when catalogs load, only if the remission hasn't loaded one yet
  useEffect(() => {
    if (catalogData.warehouses?.length > 0 && !selectedWarehouseId) {
      const defaultWh = catalogData.warehouses.find((w: any) => w.is_default) || catalogData.warehouses[0];
      setSelectedWarehouseId(defaultWh.id);
    }
    if (catalogData.priceLists?.length > 0 && !selectedPriceListId) {
      const defaultPl = catalogData.priceLists.find((pl: any) => pl.name === 'General') || catalogData.priceLists[0];
      setSelectedPriceListId(defaultPl.id);
    }
  }, [catalogData.warehouses, catalogData.priceLists]);

  const documentTypes = catalogData.typeDocumentIdentifications?.map((doc: any) => ({
    value: doc.id.toString(),
    label: doc.abbreviation
  })) || [];

  const warehouseOptions = catalogData.warehouses?.map((w: any) => ({ value: w.id.toString(), label: w.name })) || [];
  const priceListOptions = catalogData.priceLists?.map((pl: any) => ({ value: pl.id.toString(), label: pl.name })) || [];

  const sellersArray = Array.isArray(sellersData) ? sellersData : (sellersData?.data || []);
  const sellerOptions = sellersArray.map((s: any) => ({ value: String(s.id), label: s.name }));

  const currenciesOptions = catalogData.currencies?.map((c: any) => ({
    value: c.code || String(c.id),
    label: `${c.code} - ${c.name}`
  })) || [];

  const costCentersOptions = costCentersData.map((c: any) => ({
    value: String(c.id),
    label: c.name || String(c.id),
    description: c.description || ""
  }));

  const paymentMethods = catalogData.paymentMethods?.map((pm: any) => ({
    value: pm.id.toString(),
    label: pm.name
  })) || [];
  const paymentForms = catalogData.paymentForms?.map((pf: any) => ({
    value: pf.id.toString(),
    label: pf.name
  })) || [];

  // Data para el main
  const mainData = {
    logo: "/img/logo.png",
    company: {
      name: storedCompany?.company_name ?? "",
      nit: storedCompany
        ? `${storedCompany.identification_number}${storedCompany.verification_digit != null ? `-${storedCompany.verification_digit}` : ""}`
        : "",
      email: storedCompany?.email ?? "",
    },
    invoiceType: "Remisión electrónica",
    invoiceNumber: remission ? `${remission.prefix || ''}${remission.number || remission.id}` : "",
    documentTypes,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    paymentMethods,
    paymentForms,
    user: AuthService.getUser() as any,
  };

  const getContactId = () => formState.contact_id || formState.customer?.id || (typeof formState.customer === 'number' || typeof formState.customer === 'string' ? Number(formState.customer) : null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const contactId = getContactId();
    if (!contactId) {
      newErrors.contact_id = "El cliente es requerido";
      setErrors(newErrors);
      showToast("El cliente es requerido", "error");
      return false;
    }

    if (!selectedResolutionId) {
      newErrors.resolution_id = "La resolución es requerida";
      setErrors(newErrors);
      showToast("La numeración / resolución es requerida", "error");
      return false;
    }

    if (!RemissionBuilder.items || RemissionBuilder.items.length === 0) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la remisión", "error");
      return false;
    }

    const hasEmptyItems = RemissionBuilder.items.some((item: any) => !item.item_id);
    if (hasEmptyItems) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Por favor selecciona un producto o servicio en todas las filas de ítems", "error");
      return false;
    }

    const hasInvalidQuantity = RemissionBuilder.items.some((item: any) => item.item_id && (!item.cantidad || item.cantidad <= 0));
    if (hasInvalidQuantity) {
      newErrors.items = "invalid_quantity";
      setErrors(newErrors);
      showToast("Por favor ingrese una cantidad mayor a 0 en los productos seleccionados.", "error");
      return false;
    }

    if (RemissionBuilder.totals.payableAmount < 0) {
      showToast("El total del documento no puede ser un valor negativo", "error");
      return false;
    }

    setErrors({});
    return true;
  };

  const buildCurrentPayload = () => {
    const baseline = baselineRef.current;
    return RemissionBuilder.buildPayload({
      type_remission_id: typeRemissionId,
      resolution_id: selectedResolutionId,
      contact_id: getContactId(),
      customer: formState.customer,
      notes: formState.notes,
      terms_and_conditions: formState.terms_and_conditions,
      warehouse_id: selectedWarehouseId,
      seller_id: formState.seller_id,
      currency_id: formState.currency_id,
      price_list_id: selectedPriceListId,
      cost_center_id: formState.cost_center_id,
      issue_date: baseline?.issueDateISO,
      expiratop_date: formState.payment_due_date ? new Date(formState.payment_due_date).toISOString().split("T")[0] : baseline?.expiratopDateISO
    });
  };

  const handleSaveAction = async (_actionType?: string) => {
    if (!validateForm() || !enabled) return;

    const baseline = baselineRef.current;
    if (!baseline) return;

    setLoadingGuardar(true);
    try {
      const currentPayload = buildCurrentPayload();
      const contactId = getContactId();
      const patch: any = {};

      if (JSON.stringify(RemissionBuilder.items) !== JSON.stringify(baseline.items)) {
        patch.items = currentPayload.items;
      }

      if (JSON.stringify(RemissionBuilder.globalAdjustments) !== JSON.stringify(baseline.globalAdjustments)) {
        patch.allowance_charges = currentPayload.allowance_charges ?? [];
      }

      const settingsChanged =
        Number(selectedWarehouseId) !== Number(baseline.warehouseId) ||
        Number(selectedPriceListId) !== Number(baseline.priceListId) ||
        String(formState.seller_id || '') !== String(baseline.sellerId || '') ||
        String(formState.cost_center_id || '') !== String(baseline.costCenterId || '') ||
        (formState.currency_id || 'COP') !== (baseline.currencyId || 'COP') ||
        Number(typeRemissionId) !== Number(baseline.typeRemissionId);
      if (settingsChanged) patch.settings = currentPayload.settings;

      const remissionInfoChanged =
        Number(contactId) !== Number(baseline.contactId) ||
        Number(selectedResolutionId) !== Number(baseline.resolutionId) ||
        currentPayload.remission_information.expiratop_date !== baseline.expiratopDateISO;
      if (remissionInfoChanged) patch.remission_information = currentPayload.remission_information;

      if ((formState.notes || '') !== (baseline.notes || '')) {
        patch.notes = formState.notes || '';
      }

      if ((formState.terms_and_conditions || '') !== (baseline.termsAndConditions || '')) {
        patch.terms_and_conditions = formState.terms_and_conditions || '';
      }

      if (Object.keys(patch).length === 0) {
        showToast("No se detectaron cambios para guardar", "info");
        router.push(`/remissions/${id}`);
        return;
      }

      await updateRemission.mutateAsync({ id: id!, data: patch });
      showToast("Remisión actualizada correctamente", "success");
      router.push(`/remissions/${id}`);
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || "Error al actualizar la remisión", "error");
      }
      console.error(error);
    } finally {
      setLoadingGuardar(false);
    }
  };

  if (!enabled) return <div className="py-10 text-center text-red-500">ID de remisión inválido</div>;
  if (isLoading) return <RemissionDetailSkeleton />;
  if (isError || !remission) return <div className="py-10 text-center text-red-500">No se pudo cargar la remisión</div>;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <NewRemissionHeader
            title={`Editar remisión ${remission.prefix || ''}${remission.number || remission.id}`}
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />

          <NewRemissionMain
            mainData={mainData}
            catalogData={catalogData}
            invoiceBuilder={RemissionBuilder}
            typeRemissionId={typeRemissionId}
            setTypeRemissionId={setTypeRemissionId}
            fixedFields={fixedFields}
            selectedWarehouseId={selectedWarehouseId}
            setSelectedWarehouseId={setSelectedWarehouseId}
            selectedPriceListId={selectedPriceListId}
            setSelectedPriceListId={setSelectedPriceListId}
            warehouseOptions={warehouseOptions}
            priceListOptions={priceListOptions}
            sellerOptions={sellerOptions}
            currenciesOptions={currenciesOptions}
            costCentersOptions={costCentersOptions}
            taxes={catalogData.taxes}
            activeResolution={activeResolution}
            resolutions={resolutions || []}
            selectedResolutionId={selectedResolutionId}
            setSelectedResolutionId={setSelectedResolutionId}
            initialContactId={remission.contact_id}
            initialDueDate={initialDueDate}
            onRefetchResolutions={refetchResolutions}
            formState={formState}
            setFormState={setFormState}
            notes={formState.notes}
            onNotesChange={(val: string) => setFormState((prev: any) => ({ ...prev, notes: val }))}
            terms_and_conditions={formState.terms_and_conditions}
            onTermsChange={(val: string) => setFormState((prev: any) => ({ ...prev, terms_and_conditions: val }))}
            errors={errors}
          />

          <CommentsAndReminders type="remission" commentableId={id} />
          <NewRemissionFooter
            onNavigate={() => router.push(`/remissions/${id}`)}
            onSaveAction={handleSaveAction}
            loadingGuardar={loadingGuardar}
            onPreview={() => {
              if (validateForm()) setShowPreviewModal(true);
            }}
          />
        </div>
      </div>

      <PreviewModal
        open={showPreviewModal}
        onOpenChange={setShowPreviewModal}
        title="Vista previa - Remisión"
        preflightFn={(payload) => RemissionsService.preflight(payload)}
        data={showPreviewModal ? buildCurrentPayload() : null}
      />

      <NewRemissionSettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        fixedFields={fixedFields}
        setFixedFields={setFixedFields}
        warehouseOptions={warehouseOptions}
        selectedWarehouseId={selectedWarehouseId}
        setSelectedWarehouseId={setSelectedWarehouseId}
        sellerOptions={sellerOptions}
        selectedSeller={formState.seller_id}
        setSelectedSeller={(val) => setFormState((prev: any) => ({ ...prev, seller_id: val }))}
        priceListOptions={priceListOptions}
        selectedPriceListId={selectedPriceListId}
        setSelectedPriceListId={setSelectedPriceListId}
        currencies={currencies}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        costCenters={costCenters}
        selectedCostCenter={selectedCostCenter}
        setSelectedCostCenter={setSelectedCostCenter}
      />
    </div>
  );
}
