import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useCatalogs } from "@/hooks/useCatalogs";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { InvoiceSummary } from "@/types/invoice";
import { showToast } from "@/components/sonner/CustomToaster";

export interface WithholdingEntry {
  withholding_rate_id: number;
  base: number;
  amount: number;
}

interface WithholdingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: InvoiceSummary | null;
  initialWithholdings: WithholdingEntry[];
  onSave: (withholdings: WithholdingEntry[]) => void;
}

export function WithholdingsModal({ isOpen, onClose, invoice, initialWithholdings, onSave }: WithholdingsModalProps) {
  const catalogs = useCatalogs();
  const [withholdings, setWithholdings] = useState<WithholdingEntry[]>([]);

  useEffect(() => {
    if (isOpen) {
      setWithholdings(initialWithholdings.length > 0 ? [...initialWithholdings] : []);
    }
  }, [isOpen, initialWithholdings]);

  const withholdingOptions = catalogs.withholdingRates?.map((w: any) => ({
    value: w.id.toString(),
    label: `${w.name} (${w.code}%)`
  })) || [];

  const handleAddWithholding = () => {
    setWithholdings([...withholdings, { withholding_rate_id: 0, base: Number(invoice?.pending_amount || 0), amount: 0 }]);
  };

  const handleRemoveWithholding = (index: number) => {
    const newWithholdings = [...withholdings];
    newWithholdings.splice(index, 1);
    setWithholdings(newWithholdings);
  };

  const handleChange = (index: number, field: keyof WithholdingEntry, value: string | number) => {
    const newWithholdings = [...withholdings];
    newWithholdings[index] = { ...newWithholdings[index], [field]: Number(value) || 0 };

    if (field === "withholding_rate_id" || field === "base") {
      const rateId = field === "withholding_rate_id" ? Number(value) : newWithholdings[index].withholding_rate_id;
      let base = field === "base" ? Number(value) : newWithholdings[index].base;
      const rateData = catalogs.withholdingRates?.find((r: any) => r.id === rateId);
      
      if (rateData) {
        const isReteIva = rateData.name?.toLowerCase().includes("iva");

        if (field === "withholding_rate_id" && isReteIva) {
          const totalIva = invoice?.total_iva || 0;
          if (totalIva <= 0) {
            showToast("No se puede aplicar retención de IVA a una operación comercial gravada sin IVA.", "error");
            newWithholdings[index].withholding_rate_id = 0;
            newWithholdings[index].base = Number(invoice?.pending_amount || 0);
            newWithholdings[index].amount = 0;
            setWithholdings(newWithholdings);
            return;
          } else {
            base = totalIva;
            newWithholdings[index].base = base;
          }
        }

        newWithholdings[index].amount = Math.round(base * (Number(rateData.code) / 100));
      }
    }

    setWithholdings(newWithholdings);
  };

  const handleSave = () => {
    // Filter out incomplete rows
    const validWithholdings = withholdings.filter(w => w.withholding_rate_id > 0 && w.amount > 0);
    onSave(validWithholdings);
    onClose();
  };

  if (!invoice) return null;

  const isValid = withholdings.length > 0 && withholdings.every(w => w.withholding_rate_id > 0 && w.amount > 0);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] w-[90vw] md:w-[800px] p-0 gap-0 overflow-hidden bg-white" aria-describedby={undefined}>
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-white">
          <DialogTitle className="text-lg font-bold text-slate-800">Retenciones aplicadas</DialogTitle>
        </DialogHeader>

        <div className="p-6 bg-white">
          <div className="flex items-center gap-8 mb-6">
            <span className="text-sm font-semibold text-slate-700">Número de factura: <span className="font-normal">{invoice.number}</span></span>
            <span className="text-sm font-semibold text-slate-700">Monto pendiente: <span className="font-normal">$ {Number(invoice.pending_amount || 0).toLocaleString('es-CO')}</span></span>
          </div>

          <div className="space-y-4">
            {withholdings.map((w, i) => (
              <div key={i} className="flex items-end gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tipo de retención <span className="text-primary">*</span></label>
                  <SearchableSelect
                    value={w.withholding_rate_id > 0 ? w.withholding_rate_id.toString() : ""}
                    onValueChange={(val) => handleChange(i, "withholding_rate_id", val)}
                    options={withholdingOptions}
                    placeholder="Seleccionar"
                  />
                </div>
                <div className="w-[150px] space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Base</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-9 pl-7 pr-3 text-sm rounded-md border border-gray-300 bg-slate-50 text-slate-500 cursor-not-allowed focus-visible:outline-none"
                      value={w.base ? w.base.toLocaleString('es-CO') : ''}
                    />
                  </div>
                </div>
                <div className="w-[150px] space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Valor retenido <span className="text-primary">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="text"
                      readOnly
                      className="w-full h-9 pl-7 pr-3 text-sm rounded-md border border-gray-300 bg-slate-50 text-slate-500 cursor-not-allowed focus-visible:outline-none"
                      value={w.amount ? w.amount.toLocaleString('es-CO') : ''}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="h-9 w-9 flex items-center justify-center rounded-md text-black hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => handleRemoveWithholding(i)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 flex items-center gap-2 text-primary border border-primary px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary/5 transition-colors"
            onClick={handleAddWithholding}
          >
            <Plus className="w-4 h-4" /> Agregar otra retención
          </button>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-gray-100 bg-white flex justify-between items-center sm:justify-between">
          <span className="text-sm text-slate-400">Los campos marcados con <span className="text-primary">*</span> son obligatorios</span>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-lg bg-white text-slate-800 border border-gray-300 hover:bg-gray-100 font-medium cursor-pointer">Cancelar</Button>
            <Button onClick={handleSave} disabled={!isValid} className={cn("rounded-lg text-white font-medium", isValid ? "bg-primary hover:bg-primary/90 cursor-pointer" : "bg-primary/50 cursor-not-allowed")}>Guardar</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
