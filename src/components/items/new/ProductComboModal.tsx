"use client";

import * as React from "react";
import { X, Search, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AsyncSearchableSelect } from "@/components/ui/async-searchable-select";
import { cn } from "@/lib/utils";
import { useItems } from "@/hooks/items/useItems";

interface ProductComboModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ComboProductData) => void;
  initialData?: ComboProductData;
  existingProducts?: string[];
  catalogs?: any;
}

export interface ComboProductData {
  id?: string;
  product_id?: string;
  variant_id?: string;
  product: string;
  quantity: string;
  unit: string;
  cost: string;
}

export function ProductComboModal({ open, onOpenChange, onSave, initialData, existingProducts = [], catalogs }: ProductComboModalProps) {
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

  // Ítems reales del sistema, con búsqueda
  const [search, setSearch] = React.useState("");
  const { data: itemsData, isLoading: isLoadingItems } = useItems({ params: { search } });

  const products = (itemsData?.data || []).map((item: any) => ({
    id: String(item.id),
    name: item.reference ? `${item.reference} - ${item.name}` : item.name,
    unit: item.unit_measure?.name || "Unidad",
    cost: (item.pricing?.default_cost_price ?? item.default_cost_price ?? item.price ?? "0").toString(),
    variant_id: undefined
  }));

  const visibleProducts = products.filter((p: any) => !existingProducts.includes(p.name) || p.name === initialData?.product);

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
              <AsyncSearchableSelect
                value={data.product_id}
                onValueChange={(v) => {
                  const p = products.find((prod: any) => prod.id === v);
                  setData({
                    ...data,
                    product: p?.name || "",
                    product_id: p?.id,
                    variant_id: p?.variant_id,
                    unit: p?.unit || "",
                    cost: p?.cost || ""
                  });
                  setErrorProduct(false);
                }}
                options={visibleProducts.map((p: any) => ({ value: p.id, label: p.name }))}
                loading={isLoadingItems}
                onSearchChange={setSearch}
                placeholder="Buscar producto facturable"
                searchPlaceholder="Buscar producto o servicio..."
                emptyMessage={isLoadingItems ? "Buscando..." : "No se encontraron ítems."}
                className={cn(baseInput, "w-full", errorProduct && "border-destructive focus:border-destructive focus:ring-destructive/20")}
              />
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
