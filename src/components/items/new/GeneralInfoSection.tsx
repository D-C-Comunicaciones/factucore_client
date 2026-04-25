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
}: GeneralInfoSectionProps) {
  const baseInput =
    "bg-white h-8 px-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40";

  const selectItemClass =
    "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

  const [hasVariants, setHasVariants] = React.useState(false);
  const [category, setCategory] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [reference, setReference] = React.useState("");
  const [productCode, setProductCode] = React.useState("");
  const [initialCost, setInitialCost] = React.useState("");
  const [description, setDescription] = React.useState("");

  const totalPrice = React.useMemo(() => {
    const base = parseFloat(basePrice.replace(/[^0-9.]/g, "")) || 0;
    const rate = parseFloat(tax) / 100;
    return base + base * rate;
  }, [basePrice, tax]);

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
          Tipo de ítem <span className="text-destructive">*</span>
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
          <label className="flex items-center gap-2 mt-3 text-sm text-foreground cursor-pointer w-fit">
            <Checkbox checked={hasVariants} onCheckedChange={(v) => setHasVariants(!!v)} />
            Producto con variantes
          </label>
        )}
      </div>

      {/* Nombre */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
          Nombre <span className="text-destructive">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className={cn(baseInput, "w-full rounded-md")}
        />
      </div>

      {/* Categoría & Unidad de medida */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Categoría
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white">
                Selecciona una categoría para organizar tus productos.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={cn(baseInput, "w-full rounded-md")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {CATEGORY_OPTIONS.map((c) => (
                <SelectItem className={selectItemClass} key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Unidad de medida
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white">
                Define la unidad con la que se vende el producto.
              </TooltipContent>
            </Tooltip>
            <span className="text-destructive">*</span>
          </label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className={cn(baseInput, "w-full rounded-md")}>
              <SelectValue placeholder="Buscar..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {UNIT_OPTIONS.map((u) => (
                <SelectItem className={selectItemClass} key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Referencia & Código */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Referencia
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white">
                Código único de referencia para el producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <input type="text" value={reference} onChange={(e) => setReference(e.target.value)}
            className={cn(baseInput, "w-full rounded-md")} />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Código del producto o servicio
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white">
                Código estandarizado del producto o servicio.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={productCode} onValueChange={setProductCode}>
            <SelectTrigger className={cn(baseInput, "w-full rounded-md")}>
              <SelectValue placeholder="Buscar..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-lg">
              {PRODUCT_CODES.map((c) => (
                <SelectItem className={selectItemClass} key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Costo inicial */}
      <div className="mb-4">
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
          Costo inicial <span className="text-destructive">*</span>
        </label>
        <div className="relative max-w-[50%]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <input type="text" placeholder="0.000" value={initialCost} onChange={(e) => setInitialCost(e.target.value)}
            className={cn(baseInput, "w-full pl-7 rounded-md")} />
        </div>
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
              <input type="text" placeholder="$0.000 - Total $0.000" value={basePrice}
                onChange={(e) => onBasePriceChange(e.target.value)}
                className={cn(baseInput, "w-full pl-7 rounded-md")} />
            </div>
          </div>
          
          <div className="h-8 flex items-center mt-[22px] text-muted-foreground font-medium text-2xl">+</div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1.5 block">Impuesto</label>
            <Select
              value={tax}
              onValueChange={(v) => onTaxChange(v)}
            >
              <SelectTrigger className={cn(baseInput, "w-full rounded-md")}>
                <SelectValue placeholder="Seleccionar impuesto" />
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
                    className="w-full text-left px-2 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
                  >
                    Nuevo impuesto
                  </button>
                </div>
              </SelectContent>
            </Select>
          </div>

          <div className="h-8 flex items-center mt-[22px] text-muted-foreground font-medium text-2xl">=</div>
          
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-0.5">
              Precio Total <span className="text-destructive">*</span>
            </label>
            <input 
              readOnly
              value={totalPrice > 0 ? `$ ${totalPrice.toLocaleString("es-CO", { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : ""}
              placeholder="$ 0.000"
              className={cn(baseInput, "w-full rounded-md")} 
            />
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Descripción</label>
        <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md text-sm outline-none focus:border-primary transition-colors shadow-none border-foreground/20 resize-none focus:ring-1 focus:ring-primary/40" />
      </div>
    </SectionCard>
  );
}
