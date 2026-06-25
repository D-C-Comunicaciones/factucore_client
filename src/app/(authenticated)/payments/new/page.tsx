"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NewPaymentForm } from "@/components/payments/new/NewPaymentForm";
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

  const handleSave = () => {
    // Validations
    if (!formState.contact_id) {
      showToast("El cliente es requerido", "error");
      return;
    }
    if (!formState.bank_account_id) {
      showToast("La cuenta bancaria es requerida", "error");
      return;
    }
    if (!formState.payment_date) {
      showToast("La fecha de pago es requerida", "error");
      return;
    }
    if (!formState.payment_form_id) {
      showToast("La forma de pago es requerida", "error");
      return;
    }

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
      </div>

      {/* CANCEL MODAL */}
      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cancelar registro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-slate-600">
              ¿Desea cancelar el registro de pago? Esta acción no podrá deshacerse y los datos digitados se perderán.
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} className="rounded-lg border-gray-300 font-medium text-slate-700 cursor-pointer">
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
