"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewPaymentForm } from "@/components/payments/new/NewPaymentForm";
import { PaymentTabs } from "@/components/payments/new/PaymentTabs";
import { showToast } from "@/components/sonner/CustomToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function NewPaymentPage() {
  const router = useRouter();
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [formState, setFormState] = useState<any>({
    contact_id: null,
    bank_account_id: null,
    payment_date: new Date(),
    payment_form_id: null,
    cost_center_id: null,
    income_type: "invoice_payment", // "invoice_payment" | "other_income"
    notes: "",
    other_incomes: [],
    retentions: []
  });
  const [formErrors, setFormErrors] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    // Validations
    let errors: Record<string, boolean> = {};

    if (!formState.bank_account_id) errors.bank_account_id = true;
    if (!formState.payment_form_id) errors.payment_form_id = true;
    if (!formState.payment_date) errors.payment_date = true;

    let hasAmount = false;
    let invoiceIdForPayload = null;
    if (formState.income_type === "invoice_payment") {
      const amounts = formState.receivedAmounts || {};
      for (const invId in amounts) {
        const val = Number(String(amounts[invId]).replace(/\D/g, ''));
        if (val > 0) {
          hasAmount = true;
          invoiceIdForPayload = invId;
          // We break here or just take the first one, or we can send all? 
          // Requirements say "solo en la que quiero agregar pago. por lo que también debes enviar invoice_id..." 
          break;
        }
      }
      if (!hasAmount) errors.amounts = true;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.bank_account_id || errors.payment_form_id || errors.payment_date) {
        showToast("Asegúrate de completar todos los campos marcados con *.", "error", "Revisa los campos obligatorios");
      }
      return;
    }

    // Prepare payload
    const payload = {
      invoice_id: invoiceIdForPayload ? parseInt(invoiceIdForPayload) : null,
      payment_type: formState.income_type === "invoice_payment" ? 1 : 2,
      notes: formState.notes || "",
      cost_center_id: formState.cost_center_id || null,
      customer_id: formState.contact_id || null,
      bank_account_id: formState.bank_account_id,
      payment_date: formState.payment_date,
      payment_form_id: formState.payment_form_id,
    };
    console.log("PAYLOAD:", payload);

    setLoadingGuardar(true);
    setTimeout(() => {
      showToast("Pago registrado exitosamente (Simulación)", "success");
      setLoadingGuardar(false);
      router.push("/payments");
    }, 1000);
  };

  const isFormDirty = () => {
    return !!formState.contact_id || !!formState.bank_account_id || !!formState.payment_form_id || formState.notes !== "" || (formState.other_incomes && formState.other_incomes.length > 0);
  };

  const handleCancelClick = () => {
    if (isFormDirty()) {
      setIsCancelModalOpen(true);
    } else {
      router.push("/payments");
    }
  };

  const confirmCancel = () => {
    setIsCancelModalOpen(false);
    router.push("/payments");
  };

  return (
    <div className="w-full min-h-screen text-foreground pb-4">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="page-title mb-0">Nuevo pago recibido</h1>
        </div>

        {/* MAIN FORM */}
        <NewPaymentForm
          formState={formState}
          setFormState={setFormState}
          formErrors={formErrors}
        />

        {/* BOTTOM ACTIONS */}
        <div className="flex justify-end items-center gap-4 mt-8">
          <Button
            variant="outline"
            className="btn-base cursor-pointer bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            onClick={handleCancelClick}
          >
            Cancelar
          </Button>
          <Button
            className="btn-base cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary/90 focus:text-primary-foreground"
            onClick={handleSave}
            disabled={loadingGuardar}
          >
            {loadingGuardar ? "Guardando..." : "Guardar"}
          </Button>
        </div>

        {/* COMMENTS SECTION */}
        <PaymentTabs />
      </div>

      {/* CANCEL MODAL */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Cancelar Pago</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600">
              ¿Desea cancelar el registro de pago? Esta acción no podrá deshacerse y los datos digitados se perderán.
            </p>
          </div>
          <DialogFooter className="gap-3 sm:gap-3">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} className="rounded-lg border border-gray-300 bg-white hover:bg-gray-100 font-medium text-slate-700 cursor-pointer">
              No, volver
            </Button>
            <Button variant="destructive" onClick={confirmCancel} className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] font-medium text-white cursor-pointer">
              Sí, cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
