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

    // 1. Contacto
    if (!formState.customer) {
      newErrors.contact_id = "El contacto es requerido";
      setErrors(newErrors);
      showToast("El contacto es requerido", "error");
      return false;
    } else {
      const c = formState.customer;
      const missing = [];
      if (!c.identification_number) missing.push("Número de identificación");
      if (c.type_document_identification?.code === "31" && (c.verification_digit === null || c.verification_digit === undefined)) missing.push("Dígito de verificación (NIT)");
      if (c.type_organization?.code === "1" && !c.registration_name) missing.push("Razón social");
      if (c.type_organization?.code === "2" && (!c.first_name || !c.last_name)) missing.push("Nombres y Apellidos");
      if (!c.email) missing.push("Correo electrónico");
      if (!c.type_document_identification) missing.push("Tipo de documento");
      if (!c.type_organization) missing.push("Tipo de organización");
      if (!c.type_regime) missing.push("Tipo de régimen");


      if (missing.length > 0) {
        newErrors.contact_id = "Faltan datos requeridos del cliente";
        setErrors(newErrors);
        showToast(`Faltan datos en el cliente: ${missing.join(", ")}`, "error");
        return false;
      }
    }

    // 2. Forma / Medio de pago

    if (isContadoForm) {
      if (!formState.payment_method_id) {
        newErrors.payment_method_id = "El método de pago es requerido";
        setErrors(newErrors);
        showToast("El método de pago es requerido", "error");
        return false;
      }
    } else {
      if (!formState.payment_term_id) {
        newErrors.payment_term_id = "El plazo de pago es requerido";
        setErrors(newErrors);
        showToast("El plazo de pago es requerido para facturas a crédito", "error");
        return false;
      }
      if (!formState.payment_due_date) {
        newErrors.payment_due_date = "La fecha de vencimiento es requerida";
        setErrors(newErrors);
        showToast("La fecha de vencimiento es requerida para facturas a crédito", "error");
        return false;
      }
    }

    // 3. Ítems
    if (!QuoteBuilder.items || QuoteBuilder.items.length === 0) {
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la factura", "error");
      return false;
    } else {
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

      const outOfStockItem = QuoteBuilder.items.find((item: any) => {
        if (item.is_inventoriable && !item.allow_negative_stock) {
          const availableStock = item.stock_quantity || 0;
          return item.cantidad > availableStock;
        }
        return false;
      });

      if (outOfStockItem) {
        newErrors.items = "out_of_stock";
        setErrors(newErrors);
        showToast(`El producto "${outOfStockItem.item}" no tiene stock suficiente. Stock disponible: ${outOfStockItem.stock_quantity || 0}, Cantidad solicitada: ${outOfStockItem.cantidad}.`, "error");
        return false;
      }


    }

    // 4. Pago
    if (formState.paymentData) {
      if (!formState.paymentData.resolution_id) {
        newErrors.payment_resolution = "Requerido";
      }
      if (!formState.paymentData.payment_date) {
        newErrors.payment_date = "Requerido";
      }
      if (!formState.paymentData.account_id) {
        newErrors.payment_account = "Requerido";
      }
      if (!formState.paymentData.payment_method_id) {
        newErrors.payment_method = "Requerido";
      }
      if (!formState.paymentData.amount || formState.paymentData.amount <= 0) {
        newErrors.payment_amount = "Debe ser mayor a 0";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        "Asegúrate de completar todos los campos marcados con * e intenta de nuevo.",
        "error",
        "Revisa los campos obligatorios"
      );
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSaveAction = async (actionType: "DRAFT" | "SEND" | "SEND_EMAIL" | "PRINT" | "CREATE_NEW") => {
    if (!validateForm()) return;

    if (formState.paymentData && Number(formState.paymentData.amount) > QuoteBuilder.totals.total) {
      const maxAllowed = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(QuoteBuilder.totals.total);
      showToast(`El pago que intenta registrar excede el valor facturado. El máximo que puede registrar es ${maxAllowed} (cargos, descuentos e impuestos incluidos, sin contar retenciones).`, "warning");
      return;
    }

    setLoadingGuardar(true);
    try {
      const rawPayload = QuoteBuilder.buildPayload({
        ...formState,
        resolution_id: selectedResolutionId,
      });

      const session = getSession();
      if (session?.user?.id) {
        rawPayload.user_id = session.user.id;
      }

      if (rawPayload.customer) {
        const c = rawPayload.customer;
        rawPayload.customer = {
          id: c.id,
          identification_number: c.identification_number,
          verification_digit: c.verification_digit,
          registration_name: c.registration_name,
          first_name: c.first_name,
          last_name: c.last_name,
          address: c.address,
          email: c.email,
          phone1: c.phone1,
          type_document_identification: c.type_document_identification ? {
            code: c.type_document_identification.code,
            name: c.type_document_identification.name
          } : undefined,
          type_organization: c.type_organization ? {
            code: c.type_organization.code,
            name: c.type_organization.name
          } : undefined,
          type_regime: c.type_regime ? {
            code: c.type_regime.code,
            name: c.type_regime.name
          } : undefined,
          type_liabilities: c.type_liabilities && c.type_liabilities.length > 0 ? c.type_liabilities.map((t: any) => ({
            code: t.code,
            name: t.name
          })) : [{ code: "R-99-PN", name: "No aplica" }],
          municipality: c.municipality ? {
            code: c.municipality.code,
            name: c.municipality.name,
            department: c.municipality.department ? {
              code: c.municipality.department.code,
              name: c.municipality.department.name,
              country: c.municipality.department.country ? {
                code: c.municipality.department.country.code,
                name: c.municipality.department.country.name
              } : undefined
            } : undefined
          } : undefined
        };
      }

      if (formState.paymentData) {
        rawPayload.payments = [formState.paymentData];
      }

      let sellerId: number | null = null;
      if (rawPayload.seller_id && rawPayload.seller_id !== "") {
        sellerId = Number(rawPayload.seller_id);
      }

      const {
        resolution_id,
        payment_form_id,
        payment_method_id,
        payment_term_id,
        payment_due_date,
        user_id,
        notes,
        billing_period,
        customer,
        items,
        allowance_charges,
        seller_id,
        ...restRaw
      } = rawPayload;

      // Ensure the payload is strictly ordered: single properties first, then objects/arrays
      const finalPayload: any = {
        resolution_id,
        type_operation_invoice: 1,
        type_currency_id: 35,
        seller_id: sellerId,
        payment_form_id,
        payment_method_id,
        payment_term_id: isContadoForm ? undefined : payment_term_id,
        payment_due_date,
        user_id,
        notes: notes || "",
        ...restRaw, // Include any other root properties (like type_document_id)
        billing_period,
        customer,
        items,
        allowance_charges,
      };

      if (rawPayload.payments) {
        finalPayload.payments = rawPayload.payments;
      }

      // Remove undefined values cleanly
      Object.keys(finalPayload).forEach(key => finalPayload[key] === undefined && delete finalPayload[key]);

      if (actionType === "SEND") {
        // Emitir directamente a la DIAN: POST /quotes/send (sin save_action)
        const res: any = await QuotesService.sendDirect(finalPayload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");

        if (res?.dian && res.dian.estado_documento === "NO APROBADA") {
          const errorMsg = res.dian.mensaje_dian || "La factura se creó pero fue rechazada por la DIAN";
          const details = res.dian.errors && res.dian.errors.length > 0
            ? res.dian.errors.map((e: any) => e.message).join(" | ")
            : "";
          showToast(`${errorMsg}. ${details}`, "error");
          return;
        }

        showToast("Factura validada correctamente por la DIAN", "success");
        router.push(`/quotes/${id}`);

      } else if (actionType === "DRAFT") {
        // Guardar como borrador: POST /quotes con save_action DRAFT
        const payload = { ...finalPayload, save_action: "DRAFT" };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        showToast("Borrador guardado correctamente", "success");
        router.push(`/quotes/${id}`);

      } else if (actionType === "CREATE_NEW") {
        // Guardar y crear nueva: POST /quotes con save_action SAVED + limpiar form
        const payload = { ...finalPayload, save_action: "SAVED" };
        await createInvoice.mutateAsync(payload);
        showToast("Factura guardada correctamente", "success");
        QuoteBuilder.reset();
        refetchResolutions();
        setFormState({ notes: "", contact_id: null, payment_form_id: null, payment_method_id: null, payment_due_date: null });

      } else if (actionType === "PRINT") {
        const payload = { ...finalPayload, save_action: "SAVED" };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        window.open(QuotesService.getPdfUrl(id), "_blank");
        router.push(`/quotes/${id}`);

      } else if (actionType === "SEND_EMAIL") {
        const payload = { ...finalPayload, save_action: "SAVED", send_email: true };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        showToast("Factura guardada y enviada por correo", "success");
        router.push(`/quotes/${id}`);
      }

    } catch (error: any) {
      const backendErrors = error.response?.data?.errors;
      if (backendErrors) {
        setErrors(backendErrors);
        if (backendErrors.prevalidation && Array.isArray(backendErrors.prevalidation) && backendErrors.prevalidation.length > 0) {
          showToast(backendErrors.prevalidation[0], "error");
        } else if (backendErrors.inventory && Array.isArray(backendErrors.inventory) && backendErrors.inventory.length > 0) {
          showToast(backendErrors.inventory[0], "error");
        } else {
          showToast("Se encontraron errores de validación en el formulario", "error");
        }
      } else {
        showToast(error.response?.data?.message || "Error al procesar la factura", "error");
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
        data={showPreviewModal ? QuoteBuilder.buildPayload({
          ...formState,
          resolution_id: selectedResolutionId,
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
