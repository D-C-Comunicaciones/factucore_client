"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewInvoiceFooter } from "@/components/invoice/new/NewInvoiceFooter";
import { NewInvoiceHeader } from "@/components/invoice/new/NewInvoiceHeader";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { NewInvoiceMain } from "@/components/invoice/new/NewInvoiceMain";
import { NewInvoiceOptions } from "@/components/invoice/new/NewInvoiceOptions";
import { NewInvoicePayment } from "@/components/invoice/new/NewInvoicePayment";
import { PreviewModal } from "@/components/invoice/new/PreviewModal";
import { useCreateInvoice } from "@/hooks/invoices/useInvoices";
import { useInvoiceBuilder, isIvaTax } from "@/hooks/invoices/useInvoiceBuilder";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { useQuote } from "@/hooks/quotes/useQuotes";
import { useRemission } from "@/hooks/remissions/useRemissions";
import { mapQuoteItemsToLines, mapQuoteGlobalAdjustments } from "@/lib/quoteLineMapping";
import { mapRemissionItemsToLines, mapRemissionGlobalAdjustments } from "@/lib/remissionLineMapping";
import { InvoicesService } from "@/lib/invoices";
import { shouldValidateLineStock } from "@/lib/itemStock";
import { AuthService } from "@/lib/auth";
import { getSession } from "@/common/interfaces/session";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";
import { useQuery } from "@tanstack/react-query";
import { costCentersApi } from "@/lib/costCenters";

import { showToast } from "@/components/sonner/CustomToaster";

export default function NewInvoicePage() {
  return (
    <Suspense fallback={null}>
      <NewInvoicePageContent />
    </Suspense>
  );
}

function NewInvoicePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteId = searchParams?.get("quoteId");
  const remissionId = searchParams?.get("remissionId");
  const createInvoice = useCreateInvoice();
  const catalogData = useCatalogs();
  const { data: sellersData } = useSellersList();
  const { data: quoteResponse } = useQuote(quoteId || "");
  const { data: remissionResponse } = useRemission(remissionId || "");
  const [tipoDoc, setTipoDoc] = useState<'factura' | 'tiquete'>('factura');
  const resolutionTypeFilter = tipoDoc === 'tiquete' ? 2 : 1; // 1=INVOICE, 2=POS
  const { resolutions, refetch: refetchResolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, any>>({});
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);

  const { data: costCentersResp } = useQuery({
    queryKey: ['costCenters', { is_active: true }],
    queryFn: async () => await costCentersApi.getCostCenters({ is_active: true })
  });
  
  const { data: costCentersSettingsResp } = useQuery({
    queryKey: ['costCenterSettings', { type_document: 'invoice' }],
    queryFn: async () => await costCentersApi.getSettings({ type_document: 'invoice' })
  });

  useEffect(() => {
    if (costCentersSettingsResp?.data) {
      const settings = Array.isArray(costCentersSettingsResp.data) ? costCentersSettingsResp.data : (costCentersSettingsResp.data.settings || []);
      const invoiceSetting = settings.find((s: any) => s.document_type === 'invoice');
      if (invoiceSetting?.default_cost_center_id && !selectedCostCenter) {
        setSelectedCostCenter(invoiceSetting.default_cost_center_id.toString());
      }
    }
  }, [costCentersSettingsResp]);

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
    payment_due_date: null
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
  const [showPurchaseOrderBar, setShowPurchaseOrderBar] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Initialize the builder hook
  const invoiceBuilder = useInvoiceBuilder();

  // Prefill items, discounts and charges when creating an invoice from a quote ("Convertir a factura")
  const quoteDataForInvoice = quoteResponse?.data?.quotation || quoteResponse?.data?.quote || quoteResponse?.data?.bill;
  const quoteItemsForInvoice = (quoteResponse?.data as any)?.items || quoteDataForInvoice?.lines || quoteDataForInvoice?.quote_lines || [];
  const quotePrefillAppliedRef = useRef(false);
  useEffect(() => {
    if (!quotePrefillAppliedRef.current && quoteId && quoteDataForInvoice) {
      quotePrefillAppliedRef.current = true;
      invoiceBuilder.setItems(mapQuoteItemsToLines(quoteItemsForInvoice) as any);
      invoiceBuilder.setGlobalAdjustments(mapQuoteGlobalAdjustments(quoteDataForInvoice) as any);

      const warehouseId = quoteDataForInvoice.warehouse?.id ?? quoteDataForInvoice.warehouse_id;
      const priceListId = quoteDataForInvoice.price_list?.id ?? quoteDataForInvoice.price_list_id;
      const costCenterId = quoteDataForInvoice.cost_center?.id ?? quoteDataForInvoice.cost_center_id;
      const sellerIdRaw = quoteDataForInvoice.seller?.id ?? quoteDataForInvoice.seller_id;
      if (warehouseId) setSelectedWarehouseId(Number(warehouseId));
      if (priceListId) setSelectedPriceListId(Number(priceListId));
      if (costCenterId) setSelectedCostCenter(String(costCenterId));

      const quoteNumberLabel = `${quoteDataForInvoice.prefix || ''}${quoteDataForInvoice.number || quoteDataForInvoice.id}`;
      const sourceNote = `Factura Elaborada a partir de la cotización: ${quoteNumberLabel}`;
      const originalNotes = quoteDataForInvoice.notes || quoteDataForInvoice.observation || '';
      const combinedNotes = originalNotes ? `${originalNotes}, ${sourceNote}` : sourceNote;

      setFormState((prev: any) => ({
        ...prev,
        seller_id: sellerIdRaw != null ? String(sellerIdRaw) : prev.seller_id,
        notes: combinedNotes,
      }));
    }
  }, [quoteId, quoteDataForInvoice, quoteItemsForInvoice]);

  // Prefill items, discounts and charges when creating an invoice from a remission ("Convertir a factura")
  const remissionDataForInvoice = remissionResponse?.data?.remission;
  const remissionItemsForInvoice = (remissionResponse?.data as any)?.items || remissionDataForInvoice?.lines || remissionDataForInvoice?.remission_lines || [];
  const remissionPrefillAppliedRef = useRef(false);
  useEffect(() => {
    if (!remissionPrefillAppliedRef.current && remissionId && remissionDataForInvoice) {
      remissionPrefillAppliedRef.current = true;
      invoiceBuilder.setItems(mapRemissionItemsToLines(remissionItemsForInvoice) as any);
      invoiceBuilder.setGlobalAdjustments(mapRemissionGlobalAdjustments(remissionDataForInvoice) as any);

      const warehouseId = remissionDataForInvoice.warehouse?.id ?? remissionDataForInvoice.warehouse_id;
      const priceListId = remissionDataForInvoice.price_list?.id ?? remissionDataForInvoice.price_list_id;
      const costCenterId = remissionDataForInvoice.cost_center?.id ?? remissionDataForInvoice.cost_center_id;
      const sellerIdRaw = remissionDataForInvoice.seller?.id ?? remissionDataForInvoice.seller_id;
      if (warehouseId) setSelectedWarehouseId(Number(warehouseId));
      if (priceListId) setSelectedPriceListId(Number(priceListId));
      if (costCenterId) setSelectedCostCenter(String(costCenterId));

      const remissionNumberLabel = `${remissionDataForInvoice.prefix || ''}${remissionDataForInvoice.number || remissionDataForInvoice.id}`;
      const sourceNote = `Factura creada a partir de remisión No. ${remissionNumberLabel}`;
      const originalNotes = remissionDataForInvoice.notes || remissionDataForInvoice.observation || '';
      const combinedNotes = originalNotes ? `${originalNotes}, ${sourceNote}` : sourceNote;

      setFormState((prev: any) => ({
        ...prev,
        seller_id: sellerIdRaw != null ? String(sellerIdRaw) : prev.seller_id,
        notes: combinedNotes,
      }));
    }
  }, [remissionId, remissionDataForInvoice, remissionItemsForInvoice]);

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

  const costCentersData = Array.isArray(costCentersResp?.data?.['cost-centers']) 
    ? costCentersResp?.data['cost-centers'] 
    : (Array.isArray(costCentersResp?.data) ? costCentersResp.data : []);
  const costCenterOptions = costCentersData.map((cc: any) => ({ value: cc.id.toString(), label: cc.name, description: cc.description || "" }));

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
    if (!invoiceBuilder.items || invoiceBuilder.items.length === 0) {
      setErrors(newErrors);
      showToast("Debe agregar al menos un ítem a la factura", "error");
      return false;
    } else {
      const hasEmptyItems = invoiceBuilder.items.some((item: any) => !item.item_id);
      if (hasEmptyItems) {
        newErrors.items = "empty_items";
        setErrors(newErrors);
        showToast("Por favor selecciona un producto o servicio en todas las filas de ítems", "error");
        return false;
      }
      const hasInvalidQuantity = invoiceBuilder.items.some((item: any) => item.item_id && (!item.cantidad || item.cantidad <= 0));
      if (hasInvalidQuantity) {
        newErrors.items = "invalid_quantity";
        setErrors(newErrors);
        showToast("Por favor ingrese una cantidad mayor a 0 en los productos seleccionados.", "error");
        return false;
      }

      const outOfStockItem = invoiceBuilder.items.find((item: any) => {
        if (shouldValidateLineStock(item)) {
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

    if (invoiceBuilder.totals.payableAmount < 0) {
        showToast("El total del documento no puede ser un valor negativo", "error");
        return false;
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

    if (formState.paymentData && Number(formState.paymentData.amount) > invoiceBuilder.totals.total) {
      const maxAllowed = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(invoiceBuilder.totals.total);
      showToast(`El pago que intenta registrar excede el valor facturado. El máximo que puede registrar es ${maxAllowed} (cargos, descuentos e impuestos incluidos, sin contar retenciones).`, "warning");
      return;
    }

    setLoadingGuardar(true);
    try {
      const rawPayload = invoiceBuilder.buildPayload({
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
        remission_id,
        purchase_order_id,
        ...restRaw
      } = rawPayload;

      // Ensure the payload is strictly ordered: single properties first, then objects/arrays
      const finalPayload: any = {
        resolution_id,
        type_operation_invoice: 1,
        type_currency_id: 35,
        seller_id: sellerId,
        cost_center_id: selectedCostCenter ? Number(selectedCostCenter) : undefined,
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

      // Si la factura se está creando a partir de una cotización ("Convertir a factura"), enlazarla
      if (quoteId) {
        finalPayload.quotation_id = Number(quoteId);
      }

      // Remisión asociada: la seleccionada manualmente en el formulario tiene prioridad sobre
      // la remisión de origen ("Convertir a factura") pasada por query param
      if (remission_id) {
        finalPayload.remission_id = Number(remission_id);
      } else if (remissionId) {
        finalPayload.remission_id = Number(remissionId);
      }

      // Orden de compra asociada a esta factura
      if (purchase_order_id) {
        finalPayload.purchase_order_id = Number(purchase_order_id);
      }

      // Remove undefined values cleanly
      Object.keys(finalPayload).forEach(key => finalPayload[key] === undefined && delete finalPayload[key]);

      if (actionType === "SEND") {
        // Emitir directamente a la DIAN: POST /invoices/send (sin save_action)
        const res: any = await InvoicesService.sendDirect(finalPayload);
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
        router.push(`/invoices/${id}`);

      } else if (actionType === "DRAFT") {
        // Guardar como borrador: POST /invoices con save_action DRAFT
        const payload = { ...finalPayload, save_action: "DRAFT" };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        showToast("Borrador guardado correctamente", "success");
        router.push(`/invoices/${id}`);

      } else if (actionType === "CREATE_NEW") {
        // Guardar y crear nueva: POST /invoices con save_action SAVED + limpiar form
        const payload = { ...finalPayload, save_action: "SAVED" };
        await createInvoice.mutateAsync(payload);
        showToast("Factura guardada correctamente", "success");
        invoiceBuilder.reset();
        refetchResolutions();
        setFormState({ notes: "", contact_id: null, payment_form_id: null, payment_method_id: null, payment_due_date: null });

      } else if (actionType === "PRINT") {
        const payload = { ...finalPayload, save_action: "SAVED" };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        window.open(InvoicesService.getPdfUrl(id), "_blank");
        router.push(`/invoices/${id}`);

      } else if (actionType === "SEND_EMAIL") {
        const payload = { ...finalPayload, save_action: "SAVED", send_email: true };
        const res: any = await createInvoice.mutateAsync(payload);
        const id = res?.id || res?.data?.id || res?.data?.bill?.id || res?.data?.data?.bill?.id;
        if (!id) throw new Error("No se pudo obtener el ID de la factura");
        showToast("Factura guardada y enviada por correo", "success");
        router.push(`/invoices/${id}`);
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
          <NewInvoiceHeader
            showWarehouse={showWarehouse}
            setShowWarehouse={setShowWarehouse}
            showPriceList={showPriceList}
            setShowPriceList={setShowPriceList}
            tipoDoc={tipoDoc}
          />
          <NewInvoiceOptions
            warehouseOptions={warehouseOptions}
            priceListOptions={priceListOptions}
            sellerOptions={sellerOptions}
            selectedWarehouseId={selectedWarehouseId}
            setSelectedWarehouseId={setSelectedWarehouseId}
            selectedPriceListId={selectedPriceListId}
            setSelectedPriceListId={setSelectedPriceListId}
            selectedSeller={formState.seller_id}
            setSelectedSeller={(val) => setFormState((prev: any) => ({ ...prev, seller_id: val }))}
            showWarehouse={showWarehouse}
            showPriceList={showPriceList}
            tipoDoc={tipoDoc}
            setTipoDoc={setTipoDoc}
            showRemissionBar={showRemissionBar}
            setShowRemissionBar={setShowRemissionBar}
            showPurchaseOrderBar={showPurchaseOrderBar}
            setShowPurchaseOrderBar={setShowPurchaseOrderBar}
            purchaseOrderId={formState.purchase_order_id}
            setPurchaseOrderId={(val) => setFormState((prev: any) => ({ ...prev, purchase_order_id: val }))}
            contactId={formState.contact_id}
            costCenterOptions={costCenterOptions}
            selectedCostCenter={selectedCostCenter}
            setSelectedCostCenter={setSelectedCostCenter}
          />
          <NewInvoiceMain
            mainData={mainData}
            catalogData={catalogData}
            invoiceBuilder={invoiceBuilder}
            selectedWarehouseId={selectedWarehouseId}
            selectedPriceListId={selectedPriceListId}
            taxes={catalogData.taxes}
            activeResolution={activeResolution}
            resolutions={resolutions || []}
            selectedResolutionId={selectedResolutionId}
            setSelectedResolutionId={setSelectedResolutionId}
            onRefetchResolutions={refetchResolutions}
            initialContactId={quoteDataForInvoice?.contact_id ?? remissionDataForInvoice?.contact_id}
            formState={formState}
            setFormState={setFormState}
            notes={formState.notes}
            onNotesChange={(val: string) => setFormState((prev: any) => ({ ...prev, notes: val }))}
            showRemissionBar={showRemissionBar}
            setShowRemissionBar={setShowRemissionBar}
            showPurchaseOrderBar={showPurchaseOrderBar}
            setShowPurchaseOrderBar={setShowPurchaseOrderBar}
            errors={errors}
          />
          <NewInvoicePayment
            paymentMethods={paymentMethods}
            bankAccounts={bankAccounts}
            paymentData={formState.paymentData}
            onPaymentDataChange={(data) => setFormState({ ...formState, paymentData: data })}
            errors={errors}
          />
          <CommentsAndReminders
            comments={formState.comments || []}
            setComments={(newComments) => setFormState({ ...formState, comments: newComments })}
          />
          <NewInvoiceFooter
            onNavigate={() => router.push("/invoices")}
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
        data={showPreviewModal ? invoiceBuilder.buildPayload({
          ...formState,
          resolution_id: selectedResolutionId,
        }) : null}
      />
    </div>
  );
}