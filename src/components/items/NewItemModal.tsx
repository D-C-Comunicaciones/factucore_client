"use client";

import * as React from "react";
import { ExternalLink, HelpCircle, X, AlertCircle, Check, PlusCircle, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { AsyncSearchableSelect } from "@/components/ui/async-searchable-select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { type ItemFormState } from "@/types/items";
import { useStandardCodes } from "@/hooks/catalogs/useStandardCodes";
import { NewTaxRateModal } from "@/components/taxes/NewTaxRateModal";
import { NewCategoryModal } from "@/components/category/NewCategoryModal";
import { Checkbox } from "@/components/ui/checkbox";
import { FormattedInput } from "@/components/ui/formatted-input";
import { showToast } from "@/components/sonner/CustomToaster";
import { catalogsApi } from "@/lib/catalogs";
import { warehousesApi } from "@/lib/warehouses";
import { QUERY_KEYS } from "@/lib/queryKeys";
import { queryClient } from "@/lib/queryClient";
import { invalidateCatalog } from "@/hooks/useCatalogs";
import { TaxRate, UnitMeasure } from "@/types/catalogs";
import { NewWarehouseModal } from "@/components/warehouse/NewWarehouseModal";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
type ItemType = "producto" | "servicio" | "combo";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, "");
    // Evitar múltiples puntos
    if ((val.match(/\./g) || []).length <= 1) {
      onChange(val);
    }
  };

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-muted-foreground text-sm">$</span>
      <FormattedInput
        placeholder={placeholder ?? "0"}
        value={value}
        onChange={(val) => onChange(val)}
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
  form: ItemFormState;
  setForm: React.Dispatch<React.SetStateAction<ItemFormState>>;
  errors: Record<string, string | boolean>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  onSubmit: (e: React.FormEvent) => void;
  onAdvanced: () => void;
  isCreating?: boolean;
  catalogs: any;
  advancedContent?: React.ReactNode;
  advancedExpanded?: boolean;
  onToggleAdvanced?: () => void;
}

