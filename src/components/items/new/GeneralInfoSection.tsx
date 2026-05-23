"use client";

import * as React from "react";
import { HelpCircle, ChevronUp, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import { SectionCard } from "./SectionCard";
import { TooltipProvider } from "@radix-ui/react-tooltip";

type ItemType = "producto" | "servicio" | "combo";

const TAX_OPTIONS = [
  { label: "Ninguno (0%)", value: "0" },
  { label: "IVA 5%", value: "5" },
  { label: "IVA 19%", value: "19" },
];

const UNIT_OPTIONS = ["Unidad", "Kilogramo", "Gramo", "Litro", "Metro", "Hora", "Día", "Servicio"];
const CATEGORY_OPTIONS = ["Productos", "Servicios", "Digital", "Físico"];
const PRODUCT_CODES = ["49111500 - Publicaciones impresas", "81110000 - Servicios de TI", "80141600 - Marketing"];

interface GeneralInfoSectionProps {
  itemType: ItemType;
  onItemTypeChange: (t: ItemType) => void;
  name: string;
  onNameChange: (v: string) => void;
  basePrice: string;
  onBasePriceChange: (v: string) => void;
  tax: string;
  onTaxChange: (v: string) => void;
  onTotalChange: (total: number) => void;
  hasVariants: boolean;
  onHasVariantsChange: (v: boolean) => void;
  
  // Full integration props
  reference: string;
  onReferenceChange: (v: string) => void;
  description: string;
  onDescriptionChange: (v: string) => void;
  unitMeasureId?: number;
  onUnitMeasureIdChange: (v: number) => void;
  categoryId?: number;
  onCategoryIdChange: (v: number) => void;
  warehouseId?: number;
  onWarehouseIdChange: (v: number) => void;
  initialStock: string;
  onInitialStockChange: (v: string) => void;
  minimumStock: string;
  onMinimumStockChange: (v: string) => void;
  catalogs: any;
}

export function GeneralInfoSection({
  itemType,
  onItemTypeChange,
  name,
  onNameChange,
  basePrice,
  onBasePriceChange,
  tax,
  onTaxChange,
  onTotalChange,
  hasVariants,
  onHasVariantsChange,
  reference,
  onReferenceChange,
  description,
  onDescriptionChange,
  unitMeasureId,
  onUnitMeasureIdChange,
  categoryId,
  onCategoryIdChange,
  warehouseId,
  onWarehouseIdChange,
  initialStock,
  onInitialStockChange,
  minimumStock,
  onMinimumStockChange,
  catalogs
}: GeneralInfoSectionProps) {
  const baseInput =
    "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";

  const selectItemClass =
    "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const TAX_OPTIONS: { label: string; value: string }[] = catalogs.taxes?.map((t: any) => ({ label: `${t.name} (${t.rate}%)`, value: t.id.toString() })) || [];
  const UNIT_OPTIONS = catalogs.unitMeasures || [];
  const CATEGORY_OPTIONS = catalogs.categories || [];
  const WAREHOUSE_OPTIONS = catalogs.warehouses || [];
  const STANDARD_CODES = catalogs.standardCodes || [];

  const handleNumericChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9.]/g, "");
    // Evitar múltiples puntos
    if ((val.match(/\./g) || []).length > 1) {
      const parts = val.split(".");
      val = parts[0] + "." + parts.slice(1).join("");
    }
    setter(val);
  };

  const totalPrice = React.useMemo(() => {
    const base = parseFloat(basePrice.replace(/[^0-9.]/g, "")) || 0;
    // Find the tax rate from catalogs
    const selectedTax = catalogs.taxes?.find((t: any) => t.id.toString() === tax);
    const rate = selectedTax ? parseFloat(selectedTax.rate) / 100 : 0;
    return base + base * rate;
  }, [basePrice, tax, catalogs.taxes]);

  React.useEffect(() => {
    onTotalChange(totalPrice);
  }, [totalPrice, onTotalChange]);

  const types: { key: ItemType; label: string; hint: string }[] = [
    { key: "producto", label: "Producto", hint: "Un bien físico que se puede comprar y recibir." },
    { key: "servicio", label: "Servicio", hint: "Una actividad o tarea prestada a un cliente." },
    { key: "combo", label: "Combo", hint: "Conjunto de productos y/o servicios agrupados." },
  ];

  return (
    <SectionCard title="Información general">
      {/* Tipo de ítem */}
      <div className="mt-2 mb-5">
        <label className="text-sm font-medium text-foreground flex items-center gap-1 mb-2">
          Tipo de ítem <span className="text-primary">*</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#1e293b] text-white">
              El tipo de item no se podrá modificar una vez creado.
            </TooltipContent>
          </Tooltip>
        </label>
        <div className="flex gap-3">
          {types.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => onItemTypeChange(key)}
              className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-lg transition-all flex items-center justify-between border-2
                ${itemType === key
                  ? "bg-white border-primary text-primary shadow-sm"
                  : "bg-muted/40 border-transparent text-muted-foreground/50 hover:bg-muted/60"
                }`}
            >
              {label}
              {itemType === key && <Check className="w-4 h-4 stroke-[3px]" />}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground flex items-start gap-1">
          <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>
            Ten en cuenta que, una vez creado, no podrás cambiar el tipo de ítem ni su condición variable.<br />
            {types.find((t) => t.key === itemType)?.hint}
          </span>
        </p>

        {/* Producto con variantes */}
        {itemType === "producto" && (
          <div className="flex flex-col gap-3 mt-4">
            <label className="flex items-center gap-3 text-sm font-medium text-foreground cursor-pointer w-fit">
              <Checkbox 
                checked={hasVariants} 
                onCheckedChange={(v) => onHasVariantsChange(!!v)}
                className="h-5 w-5 rounded-md border-foreground/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-none"
              />
              <span>Producto con variantes</span>
            </label>
          </div>
        )}
      </div>

      {/* Grid Principal de Campos */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Nombre */}
        <div className="col-span-2">
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
            Nombre <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={cn(baseInput, "pr-8")}
          />
        </div>

        {/* Categoría */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Categoría
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                  Selecciona la categoría a la que pertenece tu producto y/o servicio. Ver más
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select value={categoryId?.toString()} onValueChange={(v) => onCategoryIdChange(parseInt(v))}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {CATEGORY_OPTIONS.map((c: any) => (
                <SelectItem className={selectItemClass} key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Bodega <span className="text-primary">*</span></label>
            <Select value={warehouseId?.toString()} onValueChange={(v) => onWarehouseIdChange(parseInt(v))}>
              <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
                {WAREHOUSE_OPTIONS.map((w: any) => (
                  <SelectItem className={selectItemClass} key={w.id} value={w.id.toString()}>{w.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        {/* Unidad de medida */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Unidad de medida <span className="text-primary">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                  Selecciona una referencia de medición para tu producto. Ejemplo: Unidad, Kilogramo, Litro.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select value={unitMeasureId?.toString()} onValueChange={(v) => onUnitMeasureIdChange(parseInt(v))}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Buscar..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {UNIT_OPTIONS.map((u: any) => (
                <SelectItem className={selectItemClass} key={u.id} value={u.id.toString()}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Referencia */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Referencia
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                  Ingresa una referencia única para tu producto.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <input type="text" value={reference} onChange={(e) => onReferenceChange(e.target.value)}
            className={cn(baseInput, "pr-8")} />
        </div>

        {/* Código del producto o servicio */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Código del producto o servicio
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                  Ingresa el código definido por Colombia Compra Eficiente, si no lo conoces haz clic aquí.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Select 
            onValueChange={(v) => {
              // Logic to handle standard code
            }}
          >
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Buscar..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {STANDARD_CODES.map((c: any) => (
                <SelectItem className={selectItemClass} key={c.id} value={c.id.toString()}>{c.code} - {c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cantidad inicial (Solo Producto) */}
        {itemType === "producto" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Cantidad inicial <span className="text-primary">*</span></label>
            <input type="text" value={initialStock} onChange={handleNumericChange(onInitialStockChange)}
              className={cn(baseInput, "pr-8")} placeholder="0" />
          </div>
        )}

        {/* Mínimo stock (Solo Producto, junto a bodega y cantidades) */}
        {itemType === "producto" && (
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Mínimo stock</label>
            <input type="text" value={minimumStock} onChange={handleNumericChange(onMinimumStockChange)}
              className={cn(baseInput, "pr-8")} placeholder="0" />
          </div>
        )}
      </div>

      {/* Precio base + Impuesto = Precio Total */}
      <div className="mb-4">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
              Precio base <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <input
                type="text"
                placeholder="0.000"
                value={basePrice}
                onChange={handleNumericChange(onBasePriceChange)}
                className={cn(baseInput, "w-full pl-7 pr-8")}
              />
            </div>
          </div>

          <div className="h-[34px] flex items-center mt-[22px] text-muted-foreground font-medium text-2xl">+</div>

          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Impuesto</label>
            <Select
              value={tax}
              onValueChange={onTaxChange}
            >
              <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
                <SelectValue placeholder="0%" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
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
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-xl transition-colors"
                  >
                    Nuevo impuesto
                  </button>
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[34px] flex items-center mt-[22px] text-muted-foreground font-medium text-2xl">=</div>

          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
              Precio Total <span className="text-destructive">*</span>
            </label>
            <input
              readOnly
              value={totalPrice > 0 ? `$ ${totalPrice.toLocaleString("es-CO", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : ""}
              placeholder="$ 0.000"
              className={cn(baseInput, "pr-8")}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Descripción</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-3 py-2 border border-foreground/20 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors shadow-none resize-none bg-white box-border"
        />
      </div>
    </SectionCard>
  );
}
