"use client";

import * as React from "react";
import { X, Search, AlertCircle } from "lucide-react";
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
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ProductComboModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ComboProductData) => void;
  initialData?: ComboProductData;
  existingProducts?: string[];
}

export interface ComboProductData {
  product: string;
  quantity: string;
  unit: string;
  cost: string;
}

export function ProductComboModal({ open, onOpenChange, onSave, initialData, existingProducts = [] }: ProductComboModalProps) {
  const [data, setData] = React.useState<ComboProductData>({
    product: "",
    quantity: "",
    unit: "",
    cost: "",
  });

  const [errorProduct, setErrorProduct] = React.useState(false);
  const [errorQty, setErrorQty] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setData(initialData || {
        product: "",
        quantity: "",
        unit: "",
        cost: "",
      });
      setErrorProduct(false);
      setErrorQty(false);
    }
  }, [open, initialData]);

  const baseInput =
    "bg-white h-8 px-3 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const products = [
    { name: "Prueba", unit: "Unidad", cost: "100.000" },
    { name: "Servicio técnico", unit: "Servicio", cost: "50.000" },
    { name: "Producto A", unit: "Unidad", cost: "15.000" },
    { name: "Producto B", unit: "Unidad", cost: "25.000" },
  ];

  const visibleProducts = products.filter(p => !existingProducts.includes(p.name) || p.name === initialData?.product);

  const handleSave = () => {
    let hasError = false;

    if (!data.product) {
      setErrorProduct(true);
      hasError = true;
    }
    if (!data.quantity.trim()) {
      setErrorQty(true);
      hasError = true;
    }

    if (hasError) return;
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <DialogTitle className="text-base font-bold text-primary">Seleccionar producto</DialogTitle>
        </div>

        <div className="p-6 space-y-6">
          {/* Product Select */}
          <div>
            <label className="text-sm font-bold text-foreground mb-2 block">
              Producto <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <Select
                value={data.product}
                onValueChange={(v) => {
                  const p = products.find(prod => prod.name === v);
                  setData({ 
                    ...data, 
                    product: v,
                    unit: p?.unit || "",
                    cost: p?.cost || ""
                  });
                  setErrorProduct(false);
                }}
              >
                <SelectTrigger className={cn(baseInput, "w-full", errorProduct && "border-destructive focus:border-destructive focus:ring-destructive/20")}>
                  <SelectValue placeholder="Buscar producto facturable" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
                  {visibleProducts.map(p => (
                    <SelectItem key={p.name} value={p.name} className="cursor-pointer hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errorProduct && (
              <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
            )}
          </div>

          {/* Grid: Qty, Unit, Cost */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-foreground mb-2 block truncate">
                Cantidad <span className="text-primary">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  className={cn(
                    baseInput, 
                    "w-full text-center pr-8", 
                    errorQty && "border-destructive focus:border-destructive focus:ring-destructive/20"
                  )}
                  value={data.quantity}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    setData({ ...data, quantity: val });
                    if (val) setErrorQty(false);
                  }}
                  placeholder="0"
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
              <label className="text-xs font-bold text-muted-foreground/60 mb-2 block truncate">
                Unidad de medida
              </label>
              <input
                readOnly
                disabled
                type="text"
                className={cn(baseInput, "w-full text-center bg-[#f8fafc] border-foreground/10 text-muted-foreground cursor-not-allowed")}
                value={data.unit}
                placeholder="Unidad"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground/60 mb-2 block truncate">
                Costo
              </label>
              <input
                readOnly
                disabled
                type="text"
                className={cn(baseInput, "w-full text-center bg-[#f8fafc] border-foreground/10 text-muted-foreground cursor-not-allowed")}
                value={data.cost ? `$ ${data.cost}` : ""}
                placeholder="$ 0.000"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex justify-start rounded-b-2xl">
          <button
            onClick={handleSave}
            className="px-8 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
