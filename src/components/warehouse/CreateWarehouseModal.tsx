"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface CreateWarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { name: string; address: string; observations: string }) => void;
  onCancel: () => void;
}

export function CreateWarehouseModal({ open, onOpenChange, onSave, onCancel }: CreateWarehouseModalProps) {
  const [name, setName] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [observations, setObservations] = React.useState("");
  const [error, setError] = React.useState(false);

  const baseInput =
    "w-full bg-white px-3 py-2 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const handleSave = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSave({ name, address, observations });
    // Reset form
    setName("");
    setAddress("");
    setObservations("");
  };

  const handleCancel = () => {
    // Reset form
    setName("");
    setAddress("");
    setObservations("");
    setError(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <DialogTitle className="text-base font-bold text-[#123159]">Nueva bodega</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-[#475569] mb-1.5 block">
              Nombre <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre de la bodega"
                className={cn(baseInput, "h-8 pr-8", error && "border-destructive focus:border-destructive focus:ring-destructive/20")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setError(false);
                }}
              />
              {error && (
                <AlertCircle className="w-4 h-4 text-destructive absolute right-2 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {error && (
              <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-[#475569] mb-1.5 block">
              Dirección
            </label>
            <input
              type="text"
              placeholder="Dirección de la bodega"
              className={cn(baseInput, "h-8")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-bold text-[#475569] mb-1.5 block">
              Observaciones
            </label>
            <textarea
              rows={3}
              className={cn(baseInput, "resize-none")}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-end gap-3 rounded-b-2xl">
          <button
            onClick={handleCancel}
            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-sm shadow-primary/20"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
