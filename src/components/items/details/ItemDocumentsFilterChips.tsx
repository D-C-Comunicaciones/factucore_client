"use client";

import * as React from "react";
import { Funnel, X, Plus, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DateFilterPopoverInline } from "@/components/ui/DateFilterPopoverInline";
import { cn } from "@/lib/utils";

interface FilterField {
  label: string;
  id: string;
  icon: React.ReactNode;
  type?: "text" | "date" | "status";
  /** Pre-defined options shown as radio buttons (used when type === "status") */
  options?: string[];
}

interface ItemDocumentsFilterChipsProps {
  fields: FilterField[];
  filters: { id: string; value: any }[];
  setFilters: React.Dispatch<React.SetStateAction<{ id: string; value: any }[]>>;
  /** Per-tab list of status options to show for "estado" filters */
  statusOptions?: string[];
}

/* ── inline radio-button option list ── */
function StatusOptionsList({
  options,
  currentValue,
  onSelect,
}: {
  options: string[];
  currentValue: string;
  onSelect: (v: string) => void;
}) {
  const statusColor = (s: string) => {
    if (["Por cobrar", "Por pagar", "Pendiente"].includes(s)) return "text-amber-600";
    if (["Anulada", "Anulado", "Inactivo"].includes(s)) return "text-red-500";
    if (["Pagada", "Activo", "Recibido"].includes(s)) return "text-emerald-600";
    if (["Facturado"].includes(s)) return "text-blue-600";
    if (["Borrador"].includes(s)) return "text-slate-400";
    return "text-slate-700";
  };

  return (
    <ul className="space-y-0.5">
      {options.map((opt) => {
        const active = currentValue === opt;
        return (
          <li key={opt}>
            <button
              type="button"
              onClick={() => onSelect(active ? "" : opt)}
              className={cn(
                "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left",
                active
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-slate-50 text-slate-700"
              )}
            >
              {/* radio circle */}
              <span className={cn(
                "flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                active ? "border-primary bg-primary" : "border-slate-300 bg-white"
              )}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
              </span>
              <span className={statusColor(opt)}>{opt}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export function ItemDocumentsFilterChips({
  fields,
  filters,
  setFilters,
  statusOptions = [],
}: ItemDocumentsFilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);

  if (filters.length === 0) return null;

  const removeFilter = (id: string) =>
    setFilters((prev) => prev.filter((f) => f.id !== id));

  const removeAllFilters = () => setFilters([]);

  const setFilterValue = (id: string, value: any) => {
    let finalValue = value;
    if (value instanceof Date) {
      const year  = value.getFullYear();
      const month = String(value.getMonth() + 1).padStart(2, "0");
      const day   = String(value.getDate()).padStart(2, "0");
      finalValue = `${year}-${month}-${day}`;
    }
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, value: finalValue } : f)));
  };

  const getFieldInfo = (id: string) => fields.find((f) => f.id === id);

  return (
    <div className="flex flex-nowrap items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white relative overflow-x-auto">
      {filters.map((filter) => {
        const fieldInfo = getFieldInfo(filter.id);
        if (!fieldInfo) return null;

        const hasValue =
          filter.value !== undefined && filter.value !== "" && filter.value !== false;

        const isDate = filter.id === "creacion" || filter.id === "vencimiento" ||
                       filter.id === "fecha" || filter.id === "fecha_entrega";
        const isEstado = filter.id === "estado";

        /* formatted display value */
        const displayValue = (() => {
          if (!hasValue) return null;
          if (isDate && typeof filter.value === "string") {
            const parts = filter.value.split("-");
            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
            const d = new Date(filter.value);
            return !isNaN(d.getTime()) ? d.toLocaleDateString() : filter.value;
          }
          return filter.value;
        })();

        return (
          <DropdownMenu key={filter.id}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-full border text-xs transition-colors focus:outline-none shrink-0",
                  hasValue
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-slate-200 bg-white text-[#475569] hover:bg-slate-50"
                )}
              >
                <Funnel className={cn("w-3 h-3 mr-1", hasValue ? "text-primary" : "text-[#94a3b8]")} />
                {fieldInfo.label}
                {hasValue && (
                  <span className="font-normal text-slate-500 ml-1.5 border-l border-slate-200 pl-1.5">
                    {displayValue}
                  </span>
                )}
                <svg
                  className={cn("w-3 h-3 ml-1", hasValue ? "text-primary" : "text-[#94a3b8]")}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={8}
              className="min-w-[220px] p-2 rounded-2xl border-slate-200 shadow-xl bg-white"
            >
              {/* header */}
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-[#64748b]">{fieldInfo.label}</span>
                <button
                  onClick={() => removeFilter(filter.id)}
                  className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 rounded hover:bg-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* input area */}
              <div className="mt-1 px-1">
                {isEstado && statusOptions.length > 0 ? (
                  <StatusOptionsList
                    options={statusOptions}
                    currentValue={filter.value as string}
                    onSelect={(v) => setFilterValue(filter.id, v)}
                  />
                ) : isDate ? (
                  <DateFilterPopoverInline
                    filter={filter}
                    setFilterValue={(val) => setFilterValue(filter.id, val)}
                  />
                ) : (
                  <input
                    type="text"
                    autoFocus
                    placeholder={fieldInfo.label}
                    className="w-full h-8 px-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                    defaultValue={filter.value as string}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setFilterValue(filter.id, e.currentTarget.value);
                    }}
                    onBlur={(e) => {
                      setFilterValue(filter.id, e.target.value.trim());
                    }}
                  />
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {/* + add another filter */}
      {filters.length < fields.length && (
        <DropdownMenu open={showPlusFilter} onOpenChange={setShowPlusFilter}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 bg-white text-slate-400 hover:bg-primary/10 hover:text-primary hover:border-primary/40 transition-colors ml-1 shrink-0"
              title="Agregar filtro"
            >
              <Plus className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={4} className="min-w-[180px] rounded-xl border-slate-200 shadow-xl bg-white">
            {fields.map((opt) => {
              if (filters.some((f) => f.id === opt.id)) return null;
              return (
                <DropdownMenuItem
                  key={opt.id}
                  className="text-xs py-1.5 cursor-pointer text-[#475569] font-medium hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary transition-colors"
                  onClick={() => {
                    setFilters((prev) => [...prev, { id: opt.id, value: "" }]);
                    setShowPlusFilter(false);
                  }}
                >
                  <span className="w-3.5 h-3.5 mr-2 text-[#94a3b8] flex items-center justify-center">{opt.icon}</span>
                  {opt.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <button
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none whitespace-nowrap shrink-0"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}
