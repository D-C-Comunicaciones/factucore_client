"use client";

import * as React from "react";
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

interface PriceListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; description: string; type: "Valor" | "Porcentaje" }) => void;
}

export function PriceListModal({ open, onOpenChange, onSave }: PriceListModalProps) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [type, setType] = React.useState<"Valor" | "Porcentaje">("Valor");

  const baseInput = "bg-white h-[34px] px-3 text-sm border border-foreground/20 shadow-none text-foreground transition-all focus:border-[#2ab1a6] focus:ring-1 focus:ring-[#2ab1a6]/40 outline-none flex items-center w-full rounded-xl box-border";

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, description, type });
    setName("");
    setDescription("");
    setType("Valor");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] p-0 rounded-2xl bg-white border-none shadow-2xl overflow-hidden">
        <DialogHeader className="px-6 py-3 border-b border-border/40">
          <DialogTitle className="text-base font-bold text-[#123159]">Nueva lista de precios</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159] flex items-center gap-0.5 h-5">
                Nombre <span className="text-[#2ab1a6]">*</span>
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
              <label className="text-sm font-semibold text-[#123159] flex items-center gap-0.5 h-5">Descripción</label>
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
              <label className="text-sm font-semibold text-[#123159] flex items-center gap-0.5 h-5">
                Tipo <span className="text-[#2ab1a6]">*</span>
              </label>
              <Select value={type} onValueChange={(val: any) => setType(val)}>
                <SelectTrigger className={baseInput}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border rounded-xl shadow-xl p-1">
                  <SelectItem value="Valor" className="rounded-lg cursor-pointer transition-colors hover:bg-[#2ab1a6]/10 hover:text-[#2ab1a6] focus:bg-[#2ab1a6]/10 focus:text-[#2ab1a6]">Valor</SelectItem>
                  <SelectItem value="Porcentaje" className="rounded-lg cursor-pointer transition-colors hover:bg-[#2ab1a6]/10 hover:text-[#2ab1a6] focus:bg-[#2ab1a6]/10 focus:text-[#2ab1a6]">Porcentaje</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-3 border-t border-border/40 flex items-center justify-end bg-slate-50/30 rounded-b-2xl gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-1.5 bg-white border border-border hover:bg-muted text-[#123159] text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-8 py-1.5 text-sm font-bold rounded-xl bg-[#2ab1a6] text-white hover:bg-[#23968c] transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
