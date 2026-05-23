"use client";

import { SectionCard } from "./SectionCard";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { cn } from "@/lib/utils";

const selectItemClass = "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

const ACCOUNT_OPTIONS = ["Ventas", "Ingresos operacionales", "Otros ingresos"];
const INVENTORY_ACCOUNTS = ["Inventarios", "Mercancía", "Materia prima"];
const COST_ACCOUNTS = ["Costos del inventario", "Costo de ventas", "Costos directos"];

export function AccountingSection() {
  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";
  const [saleAccount, setSaleAccount] = React.useState("Ventas");
  const [inventoryAccount, setInventoryAccount] = React.useState("Inventarios");
  const [costAccount, setCostAccount] = React.useState("Costos del inventario");

  return (
    <SectionCard title="Configuración contable" defaultOpen={true}>
      <p className="text-sm text-muted-foreground mb-4">
        Configura las cuentas contables en las que se registrarán los movimientos.
      </p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Cuenta Contable
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores por ventas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={saleAccount} onValueChange={setSaleAccount}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
              {ACCOUNT_OPTIONS.map((a) => (
                <SelectItem key={a} value={a} className={selectItemClass}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Cuenta de inventario
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores de entradas y salidas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={inventoryAccount} onValueChange={setInventoryAccount}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
              {INVENTORY_ACCOUNTS.map((a) => (
                <SelectItem key={a} value={a} className={selectItemClass}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="max-w-[50%]">
        <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
          Cuenta de costo de venta
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
              Selecciona la cuenta contable en la que se registrarán el valor del costo de venta del producto.
            </TooltipContent>
          </Tooltip>
        </label>
        <Select value={costAccount} onValueChange={setCostAccount}>
          <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
            {COST_ACCOUNTS.map((a) => (
              <SelectItem key={a} value={a} className={selectItemClass}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SectionCard>
  );
}
