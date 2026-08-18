"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewRemissionFooter } from "@/components/remission/new/NewRemissionFooter";
import { NewRemissionHeader } from "@/components/remission/new/NewRemissionHeader";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { NewRemissionMain } from "@/components/remission/new/NewRemissionMain";
import { NewRemissionSettingsDrawer } from "@/components/remission/new/NewRemissionSettingsDrawer";
import { PreviewModal } from "@/components/invoice/new/PreviewModal";
import { useCreateRemission, useRemission } from "@/hooks/remissions/useRemissions";
import { useRemissionBuilder } from "@/hooks/remissions/useRemissionBuilder";
import { useQuote } from "@/hooks/quotes/useQuotes";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { RemissionsService } from "@/lib/remissions";
import { mapRemissionItemsToLines, mapRemissionGlobalAdjustments } from "@/lib/remissionLineMapping";
import { mapQuoteItemsToLines, mapQuoteGlobalAdjustments } from "@/lib/quoteLineMapping";
import { AuthService } from "@/lib/auth";
import { getSession } from "@/common/interfaces/session";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";

import { showToast } from "@/components/sonner/CustomToaster";

export default function NewRemissionPage() {
  return (
    <Suspense fallback={null}>
      <NewRemissionPageContent />
    </Suspense>
  );
}

function NewRemissionPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cloneId = searchParams?.get("cloneId");
  const quoteId = searchParams?.get("quoteId");
  const createRemission = useCreateRemission();
  const catalogData = useCatalogs();
  const { data: sellersData } = useSellersList();
  const { data: cloneSourceResponse } = useRemission(cloneId || "");
  const { data: quoteSourceResponse } = useQuote(quoteId || "");

  // Resuelve dinámicamente el id del tipo de resolución "Remisión" desde el catálogo,
  // en vez de asumir un id fijo como se hace para otros documentos.
  const remissionTypeResolution = (catalogData.typeResolutions || []).find((t: any) => /remisi/i.test(t.name || ""));
  const resolutionTypeFilter = remissionTypeResolution?.id;
  const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Set is_main resolution as default when resolutions load
  useEffect(() => {
    if (resolutions.length > 0) {
      const isValid = resolutions.some((r: Resolution) => r.id === selectedResolutionId);
      if (!isValid) {
        // Prefer is_main, fallback to first
        const mainRes = resolutions.find((r: Resolution) => r.is_main) || resolutions[0];
        setSelectedResolutionId(mainRes.id);
      }
    } else {
      setSelectedResolutionId(null);
    }
  }, [resolutions]);

  const activeResolution = resolutions.find((r: Resolution) => r.id === selectedResolutionId) || resolutions[0] || null;
  // Leer company guardada en localStorage al iniciar sesión
  const storedCompany = AuthService.getCompany<any>();

  const [formState, setFormState] = useState<any>({
    notes: "",
    contact_id: null,
    seller_id: null,
    currency_id: "COP"
  });
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // Tipo de documento: 1 Remisión, 2 Orden de servicio
  const [typeRemissionId, setTypeRemissionId] = useState<number>(1);

  // Selected filters for items
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Initialize the builder hook
  const RemissionBuilder = useRemissionBuilder();

  // Prefill everything from the source remission when cloning ("Clonar")
  const cloneSourceRemission = cloneSourceResponse?.data?.remission;
  const cloneSourceItems = (cloneSourceResponse?.data as any)?.items || cloneSourceRemission?.lines || cloneSourceRemission?.remission_lines || [];
  const clonePrefillAppliedRef = useRef(false);
  useEffect(() => {
    if (!clonePrefillAppliedRef.current && cloneId && cloneSourceRemission) {
      clonePrefillAppliedRef.current = true;
      RemissionBuilder.setItems(mapRemissionItemsToLines(cloneSourceItems) as any);
      RemissionBuilder.setGlobalAdjustments(mapRemissionGlobalAdjustments(cloneSourceRemission) as any);

      const warehouseId = cloneSourceRemission.warehouse?.id ?? cloneSourceRemission.warehouse_id ?? cloneSourceRemission.selected_warehouse?.id;
      const priceListId = cloneSourceRemission.price_list?.id ?? cloneSourceRemission.price_list_id;
      if (warehouseId) setSelectedWarehouseId(Number(warehouseId));
      if (priceListId) setSelectedPriceListId(Number(priceListId));

      const sellerIdRaw = cloneSourceRemission.seller?.id ?? cloneSourceRemission.seller_id;
      const costCenterIdRaw = cloneSourceRemission.cost_center?.id ?? cloneSourceRemission.cost_center_id;

      if (cloneSourceRemission.type_remission_id) {
        setTypeRemissionId(Number(cloneSourceRemission.type_remission_id));
      }

      setFormState((prev: any) => ({
        ...prev,
        seller_id: sellerIdRaw != null ? String(sellerIdRaw) : prev.seller_id,
        cost_center_id: costCenterIdRaw != null ? String(costCenterIdRaw) : prev.cost_center_id,
        currency_id: cloneSourceRemission.currency?.code ?? cloneSourceRemission.currency_id ?? prev.currency_id,
        notes: cloneSourceRemission.notes || cloneSourceRemission.observation || prev.notes,
        terms_and_conditions: cloneSourceRemission.terms_and_conditions || prev.terms_and_conditions,
      }));
    }
  }, [cloneId, cloneSourceRemission, cloneSourceItems]);

  // Prefill everything from the source quote when creating from ("Convertir a remisión")
  const quoteSourceQuote = quoteSourceResponse?.data?.quotation || quoteSourceResponse?.data?.quote || quoteSourceResponse?.data?.bill;
  const quoteSourceItems = (quoteSourceResponse?.data as any)?.items || quoteSourceQuote?.lines || quoteSourceQuote?.quote_lines || [];
  const quotePrefillAppliedRef = useRef(false);
  useEffect(() => {
    if (!quotePrefillAppliedRef.current && quoteId && quoteSourceQuote) {
      quotePrefillAppliedRef.current = true;
      RemissionBuilder.setItems(mapQuoteItemsToLines(quoteSourceItems) as any);
      RemissionBuilder.setGlobalAdjustments(mapQuoteGlobalAdjustments(quoteSourceQuote) as any);

      const warehouseId = quoteSourceQuote.warehouse?.id ?? quoteSourceQuote.warehouse_id ?? quoteSourceQuote.selected_warehouse?.id;
      const priceListId = quoteSourceQuote.price_list?.id ?? quoteSourceQuote.price_list_id;
      if (warehouseId) setSelectedWarehouseId(Number(warehouseId));
      if (priceListId) setSelectedPriceListId(Number(priceListId));

      const sellerIdRaw = quoteSourceQuote.seller?.id ?? quoteSourceQuote.seller_id;
      const costCenterIdRaw = quoteSourceQuote.cost_center?.id ?? quoteSourceQuote.cost_center_id;

      const quoteNumberLabel = `${quoteSourceQuote.prefix || ''}${quoteSourceQuote.number || quoteSourceQuote.id}`;
      const sourceNote = `Remisión elaborada a partir de la cotización: ${quoteNumberLabel}`;
      const originalNotes = quoteSourceQuote.notes || quoteSourceQuote.observation || '';
      const combinedNotes = originalNotes ? `${originalNotes}, ${sourceNote}` : sourceNote;

      setFormState((prev: any) => ({
        ...prev,
        seller_id: sellerIdRaw != null ? String(sellerIdRaw) : prev.seller_id,
        cost_center_id: costCenterIdRaw != null ? String(costCenterIdRaw) : prev.cost_center_id,
        currency_id: quoteSourceQuote.currency?.code ?? quoteSourceQuote.currency_id ?? prev.currency_id,
        notes: combinedNotes,
        terms_and_conditions: quoteSourceQuote.terms_and_conditions || prev.terms_and_conditions,
      }));
    }
  }, [quoteId, quoteSourceQuote, quoteSourceItems]);

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

  // Set default warehouse and price list when catalogs load
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
    invoiceNumber: activeResolution ? `${activeResolution.prefix || ''}${((activeResolution.current_number ?? (activeResolution.from_number - 1)) + 1)}` : "",
    documentTypes,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    paymentMethods,
    paymentForms,
    user: AuthService.getUser() as any,
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const contactId = formState.contact_id || formState.customer?.id || (typeof formState.customer === 'number' || typeof formState.customer === 'string' ? Number(formState.customer) : null);
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

    // Ítems
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

  const buildCurrentPayload = () => RemissionBuilder.buildPayload({
    type_remission_id: typeRemissionId,
    resolution_id: selectedResolutionId,
    contact_id: formState.contact_id || formState.customer?.id || (typeof formState.customer === 'number' || typeof formState.customer === 'string' ? Number(formState.customer) : null),
    customer: formState.customer,
    notes: formState.notes,
    terms_and_conditions: formState.terms_and_conditions,
    warehouse_id: selectedWarehouseId,
    seller_id: formState.seller_id,
    currency_id: formState.currency_id,
    price_list_id: selectedPriceListId,
    cost_center_id: formState.cost_center_id,
    issue_date: formState.fecha ? new Date(formState.fecha).toISOString().split("T")[0] : undefined,
    expiratop_date: formState.payment_due_date ? new Date(formState.payment_due_date).toISOString().split("T")[0] : undefined
  });

  const handleSaveAction = async (_actionType?: string) => {
    if (!validateForm()) return;

    setLoadingGuardar(true);
    try {
      const payload = buildCurrentPayload();

      // Si la remisión se está creando a partir de una cotización ("Convertir a remisión"), enlazarla
      if (quoteId) {
        payload.quotation_id = Number(quoteId);
      }

      const res: any = await RemissionsService.create(payload);
      showToast("Remisión creada correctamente", "success");

      const id =
        res?.id ||
        res?.data?.id ||
        res?.data?.remission?.id ||
        res?.data?.data?.id;

      if (id) {
        router.push(`/remissions/${id}`);
      } else {
        router.push("/remissions");
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || "Error al crear la remisión", "error");
      }
      console.error(error);
    } finally {
      setLoadingGuardar(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <NewRemissionHeader
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
            initialContactId={cloneSourceRemission?.contact_id ?? quoteSourceQuote?.contact_id}
            onRefetchResolutions={refetchResolutions}
            formState={formState}
            setFormState={setFormState}
            notes={formState.notes}
            onNotesChange={(val: string) => setFormState((prev: any) => ({ ...prev, notes: val }))}
            terms_and_conditions={formState.terms_and_conditions}
            onTermsChange={(val: string) => setFormState((prev: any) => ({ ...prev, terms_and_conditions: val }))}
            errors={errors}
          />

          <CommentsAndReminders
            comments={formState.comments || []}
            setComments={(newComments) => setFormState({ ...formState, comments: newComments })}
            requiresSaveFirst={true}
          />
          <NewRemissionFooter
            onNavigate={() => router.push("/remissions")}
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
