"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useContactForm } from "./ContactFormProvider";

interface ContactAccountingInfoProps {
  catalogData?: any;
}

export function ContactAccountingInfo({ catalogData }: ContactAccountingInfoProps) {
  const [expanded, setExpanded] = useState(true);
  const { accountsReceivableAccountId, setAccountsReceivableAccountId, accountsPayableAccountId, setAccountsPayableAccountId } = useContactForm();

  const receivableAccounts = catalogData?.receivableAccounts?.map((acc: any) => ({
    value: acc.id.toString(),
    label: `${acc.code} - ${acc.name}`,
  })) || [];

  const payableAccounts = catalogData?.payableAccounts?.map((acc: any) => ({
    value: acc.id.toString(),
    label: `${acc.code} - ${acc.name}`,
  })) || [];

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">Configuración para contabilidad</span>
          <p className="text-xs text-slate-400 font-normal mt-0.5">
            Elige las cuentas contables que recibirán los movimientos de valores pendientes de pago. 
            <span className="text-primary cursor-pointer hover:underline ml-1">Ver más</span>
          </p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <TooltipProvider>
          <div className="p-5 border-t border-gray-100 bg-white space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  Cuenta por cobrar
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-800 text-xs">
                      Si la cuenta que deseas asignar no está en el listado, ingresa al Catálogo de cuentas y establece su uso como 'Cuentas por cobrar'. <span className="underline cursor-pointer font-semibold ml-1">Aprende cómo</span>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <SearchableSelect
                  value={accountsReceivableAccountId}
                  onValueChange={setAccountsReceivableAccountId}
                  options={receivableAccounts}
                  placeholder="Cuentas por cobrar clien..."
                  className="w-full text-foreground border-gray-300"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                  Cuenta por pagar
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-800 text-white border-slate-800 text-xs">
                      Si la cuenta que deseas asignar no está en el listado, ingresa al Catálogo de cuentas y establece su uso como 'Cuentas por pagar'. <span className="underline cursor-pointer font-semibold ml-1">Aprende cómo</span>
                    </TooltipContent>
                  </Tooltip>
                </label>
                <SearchableSelect
                  value={accountsPayableAccountId}
                  onValueChange={setAccountsPayableAccountId}
                  options={payableAccounts}
                  placeholder="Cuentas por pagar a pro..."
                  className="w-full text-foreground border-gray-300"
                />
              </div>
            </div>
          </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
