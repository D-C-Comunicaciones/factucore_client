"use client";

import * as React from "react";
import { X, Plus, AlertCircle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { showToast } from "../sonner/CustomToaster";

interface AttributeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string, attributes: string[]) => void;
}

export function AttributeModal({ open, onOpenChange, onSave }: AttributeModalProps) {
  const [name, setName] = React.useState("");
  const [attributes, setAttributes] = React.useState<string[]>([""]);
  const [errors, setErrors] = React.useState<{ name: boolean; attributes: boolean[] }>({
    name: false,
    attributes: [false],
  });

  React.useEffect(() => {
    if (open) {
      setName("");
      setAttributes([""]);
      setErrors({ name: false, attributes: [false] });
    }
  }, [open]);

  const baseInput =
    "bg-white h-[34px] px-3 text-sm border border-foreground/20 rounded-xl shadow-none text-foreground transition-all focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 outline-none w-full";

  const handleAddAttribute = () => {
    if (attributes[attributes.length - 1].trim()) {
      setAttributes([...attributes, ""]);
      setErrors(prev => ({ ...prev, attributes: [...prev.attributes, false] }));
    }
  };

  const handleRemoveAttribute = (idx: number) => {
    if (attributes.length > 1) {
      const newAttrs = attributes.filter((_, i) => i !== idx);
      const newErrors = errors.attributes.filter((_, i) => i !== idx);
      setAttributes(newAttrs);
      setErrors(prev => ({ ...prev, attributes: newErrors }));
    } else {
      // Si es el único, solo limpiarlo
      setAttributes([""]);
      setErrors(prev => ({ ...prev, attributes: [false] }));
    }
  };

  const handleAttributeChange = (idx: number, val: string) => {
    const newAttrs = [...attributes];
    newAttrs[idx] = val;
    setAttributes(newAttrs);

    const newErrors = [...errors.attributes];
    if (val.trim()) newErrors[idx] = false;
    setErrors(prev => ({ ...prev, attributes: newErrors }));
  };

  const handleSave = () => {
    let hasError = false;
    const newErrors = {
      name: !name.trim(),
      attributes: attributes.map(attr => !attr.trim()),
    };

    if (newErrors.name || newErrors.attributes.some(e => e)) {
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      showToast("Debes verificar los campos marcados en rojo para continuar", "error");
      return;
    }

    onSave(name, attributes);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[460px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-white">
          <DialogTitle className="text-base font-bold text-[#123159]">Nueva variante</DialogTitle>
        </div>

        <div className="px-14 py-8 space-y-7">
          <p className="text-[15px] font-medium text-[#475569] leading-relaxed pr-4">
            Agrega el nombre de la variante e indica las diferentes opciones que puede tener.
          </p>

          {/* Nombre Field */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#123159]">
              Nombre <span className="text-[#2563eb]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder=""
                className={cn(
                  baseInput,
                  errors.name && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10"
                )}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (e.target.value.trim()) setErrors(prev => ({ ...prev, name: false }));
                }}
              />
              {errors.name && (
                <AlertCircle className="w-4 h-4 text-[#ef4444] absolute right-3 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {errors.name && (
              <p className="text-[11px] text-[#ef4444] font-medium">El nombre es requerido.</p>
            )}
          </div>

          {/* Atributos Section */}
          <div className="space-y-4 pt-1">
            <div className="space-y-1">
              <label className="text-sm font-bold text-[#123159]">Atributos</label>
              <p className="text-[13px] font-medium text-[#64748b]">Crea cualidades para clasificar tus productos.</p>
            </div>

            <div className="space-y-3.5">
              {attributes.map((attr, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder={`Atributo ${idx + 1}`}
                        className={cn(
                          baseInput,
                          errors.attributes[idx] && "border-[#ef4444] focus:border-[#ef4444] focus:ring-[#ef4444]/10"
                        )}
                        value={attr}
                        onChange={(e) => handleAttributeChange(idx, e.target.value)}
                      />
                      {errors.attributes[idx] && (
                        <AlertCircle className="w-4 h-4 text-[#ef4444] absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(idx)}
                        className="p-2 hover:bg-muted rounded-xl transition-colors shrink-0 group"
                      >
                        <Trash2 className="w-4 h-4 text-[#123159]/40 transition-colors" />
                      </button>
                    )}
                  </div>
                  {errors.attributes[idx] && (
                    <p className="text-[11px] text-[#ef4444] font-medium">Requerido</p>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddAttribute}
                disabled={!attributes[attributes.length - 1].trim()}
                className={cn(
                  "flex items-center gap-2 text-[13px] font-bold py-2 px-1 transition-all",
                  attributes[attributes.length - 1].trim()
                    ? "text-[#2563eb] hover:opacity-80 cursor-pointer"
                    : "text-[#2563eb]/30 cursor-not-allowed"
                )}
              >
                <Plus className="w-4 h-4" />
                Agregar atributo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex items-center justify-start gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
