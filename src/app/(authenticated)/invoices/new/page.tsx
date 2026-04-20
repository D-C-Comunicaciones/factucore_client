"use client";
import { NewInvoiceFooter } from "@/components/invoice/new/NewInvoiceFooter";
import { NewInvoiceHeader } from "@/components/invoice/new/NewInvoiceHeader";
import { NewInvoiceInfo } from "@/components/invoice/new/NewInvoiceInfo";
import { NewInvoiceMain } from "@/components/invoice/new/NewInvoiceMain";
import { NewInvoiceOptions } from "@/components/invoice/new/NewInvoiceOptions";
import { NewInvoicePayment } from "@/components/invoice/new/NewInvoicePayment";
import { useState } from "react";
import { useCreateInvoice } from "@/hooks/invoices/useInvoices";
import { InvoicesService } from "@/lib/invoices";
import { useRouter } from "next/navigation";

export default function NewInvoicePage() {
  // Data de prueba para selects y catálogo
  const documentTypes = [
    { value: "CC", label: "Cédula" },
    { value: "NIT", label: "NIT" },
    { value: "CE", label: "Cédula de extranjería" },
  ];
  const warehouseOptions = [
    { value: "principal", label: "Principal" },
    { value: "secundaria", label: "Secundaria" },
  ];
  const priceListOptions = [
    { value: "general", label: "General" },
    { value: "mayorista", label: "Mayorista" },
  ];
  const sellerOptions = [
    { value: "andres", label: "Andrés Leones" },
    { value: "maria", label: "María Gómez" },
  ];
  const paymentMethods = [
    { value: "efectivo", label: "Efectivo" },
    { value: "transferencia", label: "Transferencia" },
    { value: "tarjeta", label: "Tarjeta" },
  ];
  const paymentForms = [
    { value: "contado", label: "Contado" },
    { value: "credito", label: "Crédito" },
  ];

  const invoiceItemsMock = [
    { id: 1, item: "", referencia: "", precio: "", descuento: "", impuesto: "", descripcion: "", cantidad: 0, total: 0 },
  ];

  const [invoiceItems, setInvoiceItems] = useState(invoiceItemsMock);
  const [showEmitirMenu, setShowEmitirMenu] = useState(false);
  const [formState, setFormState] = useState<any>({});
  const createInvoice = useCreateInvoice();
  const [loadingEmitir, setLoadingEmitir] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const router = useRouter();

  // Data para el main
  const mainData = {
    logo: "/img/logo.png",
    company: {
      name: "LEONES PALACIO ANDRES FELIPE",
      nit: "1143263398",
      email: "leones1997@live.com",
    },
    invoiceType: "Factura electrónica",
    invoiceNumber: "LTCH-2",
    documentTypes,
    warehouseOptions,
    priceListOptions,
    sellerOptions,
    paymentMethods,
    paymentForms,
    invoiceItems,
    onAddItem: () => {
      setInvoiceItems([
        ...invoiceItems,
        {
          id: invoiceItems.length + 1,
          item: "",
          referencia: "",
          precio: "",
          descuento: "",
          impuesto: "",
          descripcion: "",
          cantidad: 0,
          total: 0,
        },
      ]);
    },
  };

  // Handler para guardar como borrador
  const handleGuardar = async () => {
    setLoadingGuardar(true);
    try {
      // Construir payload dinámico
      const payload = InvoicesService.buildInvoicePayload({ ...formState, invoice_lines: invoiceItems });
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
      // Construir payload dinámico
      const payload = InvoicesService.buildInvoicePayload({ ...formState, invoice_lines: invoiceItems });
      const res: any = await createInvoice.mutateAsync(payload);
      const id = res?.id || res?.data?.id;
      if (id) {
        // Emitir llamando a /send
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
          <NewInvoiceHeader />
          <NewInvoiceOptions
            warehouseOptions={warehouseOptions}
            priceListOptions={priceListOptions}
            sellerOptions={sellerOptions}
          />
          <NewInvoiceMain
            mainData={mainData}
            setInvoiceItems={setInvoiceItems}
          />
          <NewInvoicePayment />
          <NewInvoiceInfo />
          <NewInvoiceFooter
            showEmitirMenu={showEmitirMenu}
            setShowEmitirMenu={setShowEmitirMenu}
            onNavigate={() => { }}
            emitirHandler={handleEmitir}
            guardarHandler={handleGuardar}
            loadingEmitir={loadingEmitir}
            loadingGuardar={loadingGuardar}
          />
        </div>
      </div>
    </div>
  );
}