"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { showToast } from "@/components/sonner/CustomToaster";
import { Button } from "@/components/ui/button";

interface CostCenter {
  id: number;
  name: string;
  code: string;
  description: string;
  status?: number | boolean;
}

interface NewCostCenterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { id?: number; name: string; code: string; description: string }, createNew?: boolean) => void;
  onCancel: () => void;
  costCenterToEdit?: CostCenter | null;
}

export function NewCostCenterModal({ open, onOpenChange, onSave, onCancel, costCenterToEdit }: NewCostCenterModalProps) {
  const [name, setName] = React.useState("");
  const [code, setCode] = React.useState("");
  const [description, setDescription] = React.useState("");

  const [nameError, setNameError] = React.useState(false);
  const [codeError, setCodeError] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      if (costCenterToEdit) {
        setName(costCenterToEdit.name || "");
        setCode(costCenterToEdit.code || "");
        setDescription(costCenterToEdit.description || "");
      } else {
        setName("");
        setCode("");
        setDescription("");
      }
      setNameError(false);
      setCodeError(false);
    }
  }, [open, costCenterToEdit]);

  const baseInput =
    "w-full bg-white px-3 py-2 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const handleSave = async (createNew: boolean = false) => {
    let hasError = false;
    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    } else {
      setNameError(false);
    }
    if (!code.trim()) {
      setCodeError(true);
      hasError = true;
    } else {
      setCodeError(false);
    }

    if (hasError) {
      showToast("Debes completar los campos obligatorios", "error");
      return;
    }

    try {
      await onSave({
        id: costCenterToEdit?.id,
        name: name.trim(),
        code: code.trim(),
        description: description.trim()
      }, createNew);

      if (createNew) {
        setName("");
        setCode("");
        setDescription("");
      }
    } catch (e) {
      // Error handled by parent
    }
  };

  const resetForm = () => {
    setName("");
    setCode("");
    setDescription("");
    setNameError(false);
    setCodeError(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const isEditing = !!costCenterToEdit;

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) resetForm();
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-3xl sm:max-w-3xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border bg-white">
          <DialogTitle className="text-base font-bold text-foreground">
            {isEditing ? "Editar centro de costo" : "Nuevo centro de costo"}
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {!isEditing && (
            <p className="text-sm text-foreground">
              Crea nuevos centros de costos para distribuir tus ingresos y gastos.
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Nombre <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                className={cn(baseInput, nameError && "border-destructive focus:border-destructive focus:ring-destructive/40")}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (nameError) setNameError(false);
                }}
              />
              {nameError && <p className="text-xs text-destructive mt-1">Este campo es obligatorio</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Código <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                className={cn(baseInput, codeError && "border-destructive focus:border-destructive focus:ring-destructive/40")}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (codeError) setCodeError(false);
                }}
              />
              {codeError && <p className="text-xs text-destructive mt-1">Este campo es obligatorio</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Descripción
            </label>
            <textarea
              className={cn(baseInput, "resize-none h-24")}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 flex items-center justify-between border-t border-border bg-white">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Los campos marcados con <span className="text-primary">*</span> son obligatorios
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="h-9 px-4 border border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-none cursor-pointer"
            >
              Cancelar
            </Button>
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => handleSave(true)}
                className="h-9 px-4 border border-slate-200 text-slate-700 bg-slate-100 hover:bg-slate-200 shadow-none cursor-pointer"
              >
                Guardar y crear nuevo
              </Button>
            )}
            <Button
              onClick={() => handleSave(false)}
              className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-none cursor-pointer"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
