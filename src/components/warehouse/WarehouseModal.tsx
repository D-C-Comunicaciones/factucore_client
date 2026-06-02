"use client";

import * as React from "react";
import { X, Plus, Package, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { NewWarehouseModal } from "./NewWarehouseModal";
import { warehousesApi } from "@/lib/warehouses";
import { queryClient } from "@/lib/queryClient";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { showToast } from "@/components/sonner/CustomToaster";

interface WarehouseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: WarehouseData) => void;
  initialData?: WarehouseData;
  existingWarehouses?: string[];
  catalogs?: any;
}

export interface WarehouseData {
  warehouse: string;
  initialQty: string;
  minQty: string;
  maxQty: string;
}

export function WarehouseModal({ open, onOpenChange, onSave, initialData, existingWarehouses = [], catalogs }: WarehouseModalProps) {
  const [data, setData] = React.useState<WarehouseData>({
    warehouse: "",
    initialQty: "",
    minQty: "",
    maxQty: "",
  });

  const [errorWarehouse, setErrorWarehouse] = React.useState(false);
  const [errorQty, setErrorQty] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [extraOptions, setExtraOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (open) {
      setData(initialData || {
        warehouse: "",
        initialQty: "",
        minQty: "",
        maxQty: "",
      });
      setErrorWarehouse(false);
      setErrorQty(false);
    }
  }, [open, initialData]);

  const baseInput =
    "bg-white h-8 px-3 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const catalogOptions = catalogs?.warehouses?.map((w: any) => w.name) || ["Principal", "Secundaria"];
  const allOptions = Array.from(new Set([...catalogOptions, ...extraOptions, data.warehouse])).filter(Boolean);
  const visibleOptions = allOptions.filter(opt => !existingWarehouses.includes(opt) || opt === data.warehouse);

  const handleSave = () => {
    let hasError = false;

    if (!data.warehouse) {
      setErrorWarehouse(true);
      hasError = true;
    } else {
      setErrorWarehouse(false);
    }

    if (!data.initialQty.trim()) {
      setErrorQty(true);
      hasError = true;
    } else {
      setErrorQty(false);
    }

    if (hasError) return;

    onSave(data);
  };

  return (
    <>
      <Dialog open={open && !isCreating} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
            <DialogTitle className="text-base font-bold text-primary">Seleccionar bodega</DialogTitle>
          </div>

          <div className="p-6 space-y-6">
            {/* Warehouse Select */}
            <div>
              <label className="text-sm font-bold text-foreground mb-2 block">
                Bodega <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <Select
                  value={data.warehouse}
                  onValueChange={(v) => {
                    setData({ ...data, warehouse: v });
                    if (v) setErrorWarehouse(false);
                  }}
                >
                  <SelectTrigger size="sm" className={cn(baseInput, "w-full", errorWarehouse && "border-destructive focus:border-destructive focus:ring-destructive/20")}>
                    <SelectValue placeholder="Seleccionar bodega" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
                    {visibleOptions.map(opt => (
                      <SelectItem key={opt} value={opt} className="cursor-pointer hover:bg-primary/5 transition-colors focus:bg-primary/5">
                        {opt}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsCreating(true);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                      Nueva bodega
                    </button>
                  </SelectContent>
                </Select>
                {errorWarehouse && (
                  <AlertCircle className="w-4 h-4 text-destructive absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
                )}
              </div>
              {errorWarehouse && (
                <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
              )}
            </div>

            {/* Quantities Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-foreground mb-2 block truncate">
                  Cantidad inicial <span className="text-primary">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className={cn(
                      baseInput,
                      "w-full text-center pr-8",
                      errorQty && "border-destructive focus:border-destructive focus:ring-destructive/20"
                    )}
                    value={data.initialQty}
                    onChange={(e) => {
                      setData({ ...data, initialQty: e.target.value });
                      if (e.target.value.trim()) setErrorQty(false);
                    }}
                  />
                  {errorQty && (
                    <AlertCircle className="w-4 h-4 text-destructive absolute right-2 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errorQty && (
                  <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-2 block truncate">
                  Cantidad mínima
                </label>
                <input
                  type="text"
                  className={cn(baseInput, "w-full text-center")}
                  value={data.minQty}
                  onChange={(e) => setData({ ...data, minQty: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-foreground mb-2 block truncate">
                  Cantidad máxima
                </label>
                <input
                  type="text"
                  className={cn(baseInput, "w-full text-center")}
                  value={data.maxQty}
                  onChange={(e) => setData({ ...data, maxQty: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-start rounded-b-2xl">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20"
            >
              Guardar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <NewWarehouseModal
        open={isCreating}
        onOpenChange={(v) => {
          if (!v) setIsCreating(false);
        }}
        onCancel={() => setIsCreating(false)}
        onSave={async (newWarehouseData) => {
          try {
            await warehousesApi.createWarehouse(newWarehouseData);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });
            setExtraOptions(prev => [...prev, newWarehouseData.name]);
            setData({ ...data, warehouse: newWarehouseData.name });
            setErrorWarehouse(false);
            setIsCreating(false);
            showToast(`La bodega "${newWarehouseData.name}" fue creada exitosamente.`, "success");
          } catch (error) {
            showToast("Ocurrió un error al crear la bodega. Intenta de nuevo.", "error");
          }
        }}
      />
    </>
  );
}