export function NewItemModal({
  open,
  onClose,
  form,
  setForm,
  errors,
  setErrors,
  onSubmit,
  onAdvanced,
  isCreating,
  catalogs,
  advancedContent,
  advancedExpanded,
  onToggleAdvanced,
}: NewItemModalProps) {
  const router = useRouter();
  const [isTaxModalOpen, setIsTaxModalOpen] = React.useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = React.useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = React.useState(false);

  const baseInput =
    "!bg-white !h-8 px-3 !py-0 text-sm border-[1px] border-foreground/20 shadow-none text-foreground transition-all focus:border-primary focus:ring-1 focus:ring-primary/40 flex items-center outline-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary leading-none";

  const selectItemClass =
    "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const { taxes = [], categories = [], warehouses = [], unitMeasures = [], isLoading } = catalogs || {};

  // Código estándar (UNSPSC / Colombia Compra Eficiente) para el selector "Código del producto o servicio"
  const [standardCodeSearch, setStandardCodeSearch] = React.useState("");
  const { options: standardCodeOptions, isLoading: isSearchingStandardCodes } = useStandardCodes(standardCodeSearch);

  const TAX_OPTIONS = (taxes || []).map((tax: any) => {
    const rate = tax.rate ?? tax.percentage ?? tax.code ?? 0;
    return {
      label: `${tax.name} (${rate}%)`,
      value: String(tax.id),
    };
  });

  const getTaxRate = (taxId: string) => {
    if (!taxId || taxId === "0") return 0;
    const selected = (catalogs?.taxes || []).find((t: any) => String(t.id) === String(taxId));
    return parseFloat(String(selected?.rate ?? selected?.percentage ?? selected?.code ?? 0)) / 100;
  };

  function set<K extends keyof ItemFormState>(key: K, value: ItemFormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleBasePriceChange(v: string) {
    const base = parseMoney(v);
    const taxRate = getTaxRate(form.tax);
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
    const taxRate = getTaxRate(form.tax);
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
    const taxRate = getTaxRate(v);
    const total = base + (base * taxRate);
    setForm(prev => ({
      ...prev,
      tax: v,
      totalPrice: total > 0 ? total.toFixed(2) : ""
    }));
  }

  const handleSaveTaxRate = async (newTaxRate: {
    name: string;
    tax_id: number;
    rate: number;
    description?: string;
    type: "percentage";
  }) => {
    const response = await catalogsApi.createTaxRate({
      ...newTaxRate,
      type: "percentage",
    });

    const created =
      response?.data?.tax_rates?.[0] ??
      response?.data?.tax_rate ??
      response?.data ??
      newTaxRate;

    invalidateCatalog(queryClient, QUERY_KEYS.catalogs.taxRates());

    if (created.id) set("tax", String(created.id));
    if (created.id) handleTaxChange(String(created.id));
    showToast(`El impuesto "${created.name ?? newTaxRate.name}" ha sido creado.`, "success");
  };



  const handleSaveWarehouse = async (data: { name: string; address: string; observations: string }) => {
    try {
      const response = await warehousesApi.createWarehouse(data);

      invalidateCatalog(queryClient, QUERY_KEYS.catalogs.warehouses());

      const created =
        response?.data?.warehouse ??
        response?.data ??
        { id: Date.now(), name: data.name };

      set("bodega", created.name);
      setIsWarehouseModalOpen(false);
      showToast(`La bodega "${created.name}" fue creada exitosamente.`, "success");
    } catch (error) {
      showToast("Error al crear la bodega", "error");
    }
  };

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
              Formulario {advancedExpanded ? "avanzado" : "básico"} de {form.itemType === "producto" ? "productos" : form.itemType === "servicio" ? "servicios" : "combos"}
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Body */}
        <form onSubmit={onSubmit} noValidate className="flex flex-col">
          <div className="overflow-y-auto max-h-[70vh] shrink overflow-x-hidden">
            <div className="px-6 py-5 space-y-5">

              {/* Tipo de ítem */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                  Tipo de ítem
                  <span className="text-primary">*</span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
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
                  {form.itemType === "servicio" || form.itemType === "combo"
                    ? "Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem."
                    : "Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem ni su condición variable."
                  }
                </p>
              </div>

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                  Nombre <span className="text-primary">*</span>
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
                {errors.name && typeof errors.name === "string" ? (
                  <p className="text-[11px] text-destructive leading-none">{errors.name}</p>
                ) : errors.name ? (
                  <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                ) : null}
              </div>

              {/* Bodega + Categoría (Hidden for Servicio) */}
              {form.itemType !== "servicio" && (
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                      Bodega <span className="text-primary">*</span>
                    </label>
                    <SearchableSelect
                      value={form.bodega}
                      onValueChange={(v) => set("bodega", v)}
                      options={catalogs?.warehouses?.length > 0
                        ? catalogs.warehouses.map((w: any) => ({ value: w.name, label: w.name }))
                        : []
                      }
                      placeholder="Seleccionar bodega"
                      searchPlaceholder="Buscar bodega..."
                      emptyMessage="No hay bodegas disponibles."
                      className={cn(baseInput, "w-full rounded-md")}
                      footer={
                        <button
                          type="button"
                          onClick={() => setIsWarehouseModalOpen(true)}
                          className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                        >
                          + Nueva Bodega
                        </button>
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                      Categoría
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                            Selecciona la categoría a la que pertenece tu producto y/o servicio. Ver más
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </label>
                    <SearchableSelect
                      value={form.categoryId}
                      onValueChange={(v) => set("categoryId", v)}
                      options={categories?.length > 0
                        ? categories.map((c: any) => ({ value: String(c.id), label: c.name }))
                        : []
                      }
                      placeholder="Seleccionar"
                      searchPlaceholder="Buscar categoría..."
                      emptyMessage="No hay categorías disponibles."
                      className={cn(baseInput, "w-full rounded-md")}
                      footer={
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(true)}
                          className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                        >
                          + Nueva Categoría
                        </button>
                      }
                    />
                  </div>
                </div>
              )}

              {/* Unidad de medida + Referencia */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                    Unidad de medida
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                          Selecciona una referencia de medición para tu producto. Ejemplo: Unidad, Kilogramo, Litro.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <span className="text-primary">*</span>
                  </label>
                  <SearchableSelect
                    value={form.unit || (form.itemType === "servicio" ? (unitMeasures?.find((u: any) => u.name.toLowerCase() === "servicio")?.id?.toString() || "") : "")}
                    onValueChange={(v) => {
                      set("unit", v);
                      if (errors.unit) setErrors(prev => ({ ...prev, unit: false }));
                    }}
                    options={(unitMeasures || []).map((unit: any) => ({ value: String(unit.id), label: unit.name }))}
                    placeholder="Buscar"
                    searchPlaceholder="Buscar unidad..."
                    emptyMessage="No se encontraron unidades."
                    className={cn(baseInput, "w-full rounded-md", errors.unit && "border-destructive ring-destructive/20")}
                    errorIcon={errors.unit ? <AlertCircle className="w-4 h-4 text-destructive" /> : undefined}
                  />
                  {errors.unit && typeof errors.unit === "string" ? (
                    <p className="text-[11px] text-destructive leading-none">{errors.unit}</p>
                  ) : errors.unit ? (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  ) : null}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                    Referencia
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                          Agrega un código único para identificar tu producto. Ejemplo: CAS002
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <input
                    type="text"
                    value={form.reference || ""}
                    onChange={(e) => set("reference", e.target.value)}
                    className={cn(baseInput, "w-full rounded-md", errors.reference && "border-destructive ring-destructive/20")}
                  />
                  {errors.reference && typeof errors.reference === "string" && (
                    <p className="text-[11px] text-destructive leading-none">{errors.reference}</p>
                  )}
                </div>
              </div>


              {/* Cantidad inicial + Costo inicial (Solo para Producto) */}
              {form.itemType === "producto" && (
                <div className="grid grid-cols-2 gap-4 items-start">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                      Cantidad inicial <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={form.initialQuantity}
                        onChange={(e) => {
                          set("initialQuantity", e.target.value);
                          if (errors.initialQuantity)
                            setErrors((prev) => ({ ...prev, initialQuantity: false }));
                        }}
                        className={cn(
                          baseInput,
                          "w-full rounded-md pr-10",
                          errors.initialQuantity &&
                          "border-destructive ring-destructive/20"
                        )}
                      />
                      {errors.initialQuantity && (
                        <AlertCircle className="w-4 h-4 text-destructive absolute right-3 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                    {errors.initialQuantity && typeof errors.initialQuantity === "string" ? (
                      <p className="text-[11px] text-destructive leading-none">
                        {errors.initialQuantity}
                      </p>
                    ) : errors.initialQuantity ? (
                      <p className="text-[11px] text-destructive leading-none">
                        Este campo es obligatorio
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                      Costo inicial <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <MoneyInput
                        placeholder="$0.000"
                        value={form.initialCost}
                        onChange={(v) => {
                          set("initialCost", v);
                          if (errors.initialCost)
                            setErrors((prev) => ({ ...prev, initialCost: false }));
                        }}
                        className={cn(
                          baseInput,
                          "w-full pl-7 rounded-md pr-10",
                          errors.initialCost && "border-destructive ring-destructive/20"
                        )}
                      />
                    </div>
                    {errors.initialCost && typeof errors.initialCost === "string" ? (
                      <p className="text-[11px] text-destructive leading-none">
                        {errors.initialCost}
                      </p>
                    ) : errors.initialCost ? (
                      <p className="text-[11px] text-destructive leading-none">
                        Este campo es obligatorio
                      </p>
                    ) : null}
                  </div>
                </div>
              )}



              {/* Código del producto o servicio (Only for Combo) */}
              {form.itemType === "combo" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1 h-5">
                    Código del producto o servicio
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-[280px]">
                          Ingresa el código definido por Colombia Compra Eficiente, si no lo conoces haz clic aquí.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  <AsyncSearchableSelect
                    value={form.comboCode}
                    onValueChange={(v) => set("comboCode", v)}
                    options={standardCodeOptions}
                    loading={isSearchingStandardCodes}
                    onSearchChange={setStandardCodeSearch}
                    placeholder="Buscar"
                    searchPlaceholder="Buscar código o descripción..."
                    emptyMessage={isSearchingStandardCodes ? "Buscando..." : "No se encontraron códigos."}
                    className={cn(baseInput, "w-full rounded-md")}
                  />
                </div>
              )}

              {/* Precios */}
              <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-x-2 gap-y-1.5 items-start">
                {/* Labels Row */}
                <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                  Precio base <span className="text-primary">*</span>
                </label>
                <div className="w-4" /> {/* Spacer for + */}
                <label className="text-sm font-medium text-foreground block h-5">
                  Impuesto
                </label>
                <div className="w-4" /> {/* Spacer for = */}
                <label className="text-sm font-medium text-foreground flex items-center gap-0.5 h-5">
                  Precio Total <span className="text-primary">*</span>
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
                  {errors.basePrice && typeof errors.basePrice === "string" ? (
                    <p className="text-[11px] text-destructive leading-none">{errors.basePrice}</p>
                  ) : errors.basePrice ? (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  ) : null}
                </div>

                <div className="h-8 flex items-center justify-center">
                  <span className="text-muted-foreground font-medium text-lg select-none">+</span>
                </div>

                <div className="space-y-1.5">
                  <SearchableSelect
                    value={form.tax}
                    onValueChange={handleTaxChange}
                    options={TAX_OPTIONS}
                    placeholder="Seleccionar"
                    searchPlaceholder="Buscar impuesto..."
                    emptyMessage="No se encontraron impuestos."
                    className={cn(baseInput, "w-full rounded-md")}
                    footer={
                      <button
                        type="button"
                        onClick={() => setIsTaxModalOpen(true)}
                        className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                      >
                        Nuevo impuesto
                      </button>
                    }
                  />
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
                  {errors.totalPrice && typeof errors.totalPrice === "string" ? (
                    <p className="text-[11px] text-destructive leading-none">{errors.totalPrice}</p>
                  ) : errors.totalPrice ? (
                    <p className="text-[11px] text-destructive leading-none">Este campo es obligatorio</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Advanced Accordion / Content */}
            {advancedContent !== undefined ? (
              <div className="border-t border-border/40">
                <button
                  type="button"
                  onClick={onToggleAdvanced}
                  className="w-full px-6 py-4 flex items-center justify-between text-[#123159] hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-bold">
                    {advancedExpanded ? "Ocultar formulario avanzado" : "Mostrar formulario avanzado"}
                  </span>
                  <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform duration-200", advancedExpanded && "rotate-180")} />
                </button>
                <div className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  advancedExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}>
                  <div className="overflow-hidden">
                    <div className="px-6 py-4 bg-muted/10 border-t border-border/40">
                      {advancedContent}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-[#f8fafc] rounded-b-2xl mt-auto shrink-0">
            {advancedContent === undefined ? (
              <button
                type="button"
                onClick={onAdvanced}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-[13px] text-[#2563eb] font-bold no-underline hover:bg-background rounded-lg transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {form.itemType === "combo" ? "Armar mi combo" : "Ir al formulario avanzado"}
              </button>
            ) : (
              <span className="text-xs text-muted-foreground">
                Los campos marcados con <span className="text-primary">*</span> son obligatorios
              </span>
            )}

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
                disabled={isCreating}
                className="px-5 py-2 text-sm font-bold rounded-xl bg-[#2563eb] text-white hover:bg-[#1d4ed8] transition-all shadow-md active:scale-95 disabled:opacity-50"
              >
                {isCreating ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </form>

        <NewTaxRateModal
          open={isTaxModalOpen}
          onOpenChange={setIsTaxModalOpen}
          onSave={handleSaveTaxRate}
          taxTypes={catalogs?.taxTypes || []}
        />
        <NewCategoryModal
          open={isCategoryModalOpen}
          onOpenChange={setIsCategoryModalOpen}
          onCreated={(cat) => set("categoryId", String(cat.id))}
        />
        <NewWarehouseModal
          open={isWarehouseModalOpen}
          onOpenChange={setIsWarehouseModalOpen}
          onSave={handleSaveWarehouse}
          onCancel={() => setIsWarehouseModalOpen(false)}
        />
      </DialogContent >
    </Dialog >
  );
}
