"use client";

import { SectionCard } from "./SectionCard";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

const ACCOUNT_OPTIONS = ["Ventas", "Ingresos operacionales", "Otros ingresos"];
const INVENTORY_ACCOUNTS = ["Inventarios", "Mercancía", "Materia prima"];
const COST_ACCOUNTS = ["Costos del inventario", "Costo de ventas", "Costos directos"];

export function AccountingSection() {
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
          <select
            value={saleAccount}
            onChange={(e) => setSaleAccount(e.target.value)}
            className="w-full h-8 px-3 border border-foreground/20 rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
          >
            {ACCOUNT_OPTIONS.map((a) => <option key={a}>{a}</option>)}
          </select>
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
          <select
            value={inventoryAccount}
            onChange={(e) => setInventoryAccount(e.target.value)}
            className="w-full h-8 px-3 border border-foreground/20 rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
          >
            {INVENTORY_ACCOUNTS.map((a) => <option key={a}>{a}</option>)}
          </select>
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
        <select
          value={costAccount}
          onChange={(e) => setCostAccount(e.target.value)}
          className="w-full h-8 px-3 border border-foreground/20 rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors"
        >
          {COST_ACCOUNTS.map((a) => <option key={a}>{a}</option>)}
        </select>
      </div>
    </SectionCard>
  );
}
