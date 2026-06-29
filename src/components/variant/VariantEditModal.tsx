"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WarehouseDetail {
  id: string;
  warehouse: string;
  initialQty: string;
  minQty: string;
  maxQty: string;
}

interface VariantEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variantName: string;
  initialData?: {
    active: boolean;
    inventory: WarehouseDetail[];
  };
  onSave: (data: { active: boolean; inventory: WarehouseDetail[] }) => void;
}

export function VariantEditModal({
  open,
  onOpenChange,
  variantName,
  initialData,
  onSave,
}: VariantEditModalProps) {
  const [active, setActive] = React.useState(initialData?.active ?? true);
  const [inventory, setInventory] = React.useState<WarehouseDetail[]>(
    initialData?.inventory || [
      { id: "1", warehouse: "Principal", initialQty: "", minQty: "", maxQty: "" },
    ]
  );

  React.useEffect(() => {
    if (open) {
      setErrors({});
      if (initialData) {
        setActive(initialData.active);
        setInventory(initialData.inventory.length > 0 ? initialData.inventory : [
          { id: "1", warehouse: "Principal", initialQty: "", minQty: "", maxQty: "" },
        ]);
      } else {
        setActive(true);
        setInventory([
          { id: "1", warehouse: "Principal", initialQty: "", minQty: "", maxQty: "" },
        ]);
      }
    }
  }, [open, initialData]);

  const handleAddWarehouse = () => {
    setInventory([
      ...inventory,
      { id: Date.now().toString(), warehouse: "", initialQty: "", minQty: "", maxQty: "" },
    ]);
  };

  const handleRemoveWarehouse = (id: string) => {
    if (inventory.length > 1) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  const [errors, setErrors] = React.useState<Record<string, boolean>>({});

  const handleUpdateWarehouse = (id: string, field: keyof WarehouseDetail, value: string) => {
    let finalValue = value;
    if (field === "initialQty" || field === "minQty" || field === "maxQty") {
      finalValue = value.replace(/[^0-9.]/g, "");
    }
    
    setInventory(
      inventory.map((item) => (item.id === id ? { ...item, [field]: finalValue } : item))
    );
    
    if (finalValue) {
      setErrors(prev => ({ ...prev, [`${id}-${field}`]: false }));
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    let hasError = false;
    
    inventory.forEach(item => {
      if (!item.initialQty) {
        newErrors[`${item.id}-initialQty`] = true;
        hasError = true;
      }
      if (!item.warehouse) {
        newErrors[`${item.id}-warehouse`] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    onSave({ active, inventory });
  };

  const baseInput =
    "bg-white h-[34px] px-3 text-sm border border-foreground/20 rounded-xl shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none w-full";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[540px] p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/40 bg-white flex items-center justify-between">
          <DialogTitle className="text-base font-bold text-[#123159] uppercase">
            {variantName}
          </DialogTitle>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Inventory Detail Header */}
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-bold text-[#123159]">Detalle de inventario</h3>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#64748b]">Activo</span>
              <Switch
                checked={active}
                onCheckedChange={setActive}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          {/* List Container */}
          <div className="border border-border/60 rounded-xl overflow-hidden bg-white">
            <div className="flex items-center px-4 py-2 border-b border-border/60 bg-[#f8fafc]">
              <div className="flex-1 text-[11px] font-bold text-[#64748b] uppercase tracking-widest">
                Bodega
              </div>
              <div className="w-[1px] h-4 bg-border/60 mx-4" />
              <div className="w-8" />
            </div>

            <div className="divide-y divide-border/60">
              {inventory.map((item) => (
                <div key={item.id} className="p-4 flex flex-col gap-4">
                  <div className="flex items-end gap-4">
                    <div className="flex-1 flex flex-col">
                      <label className="text-sm font-bold text-[#123159] mb-1.5 block">
                        Bodega <span className="text-primary">*</span>
                      </label>
                      <select
                        value={item.warehouse}
                        onChange={(e) => handleUpdateWarehouse(item.id, "warehouse", e.target.value)}
                        className={cn(baseInput, "appearance-none cursor-pointer", errors[`${item.id}-warehouse`] && "border-destructive ring-1 ring-destructive/20 text-destructive")}
                      >
                        <option value="" disabled hidden>Seleccionar bodega...</option>
                        <option value="Principal">Principal</option>
                        <option value="Secundaria">Secundaria</option>
                      </select>
                      {errors[`${item.id}-warehouse`] && (
                        <span className="text-[11px] text-destructive mt-1 leading-tight">Este campo es obligatorio</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveWarehouse(item.id)}
                      disabled={inventory.length <= 1}
                      className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-lg transition-colors group mb-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-[#123159] mb-1.5 block">
                        Cantidad inicial <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={item.initialQty}
                          onChange={(e) => handleUpdateWarehouse(item.id, "initialQty", e.target.value)}
                          className={cn(baseInput, errors[`${item.id}-initialQty`] && "border-destructive ring-1 ring-destructive/20 pr-8 text-destructive")}
                        />
                        {errors[`${item.id}-initialQty`] && (
                          <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                        )}
                      </div>
                      {errors[`${item.id}-initialQty`] && (
                        <span className="text-[11px] text-destructive mt-1 leading-tight">Este campo es obligatorio</span>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#123159] mb-1.5 block">
                        Mínima
                      </label>
                      <input
                        type="text"
                        value={item.minQty}
                        onChange={(e) => handleUpdateWarehouse(item.id, "minQty", e.target.value)}
                        className={baseInput}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#123159] mb-1.5 block">
                        Máxima
                      </label>
                      <input
                        type="text"
                        value={item.maxQty}
                        onChange={(e) => handleUpdateWarehouse(item.id, "maxQty", e.target.value)}
                        className={baseInput}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddWarehouse}
            className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-80 transition-all ml-2"
          >
            <Plus className="w-4 h-4" />
            Agregar bodega
          </button>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-white flex items-center justify-start gap-3 rounded-b-2xl">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 bg-white border border-border hover:bg-background text-[#123159] text-sm font-bold rounded-xl transition-all shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl transition-all shadow-md active:scale-95"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
