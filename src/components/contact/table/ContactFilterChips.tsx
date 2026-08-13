"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, Trash2, Plus, Check, Lightbulb, LightbulbOff } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Contact } from "./columns";

const filterLabels: Record<string, string> = {
  status: "Estado",
  phone: "Teléfono",
};

export const contactFilterOptions = [
  { value: "status", label: "Estado", icon: Funnel },
  { value: "phone", label: "Teléfono", icon: Funnel },
];

interface ContactFilterChipsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<any[]>>;
  table: Table<Contact>;
  onAddFilter: (filterValue: string) => void;
}

export function ContactFilterChips({
  columnFilters,
  setColumnFilters,
  table,
  onAddFilter,
}: ContactFilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);

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

  const renderRadioOption = (id: string, currentValue: any, optionValue: any, label: string, icon: React.ReactNode) => (
    <button
      key={String(optionValue)}
      className="flex items-center gap-1.5 px-1 py-0.5 w-max text-left rounded hover:bg-slate-50 transition-colors"
      onClick={() => setFilterValue(id, optionValue)}
    >
      <div className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${currentValue === optionValue ? "border-primary" : "border-slate-300"}`}>
        {currentValue === optionValue && <div className="w-1 h-1 rounded-full bg-primary" />}
      </div>
      <span className="text-gray-400">{icon}</span>
      <span className="text-xs text-[#475569]">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-nowrap items-center gap-2 px-4 py-2 border-t border-b border-gray-100 bg-white relative overflow-x-auto">
      {columnFilters.map((filter) => {
        const isStatus = filter.id === "status";
        const isPhone = filter.id === "phone";
        
        const hasValue = filter.value !== undefined && filter.value !== "" && filter.value !== false;

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

            <DropdownMenuContent align="start" sideOffset={8} className="min-w-[140px] p-1 rounded-lg border-slate-200 shadow-xl bg-white">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-medium text-[#64748b]">{filterLabels[filter.id]}</span>
                <button onClick={() => removeFilter(filter.id)} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 rounded hover:bg-slate-100">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {isStatus && (
                <div className="space-y-px">
                  {renderRadioOption(filter.id, filter.value, "Activo", "Activo", <Lightbulb className="w-3 h-3" />)}
                  {renderRadioOption(filter.id, filter.value, "Inactivo", "Inactivo", <LightbulbOff className="w-3 h-3" />)}
                </div>
              )}

              {isPhone && (
                <div className="mt-1 px-1">
                  <input 
                    type="text" 
                    autoFocus
                    placeholder="Teléfono"
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {columnFilters.length < contactFilterOptions.length && (
        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-background hover:text-primary hover:border-primary/40 focus:bg-primary/10 focus:text-primary transition-colors ml-1 shrink-0"
              title="Agregar filtro"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="min-w-[180px] rounded-xl border-slate-200 shadow-xl bg-white">
            {contactFilterOptions.map((opt) => {
              if (columnFilters.some((f) => f.id === opt.value)) return null;
              return (
                <DropdownMenuItem
                  key={opt.value}
                  className="text-xs py-1.5 cursor-pointer text-[#475569] font-medium hover:bg-background hover:text-primary focus:bg-background focus:text-primary transition-colors"
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
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:bg-gray-100 cursor-pointer transition-colors whitespace-nowrap shrink-0"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}