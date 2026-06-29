"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PaymentTermsService } from "@/lib/payment-terms";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

interface NewPaymentTermModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => void;
}

export function NewPaymentTermModal({ open, onOpenChange, onSave }: NewPaymentTermModalProps) {
  const [name, setName] = React.useState("");
  const [days, setDays] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  const baseInput = "bg-white h-[34px] px-3 text-sm border border-foreground/20 shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

  const handleSave = async () => {
    if (!name.trim() || !days) return;

    setIsSaving(true);
    try {
      const payload: any = {
        name: name.trim(),
        days: parseInt(days, 10),
      };

      const response = await PaymentTermsService.create(payload);

      const created = response?.data?.payment_term || response?.data || payload;

      // Invalida la caché de términos de pago y espera
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.paymentTerms() });

      const message = response?.message || "Término de pago creado exitosamente";
      showToast(message, "success");

      onSave(created);

      setName("");
      setDays("");
      onOpenChange(false);
    } catch {
      showToast("Ocurrió un error al crear el término de pago. Intenta de nuevo.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isSaving) onOpenChange(v); }}>
      <DialogContent className="max-w-[400px] p-0 rounded-2xl bg-white border-none shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-border/40">
          <DialogTitle className="text-base font-bold text-foreground">Agregar nuevo término de pago</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground flex items-center gap-0.5">
              Nombre <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={baseInput}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground flex items-center gap-0.5">
              Días <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              value={days}
              onChange={(e) => setDays(e.target.value.replace(/\D/g, ""))}
              className={baseInput}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/40 flex items-center justify-end bg-slate-50/30 rounded-b-2xl gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !days || isSaving}
            className="px-6 py-2 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar"
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
