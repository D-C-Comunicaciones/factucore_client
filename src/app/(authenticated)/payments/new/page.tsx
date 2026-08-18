"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { NewPaymentForm } from "@/components/payments/new/NewPaymentForm";
import { PaymentTabs } from "@/components/payments/new/PaymentTabs";
import { showToast } from "@/components/sonner/CustomToaster";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PaymentsService } from "@/lib/payments";
import { useEffect } from "react";

export default function NewPaymentPage() {
  return (
    <Suspense fallback={null}>
      <NewPaymentPageContent />
    </Suspense>
  );
}

function NewPaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const customerId = searchParams.get('customer_id');

  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [formState, setFormState] = useState<any>({
    contact_id: customerId || null,
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

  const handleSave = async () => {
    // Validations
    let errors: Record<string, boolean> = {};

    if (!formState.contact_id) errors.contact_id = true;
    if (!formState.bank_account_id) errors.bank_account_id = true;
    if (!formState.payment_form_id) errors.payment_form_id = true;
    if (!formState.payment_date) errors.payment_date = true;

    let totalAmount = 0;
    let hasAmountForInvoices = false;
    
    if (formState.income_type === "invoice_payment") {
      const amounts = formState.receivedAmounts || {};
      for (const invId in amounts) {
        const val = Number(String(amounts[invId]).replace(/\D/g, ''));
        if (val > 0) {
          hasAmountForInvoices = true;
        }
      }
      if (!hasAmountForInvoices) errors.amounts = true;
    } else {
      if (!formState.other_incomes || formState.other_incomes.length === 0) {
        errors.other_incomes = true;
      } else {
        totalAmount = formState.other_incomes.reduce((acc: number, curr: any) => acc + (Number(curr.total) || 0), 0);
        if (totalAmount <= 0) errors.amounts = true;
      }
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      if (errors.contact_id || errors.bank_account_id || errors.payment_form_id || errors.payment_date) {
        showToast("Asegúrate de completar todos los campos marcados con *.", "error", "Revisa los campos obligatorios");
      } else if (errors.amounts) {
        showToast("Debes ingresar un valor a pagar mayor a cero.", "error");
      } else if (errors.other_incomes) {
        showToast("Debes agregar al menos un concepto de ingreso.", "error");
      }
      return;
    }

    const formattedDate = formState.payment_date instanceof Date 
      ? formState.payment_date.toISOString().split('T')[0] 
      : formState.payment_date;

    const basePayment: any = {
      contact_id: parseInt(formState.contact_id),
      account_id: parseInt(formState.bank_account_id),
      payment_method_id: parseInt(formState.payment_form_id),
      payment_date: formattedDate,
    };
    if (formState.resolution_id) basePayment.resolution_id = parseInt(formState.resolution_id);
    if (formState.notes) basePayment.notes = formState.notes;
    if (formState.cost_center_id) basePayment.cost_center_id = parseInt(formState.cost_center_id);

    let paymentsPayload: any[] = [];

    if (formState.income_type === "invoice_payment") {
      const amounts = formState.receivedAmounts || {};
      const withholdings = formState.withholdings || {};
      
      for (const invId in amounts) {
        const val = Number(String(amounts[invId]).replace(/\D/g, ''));
        if (val > 0) {
          const invPayment: any = {
            ...basePayment,
            income_type_id: 1,
            invoice_id: parseInt(invId),
            amount: val
          };
          
          const invWithholdings = withholdings[invId];
          if (invWithholdings && invWithholdings.length > 0) {
            invPayment.withholdings = invWithholdings.map((ret: any) => ({
              withholding_rate_id: parseInt(ret.type_id || ret.withholding_rate_id || ret.id),
              base_amount: parseFloat(ret.base_amount || val),
              amount: parseFloat(ret.amount || ret.value)
            }));
          }
          paymentsPayload.push(invPayment);
        }
      }
    } else {
      const otherPayment: any = {
        ...basePayment,
        income_type_id: 2,
        amount: totalAmount,
        lines: formState.other_incomes.map((item: any) => ({
          concept_id: parseInt(item.concept) || 1, // fallback since UI is dummy
          quantity: parseInt(item.qty) || 1,
          price: parseFloat(item.value) || 0,
          tax_rate_id: item.tax ? parseInt(item.tax) : null,
          total: parseFloat(item.total) || 0
        }))
      };

      if (formState.retentions && formState.retentions.length > 0) {
        otherPayment.withholdings = formState.retentions.map((ret: any) => ({
          withholding_rate_id: parseInt(ret.id),
          base_amount: parseFloat(ret.base_amount || totalAmount),
          amount: parseFloat(ret.amount)
        }));
      }
      paymentsPayload.push(otherPayment);
    }

    const payload = { payments: paymentsPayload };
    console.log("PAYLOAD:", JSON.stringify(payload, null, 2));

    setLoadingGuardar(true);
    try {
      const res: any = await PaymentsService.create(payload);
      showToast("Pagos registrados exitosamente", "success");

      // El detalle de cada factura queda cacheado hasta 24h (staleTime global) y no
      // se refresca solo al navegar de vuelta — sin esto, el pago recién creado no
      // aparece en /invoices/[id] hasta que el usuario refresque manualmente. Se usa
      // `predicate` porque la queryKey de /invoices/[id] guarda el id como string
      // (viene de la URL) mientras que aquí es un número.
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      paymentsPayload.forEach((p) => {
        if (p.invoice_id) {
          queryClient.invalidateQueries({
            predicate: (query) => query.queryKey[0] === "invoice" && String(query.queryKey[1]) === String(p.invoice_id),
          });
        }
      });

      const paymentId = res?.data?.payment?.id || res?.data?.id || res?.data?.[0]?.id || res?.data?.payments?.[0]?.id || res?.id || res?.[0]?.id;
      if (paymentId) {
        router.push(`/payments/${paymentId}`);
      } else {
        router.push("/payments");
      }
    } catch (error: any) {
      console.error(error);
      showToast(error.response?.data?.message || "Ocurrió un error al registrar los pagos", "error");
    } finally {
      setLoadingGuardar(false);
    }
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
