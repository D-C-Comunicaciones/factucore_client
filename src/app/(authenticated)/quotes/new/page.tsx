"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewQuoteFooter } from "@/components/quote/new/NewQuoteFooter";
import { NewQuoteHeader } from "@/components/quote/new/NewQuoteHeader";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { NewQuoteMain } from "@/components/quote/new/NewQuoteMain";
import { NewQuoteOptions } from "@/components/quote/new/NewQuoteOptions";
import { NewQuoteSettingsDrawer } from "@/components/quote/new/NewQuoteSettingsDrawer";
import { PreviewModal } from "@/components/invoice/new/PreviewModal";
import { useCreateQuote } from "@/hooks/quotes/useQuotes";
import { useQuoteBuilder, isIvaTax } from "@/hooks/quotes/useQuoteBuilder";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { QuotesService } from "@/lib/quotes";
import { AuthService } from "@/lib/auth";
import { getSession } from "@/common/interfaces/session";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import { costCentersApi } from "@/lib/costCenters";
import { useQuery } from "@tanstack/react-query";

import { showToast } from "@/components/sonner/CustomToaster";

export default function NewQuotePage() {
  const router = useRouter();
  const createInvoice = useCreateQuote();
  const catalogData = useCatalogs();
  const { data: sellersData } = useSellersList();
  const resolutionTypeFilter = 7; // Quotes
  const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});

  // Set is_main resolution as default when resolutions load or tipoDoc changes
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

  const [showEmitirMenu, setShowEmitirMenu] = useState(false);
  const [formState, setFormState] = useState<any>({
    notes: "",
    contact_id: null,
    seller_id: null,
    payment_form_id: null,
    payment_method_id: null,
    payment_due_date: null,
    currency_id: "COP"
  });
  const [loadingEmitir, setLoadingEmitir] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);

  // Selected filters for items
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | null>(null);
  const [selectedPriceListId, setSelectedPriceListId] = useState<number | null>(null);

  // States for customizing visible fields
  const [showWarehouse, setShowWarehouse] = useState(true);
  const [showPriceList, setShowPriceList] = useState(true);
  const [showRemissionBar, setShowRemissionBar] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Initialize the builder hook
  const QuoteBuilder = useQuoteBuilder();

  // Drawer and fixed fields state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [fixedFields, setFixedFields] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("quoteFixedFields");
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
      localStorage.setItem("quoteFixedFields", JSON.stringify(fixedFields));
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

  const bankAccounts = catalogData.bankAccounts?.map((ba: any) => ({
    value: ba.id.toString(),
    label: ba.name
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
    invoiceType: "Factura electrónica",
    invoiceNumber: activeResolution ? `${activeResolution.prefix || ''}${((activeResolution.current_number ?? (activeResolution.from_number - 1)) + 1)}` : "",
    documentTypes,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    paymentMethods,
    paymentForms,
    user: AuthService.getUser() as any,
  };

  const selectedForm = paymentForms.find((f: any) => f.value === String(formState.payment_form_id));
  const isContadoForm = !formState.payment_form_id || !selectedForm ||
    selectedForm.label?.toLowerCase().includes("contado") ||
    selectedForm.value?.toLowerCase() === "contado" ||
    selectedForm.value === "1";

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
    if (!QuoteBuilder.items || QuoteBuilder.items.length === 0) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la cotización", "error");
      return false;
    }

    const hasEmptyItems = QuoteBuilder.items.some((item: any) => !item.item_id);
    if (hasEmptyItems) {
      newErrors.items = "empty_items";
      setErrors(newErrors);
      showToast("Por favor selecciona un producto o servicio en todas las filas de ítems", "error");
      return false;
    }

    const hasInvalidQuantity = QuoteBuilder.items.some((item: any) => item.item_id && (!item.cantidad || item.cantidad <= 0));
    if (hasInvalidQuantity) {
      newErrors.items = "invalid_quantity";
      setErrors(newErrors);
      showToast("Por favor ingrese una cantidad mayor a 0 en los productos seleccionados.", "error");
      return false;
    }

    if (QuoteBuilder.totals.payableAmount < 0) {
      showToast("El total del documento no puede ser un valor negativo", "error");
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSaveAction = async (_actionType?: string) => {
    if (!validateForm()) return;

    setLoadingGuardar(true);
    try {
      const payload = QuoteBuilder.buildPayload({
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

      const res: any = await QuotesService.create(payload);
      showToast("Cotización creada correctamente", "success");

      const id =
        res?.id ||
        res?.data?.id ||
        res?.data?.quote?.id ||
        res?.data?.quotation?.id ||
        res?.data?.data?.id;

      if (id) {
        router.push(`/quotes/${id}`);
      } else {
        router.push("/quotes");
      }
    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        showToast(error.response?.data?.message || "Se encontraron errores de validación", "error");
      } else {
        showToast(error.response?.data?.message || "Error al crear la cotización", "error");
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
          <NewQuoteHeader
            onOpenDrawer={() => setIsDrawerOpen(true)}
          />

          <NewQuoteMain
            mainData={mainData}
            catalogData={catalogData}
            invoiceBuilder={QuoteBuilder}
            selectedWarehouseId={selectedWarehouseId}
            selectedPriceListId={selectedPriceListId}
            taxes={catalogData.taxes}
            activeResolution={activeResolution}
            resolutions={resolutions || []}
            selectedResolutionId={selectedResolutionId}
            setSelectedResolutionId={setSelectedResolutionId}
            onRefetchResolutions={refetchResolutions}
            formState={formState}
            setFormState={setFormState}
            notes={formState.notes}
            onNotesChange={(val: string) => setFormState((prev: any) => ({ ...prev, notes: val }))}
            terms_and_conditions={formState.terms_and_conditions}
            onTermsChange={(val: string) => setFormState((prev: any) => ({ ...prev, terms_and_conditions: val }))}
            showRemissionBar={showRemissionBar}
            setShowRemissionBar={setShowRemissionBar}
            errors={errors}
            quoteOptionsComponent={
              (fixedFields.warehouse || fixedFields.priceList || fixedFields.seller || fixedFields.costCenter || fixedFields.currency) ? (
                <NewQuoteOptions
                  warehouseOptions={warehouseOptions}
                  priceListOptions={priceListOptions}
                  sellerOptions={sellerOptions}
                  selectedWarehouseId={selectedWarehouseId}
                  setSelectedWarehouseId={setSelectedWarehouseId}
                  selectedPriceListId={selectedPriceListId}
                  setSelectedPriceListId={setSelectedPriceListId}
                  showWarehouse={fixedFields.warehouse}
                  showPriceList={fixedFields.priceList}
                  showSeller={fixedFields.seller}
                  showCurrency={fixedFields.currency}
                  showCostCenter={fixedFields.costCenter}
                  showRemissionBar={showRemissionBar}
                  setShowRemissionBar={setShowRemissionBar}
                  selectedSeller={formState.seller_id}
                  setSelectedSeller={(val) => setFormState((prev: any) => ({ ...prev, seller_id: val }))}
                  currencies={currenciesOptions}
                  selectedCurrency={formState.currency_id}
                  setSelectedCurrency={(val) => setFormState((prev: any) => ({ ...prev, currency_id: val }))}
                  costCenters={costCentersOptions}
                  selectedCostCenter={formState.cost_center_id}
                  setSelectedCostCenter={(val) => setFormState((prev: any) => ({ ...prev, cost_center_id: val }))}
                />
              ) : null
            }
          />

          <CommentsAndReminders
            comments={formState.comments || []}
            setComments={(newComments) => setFormState({ ...formState, comments: newComments })}
            requiresSaveFirst={true}
          />
          <NewQuoteFooter
            onNavigate={() => router.push("/quotes")}
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
        title="Vista previa - Cotización"
        preflightFn={(payload) => QuotesService.preflight(payload)}
        data={showPreviewModal ? QuoteBuilder.buildPayload({
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
        }) : null}
      />

      <NewQuoteSettingsDrawer
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
