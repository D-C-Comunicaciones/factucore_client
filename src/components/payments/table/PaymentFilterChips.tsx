"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, Trash2, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Payment } from "@/types/payments";
import { ListOrdered, Users, Calendar, Landmark, CircleSlash, DollarSign } from "lucide-react";

const filterLabels: Record<string, string> = {
  number: "Número",
  client: "Cliente",
  created_at: "Fecha de creación",
  bank_account: "Cuenta bancaria",
  payment_status: "Estado de pago",
  amount: "Monto",
};

export const paymentFilterOptions = [
  { value: "number", label: "Número", icon: ListOrdered },
  { value: "client", label: "Cliente", icon: Users },
  { value: "created_at", label: "Fecha de creación", icon: Calendar },
  { value: "bank_account", label: "Cuenta bancaria", icon: Landmark },
  { value: "payment_status", label: "Estado de pago", icon: CircleSlash },
  { value: "amount", label: "Monto", icon: DollarSign },
];

const MOCK_BANK_ACCOUNTS = [
  "Tarjeta de crédito empresarial",
  "Banco 1",
  "Caja general",
  "Caja chica"
];

const PAYMENT_STATUSES = [
  "No conciliado",
  "Conciliado",
  "Anulado"
];

interface PaymentFilterChipsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<any[]>>;
  table: Table<Payment>;
  onAddFilter: (filterValue: string) => void;
}

export function PaymentFilterChips({
  columnFilters,
  setColumnFilters,
  table,
  onAddFilter,
}: PaymentFilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);
  const [bankSearch, setBankSearch] = React.useState("");

  if (columnFilters.length === 0) return null;

  const removeFilter = (id: string) => {
    setColumnFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const removeAllFilters = () => {
    setColumnFilters([]);
  };

  const setFilterValue = (id: string, value: any) => {
    setColumnFilters((prev) =>
      prev.map((f: any) => (f.id === id ? { ...f, value } : f))
    );
  };

  const renderRadioOption = (id: string, currentValue: any, optionValue: any, label: string) => (
    <button
      key={String(optionValue)}
      className="flex items-center gap-2 px-1 py-1 w-full text-left rounded hover:bg-slate-50 transition-colors"
      onClick={() => setFilterValue(id, optionValue)}
    >
      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${currentValue === optionValue ? "border-primary" : "border-slate-300"}`}>
        {currentValue === optionValue && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
      </div>
      <span className="text-xs text-[#475569]">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-nowrap items-center gap-2 px-4 py-2 border-t border-b border-gray-100 bg-white relative overflow-x-auto">
      {columnFilters.map((filter) => {
        const isText = ["number", "client", "created_at"].includes(filter.id);
        const isAmount = filter.id === "amount";
        const isStatus = filter.id === "payment_status";
        const isBank = filter.id === "bank_account";

        const hasValue = filter.value !== undefined && filter.value !== "";

        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <button 
                className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs transition-colors focus:outline-none shrink-0 ${
                  hasValue
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-[#475569] hover:bg-slate-50"
                }`}
                type="button"
              >
                <Funnel className={`w-3 h-3 mr-1 ${hasValue ? "text-primary" : "text-[#94a3b8]"}`} />
                {filterLabels[filter.id]}
                <svg className={`w-3 h-3 ml-1 ${hasValue ? "text-primary" : "text-[#94a3b8]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" sideOffset={8} className="min-w-[220px] p-2 rounded-2xl border-slate-200 shadow-xl bg-white">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-medium text-[#64748b]">{filterLabels[filter.id]}</span>
                <button onClick={() => removeFilter(filter.id)} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 rounded hover:bg-slate-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {isStatus && (
                <div className="space-y-0.5">
                  {PAYMENT_STATUSES.map(s => renderRadioOption(filter.id, filter.value, s, s))}
                </div>
              )}

              {isBank && (
                <div className="px-1 space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input 
                      type="text"
                      placeholder="Buscar"
                      className="w-full h-8 pl-8 pr-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                    />
                  </div>
                  <div className="space-y-0.5 max-h-32 overflow-y-auto">
                    {MOCK_BANK_ACCOUNTS.filter(w => w.toLowerCase().includes(bankSearch.toLowerCase())).map(w => (
                      renderRadioOption(filter.id, filter.value, w, w)
                    ))}
                    {MOCK_BANK_ACCOUNTS.filter(w => w.toLowerCase().includes(bankSearch.toLowerCase())).length === 0 && (
                      <p className="text-xs text-slate-500 py-1 px-1">No hay resultados</p>
                    )}
                  </div>
                </div>
              )}

              {isText && (
                <div className="mt-1 px-1">
                  <input 
                    type={filter.id === 'created_at' ? 'date' : 'text'}
                    autoFocus
                    placeholder={filterLabels[filter.id]}
                    className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                    defaultValue={filter.value as string}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setFilterValue(filter.id, e.currentTarget.value);
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        setFilterValue(filter.id, e.target.value.trim());
                      } else {
                        setFilterValue(filter.id, "");
                      }
                    }}
                  />
                </div>
              )}

              {isAmount && (
                <div className="mt-1 px-1">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder={filterLabels[filter.id]}
                    className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                    defaultValue={filter.value as string}
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(/[^\d.]/g, '');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        let val = e.currentTarget.value;
                        if (val && !val.includes('.')) {
                          val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          e.currentTarget.value = val;
                        }
                        setFilterValue(filter.id, val);
                      }
                    }}
                    onBlur={(e) => {
                      let val = e.target.value;
                      if (val) {
                        if (!val.includes('.')) {
                          val = val.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                          e.target.value = val;
                        }
                        setFilterValue(filter.id, val);
                      } else {
                        setFilterValue(filter.id, "");
                      }
                    }}
                  />
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {columnFilters.length < paymentFilterOptions.length && (
        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors ml-1 shrink-0"
              title="Agregar filtro"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="min-w-[180px] rounded-xl border-slate-200 shadow-xl bg-white">
            {paymentFilterOptions.map((opt) => {
              if (columnFilters.some((f) => f.id === opt.value)) return null;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  className="text-xs py-1.5 cursor-pointer text-[#475569] font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                  onClick={() => {
                    onAddFilter(opt.value);
                    setShowPlusFilter(false);
                  }}
                >
                  <opt.icon className="w-3.5 h-3.5 mr-2 text-[#94a3b8]" />
                  {opt.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <button
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:no-underline whitespace-nowrap shrink-0"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}
