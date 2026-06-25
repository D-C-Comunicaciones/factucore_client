"use client";

import React, { useState, useEffect } from "react";
import { PenLine, FileText } from "lucide-react";
import { useCatalogs } from "@/hooks/useCatalogs";
import { ContactsService } from "@/lib/contacts";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { PaymentNumberingModal } from "@/components/payments/new/PaymentNumberingModal";
import { OtherIncomeTable } from "@/components/payments/new/OtherIncomeTable";
import { cn } from "@/lib/utils";
import { useResolutions } from "@/hooks/useResolutions";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { PaymentTabs } from "./PaymentTabs";
import { PaymentInvoicesList } from "./PaymentInvoicesList";

interface NewPaymentFormProps {
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
}

export function NewPaymentForm({ formState, setFormState }: NewPaymentFormProps) {
  const catalogs = useCatalogs();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // Load resolutions
  const { resolutions } = useResolutions({ type_resolution: 5, is_active: true });
  const [selectedResolutionId, setSelectedResolutionId] = useState<number | null>(null);

  useEffect(() => {
    if (resolutions && resolutions.length > 0 && !selectedResolutionId) {
      const defaultRes = resolutions.find((r: any) => r.is_main) || resolutions[0];
      setSelectedResolutionId(defaultRes.id);
    }
  }, [resolutions, selectedResolutionId]);

  const activeResolution = resolutions?.find((r: any) => r.id === selectedResolutionId) || resolutions?.[0];
  const nextNumber = activeResolution
    ? ((activeResolution.current_number ?? (activeResolution.from_number - 1)) + 1)
    : 1;
  const resolutionDisplay = activeResolution?.name || activeResolution?.prefix || "Recibo de caja";

  // Load customers
  const fetchCustomers = async () => {
    setLoadingCustomers(true);
    try {
      const res = await ContactsService.list({ role: 'customer' });
      let list: any[] = [];
      if (res && res.data) {
        if (Array.isArray(res.data)) list = res.data;
        else if (res.data.data && Array.isArray(res.data.data)) list = res.data.data;
        else if (res.data.contacts && Array.isArray(res.data.contacts)) list = res.data.contacts;
      }
      setCustomers(list);
    } catch (err) {
      console.error("Error loading customers", err);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const customerOptions = customers.map(c => ({
    value: c.id.toString(),
    label: c.registration_name || `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.identification_number
  }));

  const paymentFormOptions = catalogs.paymentMethods?.map((pf: any) => ({
    value: pf.id.toString(),
    label: pf.name
  })) || [];

  const bankAccountOptions = catalogs.bankAccounts?.map((ba: any) => ({
    value: ba.id.toString(),
    label: ba.name
  })) || [];

  const costCenterOptions = [
    { value: "1", label: "Principal" },
    { value: "2", label: "Sucursal Norte" }
  ];

  // Display name logic for the header card
  const selectedCustomer = customers.find(c => c.id.toString() === formState.contact_id);
  const customerDisplayName = selectedCustomer
    ? (selectedCustomer.registration_name || `${selectedCustomer.first_name || ""} ${selectedCustomer.last_name || ""}`.trim())
    : "Cliente seleccionado";

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Top Header Card Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-foreground">
              {formState.contact_id ? customerDisplayName : "Nuevo pago"}
            </h2>
            {formState.contact_id && selectedCustomer && (
              <span className="text-sm text-muted-foreground">
                {selectedCustomer.identification_number} {selectedCustomer.verification_digit ? `-${selectedCustomer.verification_digit}` : ""}
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-foreground">
              No. {activeResolution?.prefix || ""}{nextNumber}
            </div>
            <div
              className="text-sm text-muted-foreground flex items-center justify-end gap-1 cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsNumberingModalOpen(true)}
            >
              {resolutionDisplay}
              <PenLine className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Cliente</label>
            <SearchableSelect
              value={formState.contact_id || ""}
              onValueChange={(val) => setFormState({ ...formState, contact_id: val })}
              options={customerOptions}
              placeholder="Seleccionar"
              footer={
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsAddContactModalOpen(true);
                  }}
                  className="w-full text-center text-primary text-sm font-medium p-2 hover:bg-primary/5 rounded-md transition-colors"
                >
                  Crear nuevo cliente
                </button>
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Cuenta bancaria <span className="text-primary">*</span>
            </label>
            <SearchableSelect
              value={formState.bank_account_id || ""}
              onValueChange={(val) => setFormState({ ...formState, bank_account_id: val })}
              options={bankAccountOptions}
              placeholder="Seleccionar"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Fecha de pago <span className="text-primary">*</span>
            </label>
            <DatePickerSimple
              value={formState.payment_date}
              onChange={(date) => setFormState({ ...formState, payment_date: date })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Forma de pago <span className="text-primary">*</span>
            </label>
            <SearchableSelect
              value={formState.payment_form_id || ""}
              onValueChange={(val) => setFormState({ ...formState, payment_form_id: val })}
              options={paymentFormOptions}
              placeholder="Seleccionar"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Centro de costo
            </label>
            <SearchableSelect
              value={formState.cost_center_id || ""}
              onValueChange={(val) => setFormState({ ...formState, cost_center_id: val })}
              options={costCenterOptions}
              placeholder="Seleccionar"
            />
          </div>
        </div>

        {/* Type Toggle */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-foreground">Tipo de ingreso</label>
          <div className="flex items-center p-1 bg-muted/30 rounded-lg border border-border">
            <button
              type="button"
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                formState.income_type === "invoice_payment"
                  ? "bg-white text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFormState({ ...formState, income_type: "invoice_payment" })}
            >
              Pago a factura de cliente
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                formState.income_type === "other_income"
                  ? "bg-white text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFormState({ ...formState, income_type: "other_income" })}
            >
              Otros ingresos
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        {formState.income_type === "invoice_payment" ? (
          <PaymentInvoicesList contactId={formState.contact_id} />
        ) : (
          <OtherIncomeTable
            formState={formState}
            setFormState={setFormState}
          />
        )}

        {/* Total Display */}
        <div className="flex justify-end items-center mt-12 mb-8">
          <div className="text-xl font-bold text-foreground mr-8">Total</div>
          <div className="text-2xl font-bold text-foreground">
            $ 0
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-foreground">Notas</label>
          <textarea
            className="w-full h-24 rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/70"
            placeholder="Agrega detalles adicionales que serán visibles en la impresión."
            value={formState.notes}
            onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
          />
        </div>
      </div>

      {/* Tabs at the bottom */}
      <PaymentTabs />

      {/* Modals */}
      <PaymentNumberingModal
        open={isNumberingModalOpen}
        onOpenChange={setIsNumberingModalOpen}
        resolutions={resolutions}
        selectedResolutionId={selectedResolutionId}
        setSelectedResolutionId={setSelectedResolutionId}
        currentNextNumber={`${activeResolution?.prefix || ""}${nextNumber}`}
      />

      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onCustomerCreated={() => fetchCustomers()}
        catalogData={catalogs}
      />
    </div>
  );
}
