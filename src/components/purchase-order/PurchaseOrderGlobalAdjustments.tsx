"use client";
import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { showToast } from "@/components/sonner/CustomToaster";

function FormattedInput({ value, onChange, placeholder, className }: any) {
  const [displayValue, setDisplayValue] = useState(value ? new Intl.NumberFormat("es-CO").format(value) : "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (!raw) {
      setDisplayValue("");
      onChange(0);
      return;
    }
    const num = parseFloat(raw);
    setDisplayValue(new Intl.NumberFormat("es-CO").format(num));
    onChange(num);
  };

  return <Input type="text" placeholder={placeholder} value={displayValue} onChange={handleChange} className={className} />;
}

// Ajustes globales (cargo/descuento a nivel de documento) — mismo patrón que
// Cotizaciones/Remisiones/Facturas, compartido por órdenes internal/external.
export function PurchaseOrderGlobalAdjustments({ builder }: { builder: any }) {
  const [type, setType] = useState<"discount" | "charge">("discount");
  const [valueType, setValueType] = useState<"percentage" | "fixed">("percentage");
  const [value, setValue] = useState<number>(0);
  const [reason, setReason] = useState("");

  const handleAdd = () => {
    if (value <= 0) return;
    builder.addGlobalAdjustment(type, valueType, value, reason);
    setValue(0);
    setReason("");
  };

  return (
    <div className="border-t border-border pt-6">
      <div className="flex items-center gap-1.5 mb-4">
        <h3 className="text-sm font-semibold text-foreground">Ajustes Globales</h3>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help hover:text-primary/70 transition-colors" />
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px] leading-relaxed">
              Aplica un descuento o recargo al total de la orden de compra. Puedes ingresar el valor en porcentaje (%) o como monto fijo ($) y agregar un motivo opcional.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="flex">
            <Select
              value={type}
              onValueChange={(val: "discount" | "charge") => {
                setType(val);
                setValueType("percentage");
              }}
            >
              <SelectTrigger className="w-full bg-white h-9 border border-border rounded-r-none hover:bg-muted hover:border-primary cursor-pointer transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount" className="cursor-pointer hover:bg-muted focus:bg-muted">Descuento</SelectItem>
                <SelectItem value="charge" className="cursor-pointer hover:bg-muted focus:bg-muted">Cargo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={valueType} onValueChange={(val: "percentage" | "fixed") => setValueType(val)}>
              <SelectTrigger className="w-20 bg-white h-9 border border-border rounded-l-none border-l-0 hover:bg-muted hover:border-primary cursor-pointer transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage" className="cursor-pointer hover:bg-muted focus:bg-muted">%</SelectItem>
                <SelectItem value="fixed" className="cursor-pointer hover:bg-muted focus:bg-muted">$</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {valueType === "percentage" ? (
            <Input
              type="number"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") e.preventDefault();
              }}
              placeholder="Valor"
              value={value || ""}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > 100) {
                  showToast("El porcentaje no puede ser mayor al 100%", "warning");
                  setValue(0);
                } else {
                  setValue(val);
                }
              }}
              className="w-full bg-white h-9 border border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          ) : (
            <FormattedInput
              placeholder="Valor"
              value={value || 0}
              onChange={(val: number) => {
                if (val > builder.totals.subtotal) {
                  showToast("El valor excede el total del documento", "warning");
                  setValue(0);
                } else {
                  setValue(val);
                }
              }}
              className="w-full bg-white h-9 border border-border [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          )}

          <Input
            placeholder="Motivo"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-white h-9 border border-border"
          />

          <button
            onClick={handleAdd}
            className="w-full bg-primary text-primary-foreground px-4 h-9 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors cursor-pointer"
          >
            {type === "discount" ? "Agregar descuento" : "Agregar cargo"}
          </button>
        </div>

        <div className="w-full md:w-2/3">
          <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
            {builder.globalAdjustments.length === 0 && (
              <div className="text-sm text-muted-foreground italic h-full min-h-32 flex items-center justify-center border border-dashed border-border rounded-lg p-6">
                No hay ajustes globales agregados.
              </div>
            )}
            {builder.globalAdjustments.map((adj: any) => {
              const title = adj.type === "discount" ? "Descuento" : "Cargo";
              const reasonText = adj.reason ? `: ${adj.reason}` : "";

              return (
                <div key={adj.id} className="flex items-center gap-4 bg-muted/10 p-3 rounded-lg border border-border">
                  <span className="text-sm font-medium flex-1 truncate">
                    {title}
                    {reasonText}
                  </span>
                  <span className="text-sm font-bold min-w-[100px] text-right">
                    {adj.valueType === "percentage" ? `${adj.value}%` : `$ ${Math.round(adj.value).toLocaleString("es-CO")}`}
                  </span>
                  <button
                    onClick={() => builder.removeGlobalAdjustment(adj.id)}
                    className="p-1.5 rounded hover:bg-destructive/10 transition cursor-pointer group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
