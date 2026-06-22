"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { priceListsApi } from "@/lib/priceLists";
import { invalidateCatalog, useCatalogs } from "@/hooks/useCatalogs";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

interface NewPriceListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { id?: number | string; name: string; description?: string; type_price_list_id: number | string; percentage?: number }) => void;
}

export function NewPriceListModal({ open, onOpenChange, onSave }: NewPriceListModalProps) {
  const { typePriceLists = [] } = useCatalogs();

  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [typeId, setTypeId] = React.useState<string>("");
  const [percentage, setPercentage] = React.useState<string>("");
  const [isSaving, setIsSaving] = React.useState(false);

  const baseInput = "bg-white h-[34px] px-3 text-sm border border-foreground/20 shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

  const selectedType = typePriceLists.find((t: any) => String(t.id) === typeId);
  // Asumimos que es porcentual si su código o nombre lo indica, o si es is_derived
  // Para estar seguros, basamos en el nombre o código
  const isPercentage = selectedType && (selectedType.code === 'percentage' || selectedType.name?.toLowerCase().includes('porcent'));

  const handleSave = async () => {
    if (!name.trim() || !typeId) return;

    setIsSaving(true);
    try {
      const payload: any = {
        name: name.trim(),
        type_price_list_id: typeId,
      };

      if (description.trim()) {
        payload.description = description.trim();
      }

      if (isPercentage && percentage !== "") {
        payload.percentage = parseFloat(percentage);
      }

      const response = await priceListsApi.createPriceList(payload);
      
      const created = response?.data?.price_list || response?.data || payload;

      // Invalida la caché de listas de precios y espera
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.priceLists() });

      onSave(created);
      
      setName("");
      setDescription("");
      setTypeId("");
      setPercentage("");
      onOpenChange(false);
    } catch {
      showToast("Ocurrió un error al crear la lista de precios. Intenta de nuevo.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!isSaving) onOpenChange(v); }}>
      <DialogContent className="max-w-[500px] p-0 rounded-2xl bg-white border-none shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 py-3 border-b border-border/40">
          <DialogTitle className="text-base font-bold text-foreground">Nueva lista de precios</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-0.5 h-5">
                Nombre <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={baseInput}
                placeholder="Ej: Mayorista"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-0.5 h-5">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(baseInput, "h-[60px] py-2 resize-none")}
                placeholder="Opcional..."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground flex items-center gap-0.5 h-5">
                Tipo <span className="text-primary">*</span>
              </label>
              <Select value={typeId} onValueChange={(val: string) => setTypeId(val)}>
                <SelectTrigger className={baseInput}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border rounded-xl shadow-xl p-1">
                  {typePriceLists.map((t: any) => (
                    <SelectItem 
                      key={t.id} 
                      value={String(t.id)} 
                      className="rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isPercentage && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground flex items-center gap-0.5 h-5">
                  Porcentaje <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                    className={cn(baseInput, "pr-8")}
                    placeholder="0"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-medium">%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t border-border/40 flex items-center justify-end bg-slate-50/30 rounded-b-2xl gap-3">
          <button
            type="button"
            disabled={isSaving}
            onClick={() => onOpenChange(false)}
            className="px-5 py-1.5 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim() || !typeId || isSaving || (isPercentage && !percentage)}
            className="px-8 py-1.5 text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
