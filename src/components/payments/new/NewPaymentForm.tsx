"use client";

import React, { useState, useEffect } from "react";
import { PenLine, FileText, RefreshCw, HelpCircle, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useCatalogs } from "@/hooks/useCatalogs";
import { ContactsService } from "@/lib/contacts";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { PaymentNumberingModal } from "@/components/payments/new/PaymentNumberingModal";
import { OtherIncomeTable } from "@/components/payments/new/OtherIncomeTable";
import { cn } from "@/lib/utils";
import { useResolutions } from "@/hooks/useResolutions";
import { AddContactModal } from "@/components/contact/new/AddContactModal";
import { AuthService } from "@/lib/auth";

import { PaymentInvoicesList } from "./PaymentInvoicesList";
import { Skeleton } from "@/components/ui/skeleton";

interface NewPaymentFormProps {
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  formErrors?: Record<string, boolean>;
}

export function NewPaymentForm({ formState, setFormState, formErrors }: NewPaymentFormProps) {
  const catalogs = useCatalogs();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [isNumberingModalOpen, setIsNumberingModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // Load resolutions
  const { resolutions, refetch: refetchResolutions, isLoading: isLoadingResolutions } = useResolutions({ type_resolution: 5, is_active: true });
  useEffect(() => {
    if (resolutions && resolutions.length > 0 && !formState.resolution_id) {
      const defaultRes = resolutions.find((r: any) => r.is_main) || resolutions[0];
      setFormState((prev: any) => ({ ...prev, resolution_id: defaultRes.id }));
    }
  }, [resolutions, formState.resolution_id, setFormState]);

  const activeResolution = resolutions?.find((r: any) => r.id === formState.resolution_id) || resolutions?.[0];
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

  // Display name logic for the header card (Company in session)
  const [storedCompany, setStoredCompany] = useState<any>(null);

  useEffect(() => {
    setStoredCompany(AuthService.getCompany());
  }, []);

  const companyName = storedCompany?.company_name || storedCompany?.name || "Cargando empresa...";
  const companyNit = storedCompany ? `${storedCompany.identification_number || ""}${storedCompany.verification_digit != null ? `-${storedCompany.verification_digit}` : ""}` : "";

  const calculateTotal = () => {
    if (formState.income_type === "invoice_payment") {
      const amounts = formState.receivedAmounts || {};
      return Object.values(amounts).reduce((acc: number, curr: any) => {
        const val = Number(String(curr).replace(/\D/g, '')) || 0;
        return acc + val;
      }, 0);
    } else {
      const incomes = formState.other_incomes || [];
      return incomes.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border overflow-hidden">
      {/* Top Header Card Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#0f3660]">
              {companyName}
            </h2>
            {companyNit && (
              <>
                <div className="w-px h-5 bg-slate-300"></div>
                <span className="text-[15px] text-muted-foreground">
                  {companyNit}
                </span>
              </>
            )}
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <div className="text-xl font-bold text-foreground">
                {isLoadingResolutions ? (
                  <Skeleton className="h-7 w-32" />
                ) : (
                  <>No. {activeResolution?.prefix || ""}{nextNumber}</>
                )}
              </div>
              <button
                type="button"
                onClick={() => refetchResolutions()}
                disabled={isLoadingResolutions}
                className="p-1 hover:bg-slate-100 rounded-md transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50 cursor-pointer"
                title="Actualizar numeración"
              >
                <RefreshCw className={cn("w-4 h-4", isLoadingResolutions && "animate-spin")} />
              </button>
            </div>
            <div className="flex items-center justify-end mt-1">
              <div
                className="text-sm text-muted-foreground flex items-center gap-1 cursor-pointer hover:text-black transition-colors"
                onClick={() => setIsNumberingModalOpen(true)}
              >
                {resolutionDisplay}
                <PenLine className="w-3.5 h-3.5" />
              </div>
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
                  + Crear nuevo cliente
                </button>
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <span>Cuenta bancaria <span className="text-primary">*</span></span>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-primary hover:text-primary/80 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#1C2433] text-white p-3 border-none max-w-[280px]">
                    <p className="font-medium text-[13px] leading-tight">
                      Seleccione la cuenta bancaria en la que desea depositar el dinero. Aprende cómo gestionar tus cuentas bancarias <a href="#" className="text-primary hover:underline underline-offset-2 decoration-primary cursor-pointer">aquí</a>
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <SearchableSelect
              value={formState.bank_account_id || ""}
              onValueChange={(val) => {
                setFormState({ ...formState, bank_account_id: val });
                if (formErrors?.bank_account_id) formErrors.bank_account_id = false;
              }}
              options={bankAccountOptions}
              placeholder="Seleccionar"
              className={formErrors?.bank_account_id ? "border-[#ef4444] text-[#ef4444]" : ""}
              errorIcon={formErrors?.bank_account_id ? <AlertCircle className="w-4 h-4 text-[#ef4444]" /> : undefined}
            />
            {formErrors?.bank_account_id && (
              <p className="text-[11px] text-[#ef4444]">Indica la cuenta donde recibiste el pago</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Fecha de pago <span className="text-primary">*</span>
            </label>
            <DatePickerSimple
              value={formState.payment_date}
              onChange={(date) => {
                setFormState({ ...formState, payment_date: date });
                if (formErrors?.payment_date) formErrors.payment_date = false;
              }}
              className={formErrors?.payment_date ? "border-[#ef4444]" : ""}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Forma de pago <span className="text-primary">*</span>
            </label>
            <SearchableSelect
              value={formState.payment_form_id || ""}
              onValueChange={(val) => {
                setFormState({ ...formState, payment_form_id: val });
                if (formErrors?.payment_form_id) formErrors.payment_form_id = false;
              }}
              options={paymentFormOptions}
              placeholder="Seleccionar"
              className={formErrors?.payment_form_id ? "border-[#ef4444] text-[#ef4444]" : ""}
              errorIcon={formErrors?.payment_form_id ? <AlertCircle className="w-4 h-4 text-[#ef4444]" /> : undefined}
            />
            {formErrors?.payment_form_id && (
              <p className="text-[11px] text-[#ef4444]">Indica la forma de pago utilizado</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
              <span>Centro de costo</span>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-primary hover:text-primary/80 transition-colors cursor-help">
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#1C2433] text-white p-3 border-none max-w-[280px]">
                    <p className="font-medium text-[13px] leading-tight">
                      El centro de costo que elijas será asociado a tu banco y conceptos
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <SearchableSelect
              value={formState.cost_center_id || ""}
              onValueChange={(val) => setFormState({ ...formState, cost_center_id: val })}
              options={[]}
              placeholder="Seleccionar"
            />
          </div>
        </div>

        {/* Type Toggle */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-medium text-foreground">Tipo de ingreso</label>
          <div className="flex items-center p-0.5 bg-muted/30 rounded-lg border border-border">
            <button
              type="button"
              className={cn(
                "flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer",
                formState.income_type === "invoice_payment"
                  ? "bg-white text-primary shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setFormState({ ...formState, income_type: "invoice_payment" })}
            >
              Pago a factura de cliente
            </button>
            <button
              type="button"
              className={cn(
                "flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer",
                formState.income_type === "other_income"
                  ? "bg-white text-primary shadow-sm border border-border/50"
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
          <PaymentInvoicesList
            contactId={formState.contact_id}
            formState={formState}
            setFormState={setFormState}
          />
        ) : (
          <OtherIncomeTable
            formState={formState}
            setFormState={setFormState}
          />
        )}

        {/* Total Display */}
        <div className="flex justify-end items-center mt-12 mb-8 pr-4">
          <div className="text-xl font-bold text-slate-900 mr-12">Total</div>
          <div className="text-xl font-bold text-slate-900">
            $ {calculateTotal().toLocaleString('es-CO')}
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



      {/* Modals */}
      <PaymentNumberingModal
        open={isNumberingModalOpen}
        onOpenChange={setIsNumberingModalOpen}
        resolutions={resolutions}
        selectedResolutionId={formState.resolution_id}
        setSelectedResolutionId={(id) => setFormState({ ...formState, resolution_id: id })}
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
