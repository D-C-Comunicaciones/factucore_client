"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NewInvoiceFooter } from "@/components/invoice/new/NewInvoiceFooter";
import { NewInvoiceHeader } from "@/components/invoice/new/NewInvoiceHeader";
import { NewInvoiceInfo } from "@/components/invoice/new/NewInvoiceInfo";
import { NewInvoiceMain } from "@/components/invoice/new/NewInvoiceMain";
import { NewInvoiceOptions } from "@/components/invoice/new/NewInvoiceOptions";
import { NewInvoicePayment } from "@/components/invoice/new/NewInvoicePayment";
import { useCreateInvoice } from "@/hooks/invoices/useInvoices";
import { useInvoiceBuilder } from "@/hooks/invoices/useInvoiceBuilder";
import { useCatalogs } from "@/hooks/useCatalogs";
import { useSellersList } from "@/hooks/sellers/useSellers";
import { InvoicesService } from "@/lib/invoices";
import { AuthService } from "@/lib/auth";
import { useResolutions } from "@/hooks/useResolutions";
import type { Resolution } from "@/lib/resolutions";

export default function NewInvoicePage() {
  const router = useRouter();
  const createInvoice = useCreateInvoice();
  const catalogData = useCatalogs();
  const { data: sellersData } = useSellersList();
  const [tipoDoc, setTipoDoc] = useState<'factura' | 'tiquete'>('factura');
  const resolutionTypeFilter = tipoDoc === 'tiquete' ? 2 : 1; // 1=INVOICE, 2=POS
  const { resolutions } = useResolutions({ type_resolution: resolutionTypeFilter, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

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
    customer_id: null,
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

  // Initialize the builder hook
  const invoiceBuilder = useInvoiceBuilder();

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
    invoiceType: "Factura electrónica",
    invoiceNumber: activeResolution ? `${activeResolution.prefix || ''}${((activeResolution.current_number ?? (activeResolution.from_number - 1)) + 1)}` : "",
    documentTypes,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    paymentMethods,
    paymentForms,
  };

  // Handler para guardar como borrador
  const handleGuardar = async () => {
    setLoadingGuardar(true);
    try {
      const payload = invoiceBuilder.buildPayload({
        ...formState,
        numbering_range_id: selectedResolutionId,
      });
      const res: any = await createInvoice.mutateAsync(payload);
      const id = res?.id || res?.data?.id;
      if (id) {
        router.push(`/invoices/${id}`);
      }
    } finally {
      setLoadingGuardar(false);
    }
  };

  // Handler para emitir (guardar y luego enviar a la DIAN)
  const handleEmitir = async () => {
    setLoadingEmitir(true);
    try {
      const payload = invoiceBuilder.buildPayload({
        ...formState,
        numbering_range_id: selectedResolutionId,
      });
      const res: any = await createInvoice.mutateAsync(payload);
      const id = res?.id || res?.data?.id;
      if (id) {
        await InvoicesService.sendInvoice(id);
        router.push(`/invoices/${id}`);
      }
    } finally {
      setLoadingEmitir(false);
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
            showWarehouse={showWarehouse}
            showPriceList={showPriceList}
            tipoDoc={tipoDoc}
            setTipoDoc={setTipoDoc}
            showRemissionBar={showRemissionBar}
            setShowRemissionBar={setShowRemissionBar}
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
            formState={formState}
            setFormState={setFormState}
            notes={formState.notes}
            onNotesChange={(val: string) => setFormState((prev: any) => ({ ...prev, notes: val }))}
            showRemissionBar={showRemissionBar}
            setShowRemissionBar={setShowRemissionBar}
          />
          <NewInvoicePayment />
          <NewInvoiceInfo />
          <NewInvoiceFooter
            onNavigate={() => { }}
            guardarHandler={handleGuardar}
            loadingGuardar={loadingGuardar}
          />
        </div>
      </div>
    </div>
  );
}