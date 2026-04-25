"use client";

import * as React from "react";
import { ExternalLink, HelpCircle, X, AlertCircle, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { type FormState } from "@/app/(authenticated)/items/page";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
type ItemType = "producto" | "servicio" | "combo";

const TAX_OPTIONS = [
  { label: "Ninguno (0%)", value: "0" },
  { label: "IVA 5%", value: "5" },
  { label: "IVA 19%", value: "19" },
];

const UNIT_OPTIONS = [
  "Unidad",
  "Kilogramo",
  "Gramo",
  "Litro",
  "Metro",
  "Hora",
  "Día",
  "Servicio",
];

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */
function parseMoney(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  return parseFloat(cleaned) || 0;
}

function formatMoney(value: number): string {
  if (isNaN(value) || value === 0) return "";
  return value.toLocaleString("es-CO", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                       */
/* ------------------------------------------------------------------ */

/** Selector de tipo de ítem (Producto / Servicio / Combo) */
function ItemTypeSelector({
  value,
  onChange,
}: {
  value: ItemType;
  onChange: (t: ItemType) => void;
}) {
  const types: { key: ItemType; label: string }[] = [
    { key: "producto", label: "Producto" },
    { key: "servicio", label: "Servicio" },
    { key: "combo", label: "Combo" },
  ];

  return (
    <div className="flex gap-3">
      {types.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-between border-2
            ${value === key
              ? "bg-white border-primary text-primary shadow-sm"
              : "bg-[#f1f5f9] border-transparent text-[#64748b]/60 hover:bg-[#e2e8f0]"
            }`}
        >
          {label}
          {value === key && <Check className="w-4 h-4 stroke-[3px]" />}
        </button>
      ))}
    </div>
  );
}

/** Input de dinero con prefijo $ */
function MoneyInput({
  placeholder,
  value,
  onChange,
  className,
}: {
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const isError = className?.includes("border-destructive");

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-muted-foreground text-sm">$</span>
      <input
        type="text"
        inputMode="decimal"
        placeholder={placeholder ?? "0.000"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className}
      />
      {isError && (
        <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Modal                                                           */
/* ------------------------------------------------------------------ */
interface NewItemModalProps {
  open: boolean;
  onClose: () => void;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  errors: Record<string, boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewItemModal({
  open,
  onClose,
  form,
  setForm,
  errors,
  setErrors,
  onSubmit
}: NewItemModalProps) {
  const router = useRouter();

  const baseInput =
    "!bg-white !h-8 px-3 !py-0 text-sm border-[1px] border-foreground/20 shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/40 flex items-center outline-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary leading-none";

  const selectItemClass =
    "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBasePriceChange(v: string) {
    const base = parseMoney(v);
    const taxRate = parseFloat(form.tax) / 100;
    const total = base + (base * taxRate);
    setForm(prev => ({
      ...prev,
      basePrice: v,
      totalPrice: total > 0 ? total.toFixed(2) : ""
    }));
    if (errors.basePrice) setErrors(prev => ({ ...prev, basePrice: false }));
  }

  function handleTotalPriceChange(v: string) {
    const total = parseMoney(v);
    const taxRate = parseFloat(form.tax) / 100;
    const base = total / (1 + taxRate);
    setForm(prev => ({
      ...prev,
      totalPrice: v,
      basePrice: base > 0 ? base.toFixed(2) : ""
    }));
    if (errors.totalPrice) setErrors(prev => ({ ...prev, totalPrice: false }));
  }

  function handleTaxChange(v: string) {
    const base = parseMoney(form.basePrice);
    const taxRate = parseFloat(v) / 100;
    const total = base + (base * taxRate);
    setForm(prev => ({
      ...prev,
      tax: v,
      totalPrice: total > 0 ? total.toFixed(2) : ""
    }));
  }

  const labelFor = form.itemType === "producto" ? "producto" : form.itemType === "servicio" ? "servicio" : "combo";

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent
        className="max-w-[850px] p-0 gap-0 overflow-hidden rounded-2xl bg-white border-none shadow-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-bold text-foreground">
              Formulario básico de {form.itemType === "producto" ? "productos" : form.itemType === "servicio" ? "servicios" : "combos"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <form onSubmit={onSubmit} noValidate>
          <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">

            {/* Tipo de ítem */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                Tipo de ítem
                <span className="text-destructive">*</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-[#1e293b] text-white">
                    El tipo de item no se podrá modificar una vez creado.
                  </TooltipContent>
                </Tooltip>
              </label>
              <ItemTypeSelector
                value={form.itemType}
                onChange={(t) => set("itemType", t)}
              />
              <p className="text-xs text-muted-foreground flex items-start gap-1">
                <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {form.itemType === "servicio"
                  ? "Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem."
                  : "Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem ni su condición variable."
                }
              </p>
            </div>

            {/* Nombre */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                Nombre <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: false }));
                  }}
                  className={cn(baseInput, "w-full rounded-md pr-10", errors.name && "border-destructive ring-destructive/20")}
                />
                {errors.name && (
                  <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
              {errors.name && (
                <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
              )}
            </div>

            {/* Bodega + Unidad de medida (Hidden for Servicio) */}
            {form.itemType !== "servicio" ? (
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                    Bodega <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={form.bodega}
                    onValueChange={(v) => set("bodega", v)}
                  >
                    <SelectTrigger size="sm" className={cn(baseInput, "w-full rounded-md")}>
                      <SelectValue placeholder="Seleccionar bodega" />
                    </SelectTrigger>
                    <SelectContent className="!bg-white border border-border rounded-xl shadow-lg">
                      <SelectItem className={selectItemClass} value="Principal">Principal</SelectItem>
                      <SelectItem className={selectItemClass} value="Secundaria">Secundaria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                    Unidad de medida
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                        Selecciona una referencia de medición para tu producto. Ejemplo: Unidad, Kilogramo, Litro.
                      </TooltipContent>
                    </Tooltip>
                    <span className="text-destructive">*</span>
                  </label>
                  <Select
                    value={form.unit}
                    onValueChange={(v) => {
                      set("unit", v);
                      if (errors.unit) setErrors(prev => ({ ...prev, unit: false }));
                    }}
                  >
                    <SelectTrigger size="sm" className={cn(baseInput, "w-full rounded-md", errors.unit && "border-destructive ring-destructive/20")}>
                      <SelectValue placeholder="Buscar..." />
                      {errors.unit && <AlertCircle className="w-4 h-4 text-destructive mr-6" />}
                    </SelectTrigger>
                    <SelectContent className="!bg-white border border-border rounded-xl shadow-lg">
                      {UNIT_OPTIONS.map((u) => (
                        <SelectItem className={selectItemClass} key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.unit && (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  )}
                </div>
              </div>
            ) : (
              /* Unidad de medida para Servicio (Full width) */
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                  Unidad de medida
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                      Selecciona una referencia de medición para tu producto. Ejemplo: Unidad, Kilogramo, Litro.
                    </TooltipContent>
                  </Tooltip>
                  <span className="text-destructive">*</span>
                </label>
                <Select
                  value={form.unit || "Servicio"}
                  onValueChange={(v) => {
                    set("unit", v);
                    if (errors.unit) setErrors(prev => ({ ...prev, unit: false }));
                  }}
                >
                  <SelectTrigger size="sm" className={cn(baseInput, "w-full rounded-md", errors.unit && "border-destructive ring-destructive/20")}>
                    <SelectValue placeholder="Buscar..." />
                  </SelectTrigger>
                  <SelectContent className="!bg-white border border-border rounded-xl shadow-lg">
                    {UNIT_OPTIONS.map((u) => (
                      <SelectItem className={selectItemClass} key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.unit && (
                  <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                )}
              </div>
            )}

            {/* Código del producto o servicio (Only for Combo) */}
            {form.itemType === "combo" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                  Código del producto o servicio
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-[#1e293b] text-white">
                      Busca productos o servicios para agregar al combo.
                    </TooltipContent>
                  </Tooltip>
                </label>
                <Select>
                  <SelectTrigger size="sm" className={cn(baseInput, "w-full rounded-md")}>
                    <SelectValue placeholder="Buscar..." />
                  </SelectTrigger>
                  <SelectContent className="!bg-white border border-border rounded-xl shadow-lg">
                    <SelectItem className={selectItemClass} value="p1">Producto Ejemplo 1</SelectItem>
                    <SelectItem className={selectItemClass} value="p2">Servicio Ejemplo 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Cantidad inicial + Costo inicial (Only for Producto) */}
            {form.itemType === "producto" && (
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                    Cantidad inicial <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={form.initialQty}
                      onChange={(e) => {
                        set("initialQty", e.target.value);
                        if (errors.initialQty) setErrors(prev => ({ ...prev, initialQty: false }));
                      }}
                      className={cn(baseInput, "w-full rounded-md pr-10", errors.initialQty && "border-destructive ring-destructive/20")}
                    />
                    {errors.initialQty && (
                      <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                  {errors.initialQty && (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                    Costo inicial <span className="text-destructive">*</span>
                  </label>
                  <MoneyInput
                    placeholder="$0.000"
                    value={form.initialCost}
                    onChange={(v) => {
                      set("initialCost", v);
                      if (errors.initialCost) setErrors(prev => ({ ...prev, initialCost: false }));
                    }}
                    className={cn(baseInput, "w-full pl-7 rounded-md pr-10", errors.initialCost && "border-destructive ring-destructive/20")}
                  />
                  {errors.initialCost && (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  )}
                </div>
              </div>
            )}

            {/* Precio base + Impuesto = Precio Total */}
            <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-2 gap-y-1.5 items-start">
              {/* Labels Row */}
              <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                Precio base <span className="text-destructive">*</span>
              </label>
              <div className="w-4" /> {/* Spacer for + */}
              <label className="text-sm font-medium text-foreground block h-5">
                Impuesto
              </label>
              <div className="w-4" /> {/* Spacer for = */}
              <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                Precio Total <span className="text-destructive">*</span>
              </label>

              {/* Inputs/Symbols Row */}
              <div className="space-y-1.5">
                <div className="relative">
                  <MoneyInput
                    placeholder="$0.000 - Total $0.000"
                    value={form.basePrice}
                    onChange={handleBasePriceChange}
                    className={cn(baseInput, "w-full pl-7 rounded-md pr-10", errors.basePrice && "border-destructive ring-destructive/20")}
                  />
                  {errors.basePrice && (
                    <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.basePrice && (
                  <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                )}
              </div>

              <div className="h-8 flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-lg select-none">+</span>
              </div>

              <div className="space-y-1.5">
                <Select
                  value={form.tax}
                  onValueChange={handleTaxChange}
                >
                  <SelectTrigger size="sm" className={cn(baseInput, "w-full rounded-md")}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="!bg-white border border-border rounded-xl shadow-lg">
                    {TAX_OPTIONS.map((o) => (
                      <SelectItem className={selectItemClass} key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <div
                      className="px-2 py-1.5"
                      onPointerUp={(e) => {
                        e.preventDefault();
                        console.log("Nuevo impuesto");
                      }}
                    >
                      <button
                        type="button"
                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        Nuevo impuesto
                      </button>
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-8 flex items-center justify-center">
                <span className="text-muted-foreground font-medium text-lg select-none">=</span>
              </div>

              <div className="space-y-1.5">
                <div className="relative">
                  <MoneyInput
                    placeholder="$0.000"
                    value={form.totalPrice}
                    onChange={handleTotalPriceChange}
                    className={cn(baseInput, "w-full pl-7 rounded-md pr-10", errors.totalPrice && "border-destructive ring-destructive/20")}
                  />
                  {errors.totalPrice && (
                    <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.totalPrice && (
                  <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-[#f8fafc] rounded-b-2xl">
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/items/new");
              }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#2563eb] font-bold no-underline hover:bg-background rounded-lg transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ir al formulario avanzado
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-white border border-border hover:bg-muted text-foreground text-sm font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-bold rounded-xl bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all shadow-md active:scale-95"
              >
                {form.itemType === "combo" ? "Completar combo" : `Crear ${labelFor}`}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
