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

import { useCatalogs } from "@/hooks/useCatalogs";

const selectItemClass = "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

export function AccountingSection({
  salesAccountId,
  setSalesAccountId,
  inventoryAccountId,
  setInventoryAccountId,
  costAccountId,
  setCostAccountId,
}: {
  salesAccountId: number | undefined;
  setSalesAccountId: (id: number | undefined) => void;
  inventoryAccountId: number | undefined;
  setInventoryAccountId: (id: number | undefined) => void;
  costAccountId: number | undefined;
  setCostAccountId: (id: number | undefined) => void;
}) {
  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";
  const { salesAccounts, inventoryAccounts, costAccounts } = useCatalogs();

  React.useEffect(() => {
    if (!salesAccountId && salesAccounts.length > 0) {
      setSalesAccountId(salesAccounts[0].id);
    }
    if (!inventoryAccountId && inventoryAccounts.length > 0) {
      setInventoryAccountId(inventoryAccounts[0].id);
    }
    if (!costAccountId && costAccounts.length > 0) {
      setCostAccountId(costAccounts[0].id);
    }
  }, [salesAccounts, inventoryAccounts, costAccounts, salesAccountId, inventoryAccountId, costAccountId, setSalesAccountId, setInventoryAccountId, setCostAccountId]);

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
                <span tabIndex={0} className="cursor-help outline-none"><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores por ventas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={salesAccountId?.toString() || ""} onValueChange={(val) => setSalesAccountId(parseInt(val))}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
              {salesAccounts.map((a: any) => (
                <SelectItem key={a.id} value={a.id.toString()} className={selectItemClass}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 flex items-center gap-1">
            Cuenta de inventario
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0} className="cursor-help outline-none"><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
                Selecciona la cuenta contable en la que se registrarán los valores de entradas y salidas del producto.
              </TooltipContent>
            </Tooltip>
          </label>
          <Select value={inventoryAccountId?.toString() || ""} onValueChange={(val) => setInventoryAccountId(parseInt(val))}>
            <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
              {inventoryAccounts.map((a: any) => (
                <SelectItem key={a.id} value={a.id.toString()} className={selectItemClass}>{a.name}</SelectItem>
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
              <span><HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" /></span>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-[#1e293b] text-white max-w-xs">
              Selecciona la cuenta contable en la que se registrarán el valor del costo de venta del producto.
            </TooltipContent>
          </Tooltip>
        </label>
        <Select value={costAccountId?.toString() || ""} onValueChange={(val) => setCostAccountId(parseInt(val))}>
          <SelectTrigger className={cn(baseInput, "justify-between pr-2")}>
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
            {costAccounts.map((a: any) => (
              <SelectItem key={a.id} value={a.id.toString()} className={selectItemClass}>{a.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </SectionCard>
  );
}
