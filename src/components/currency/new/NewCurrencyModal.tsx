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
import { SearchableSelect } from "@/components/ui/searchable-select";

interface CreateCurrencyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { code: string; name: string; exchange_rate: string }) => void;
  onCancel: () => void;
}

export function NewCurrencyModal({ open, onOpenChange, onSave, onCancel }: CreateCurrencyModalProps) {
  const [currencyCode, setCurrencyCode] = React.useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = React.useState("");
  
  const [currencyError, setCurrencyError] = React.useState(false);
  const [exchangeRateError, setExchangeRateError] = React.useState(false);

  const [availableCurrencies, setAvailableCurrencies] = React.useState<{value: string, label: string, name: string}[]>([]);

  React.useEffect(() => {
    if (open) {
      fetch("/catalogs/json/currencies.json")
        .then((res) => res.json())
        .then((data) => {
          setAvailableCurrencies(
            data.map((c: any) => ({
              value: c.code,
              label: `${c.code} - ${c.name}`,
              name: c.name,
            }))
          );
        })
        .catch((err) => console.error("Error loading currencies JSON", err));
    }
  }, [open]);

  const baseInput =
    "w-full bg-white px-3 py-2 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const handleSave = () => {
    let hasError = false;
    if (!currencyCode) {
      setCurrencyError(true);
      hasError = true;
    }
    if (!exchangeRate.trim()) {
      setExchangeRateError(true);
      hasError = true;
    }

    if (hasError) return;

    const selected = availableCurrencies.find(c => c.value === currencyCode);

    onSave({
      code: currencyCode as string,
      name: selected?.name || currencyCode as string,
      exchange_rate: exchangeRate
    });

    // Reset form
    setCurrencyCode(null);
    setExchangeRate("");
  };

  const handleCancel = () => {
    // Reset form
    setCurrencyCode(null);
    setExchangeRate("");
    setCurrencyError(false);
    setExchangeRateError(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <DialogTitle className="text-base font-bold text-[#123159]">Nueva moneda</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-[#475569] mb-1.5 block">
              Moneda <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <SearchableSelect
                  value={currencyCode ?? ""}
                  onValueChange={(val) => {
                    setCurrencyCode(val);
                    if (val) setCurrencyError(false);
                  }}
                  options={availableCurrencies}
                  placeholder="Selecciona una moneda"
                  className={cn("w-full h-[38px] text-foreground", currencyError && "border-destructive focus:border-destructive focus:ring-destructive/20")}
              />
              {currencyError && (
                <AlertCircle className="w-4 h-4 text-destructive absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none" />
              )}
            </div>
            {currencyError && (
              <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold text-[#475569] mb-1.5 block">
              Tasa de cambio <span className="text-primary">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Ingresa la tasa de cambio"
                className={cn(baseInput, "h-[38px] pr-8", exchangeRateError && "border-destructive focus:border-destructive focus:ring-destructive/20")}
                value={exchangeRate}
                onChange={(e) => {
                  setExchangeRate(e.target.value);
                  if (e.target.value.trim()) setExchangeRateError(false);
                }}
              />
              {exchangeRateError && (
                <AlertCircle className="w-4 h-4 text-destructive absolute right-2 top-1/2 -translate-y-1/2" />
              )}
            </div>
            {exchangeRateError && (
              <p className="text-[10px] text-destructive font-bold mt-1">Este campo es obligatorio</p>
            )}
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
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer"
          >
            Guardar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
