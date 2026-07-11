"use client";

import * as React from "react";
import { Table, ColumnFiltersState } from "@tanstack/react-table";
import { Funnel, X, Trash2, Plus, Search, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ItemListResponse as Item } from "@/types/items";
import { useCatalogs } from "@/hooks/useCatalogs";

const filterLabels: Record<string, string> = {
  type: "Tipo",
  active: "Estado",
  reference: "Referencia",
  description: "Descripción",
  price: "Precio",
  warehouse: "Bodega",
  category: "Categoría",
  inventariable: "Inventariable",
};

export const itemFilterOptions = [
  { value: "type", label: "Tipo", icon: Funnel },
  { value: "active", label: "Estado", icon: Funnel },
  { value: "reference", label: "Referencia", icon: Funnel },
  { value: "description", label: "Descripción", icon: Funnel },
  { value: "price", label: "Precio", icon: Funnel },
  { value: "warehouse", label: "Bodega", icon: Funnel },
  { value: "category", label: "Categoría", icon: Funnel },
  { value: "inventariable", label: "Inventariable", icon: Funnel },
];

// Mock data for Bodega (can be replaced similarly if needed)
const MOCK_WAREHOUSES = ["Principal", "aa"];

interface ItemFilterChipsProps {
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<any[]>>;
  table: Table<Item>;
  onAddFilter: (filterValue: string) => void;
}

export function ItemFilterChips({
  columnFilters,
  setColumnFilters,
  table,
  onAddFilter,
}: ItemFilterChipsProps) {
  const [showPlusFilter, setShowPlusFilter] = React.useState(false);

  // States for search inputs in popovers
  const [warehouseSearch, setWarehouseSearch] = React.useState("");
  const [categorySearch, setCategorySearch] = React.useState("");

  const { categories = [] } = useCatalogs();
  const categoryOptions = categories.map((c: any) => c.name).filter(Boolean);

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
        const isType = filter.id === "type";
        const isState = filter.id === "active";
        const isText = ["reference", "description"].includes(filter.id);
        const isPrice = filter.id === "price";
        const isWarehouse = filter.id === "warehouse";
        const isCategory = filter.id === "category";
        const isInventoriable = filter.id === "inventariable";
        
        // Para el filtro "active", false es un valor v\u00e1lido (Inactivo)
        const hasValue = filter.value !== undefined && filter.value !== "" &&
          (filter.id === "active" ? filter.value !== undefined : filter.value !== false);

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
              
              {isType && (
                <div className="space-y-0.5">
                  {renderRadioOption(filter.id, filter.value, "producto", "Producto")}
                  {renderRadioOption(filter.id, filter.value, "servicio", "Servicio")}
                  {renderRadioOption(filter.id, filter.value, "combo", "Combo")}
                </div>
              )}

              {isState && (
                <div className="space-y-0.5">
                  {renderRadioOption(filter.id, filter.value, true, "Activo")}
                  {renderRadioOption(filter.id, filter.value, false, "Inactivo")}
                </div>
              )}

              {isText && (
                <div className="mt-1 px-1">
                  <input 
                    type="text" 
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

              {isPrice && (
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

              {isWarehouse && (
                <div className="px-1 space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input 
                      type="text"
                      placeholder="Buscar"
                      className="w-full h-8 pl-8 pr-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                      value={warehouseSearch}
                      onChange={(e) => setWarehouseSearch(e.target.value)}
                    />
                  </div>
                  <div className="space-y-0.5 max-h-28 overflow-y-auto">
                    {MOCK_WAREHOUSES.filter(w => w.toLowerCase().includes(warehouseSearch.toLowerCase())).map(w => (
                      renderRadioOption(filter.id, filter.value, w, w)
                    ))}
                    {MOCK_WAREHOUSES.filter(w => w.toLowerCase().includes(warehouseSearch.toLowerCase())).length === 0 && (
                      <p className="text-xs text-slate-500 py-1 px-1">No hay resultados</p>
                    )}
                  </div>
                </div>
              )}

              {isCategory && (
                <div className="px-1 space-y-1.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                    <input 
                      type="text"
                      placeholder="Buscar"
                      className="w-full h-8 pl-8 pr-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-[#94a3b8] text-[#0f172a]"
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                    />
                  </div>
                  <div className="space-y-0.5 max-h-28 overflow-y-auto">
                    {categoryOptions.filter((c: string) => c.toLowerCase().includes(categorySearch.toLowerCase())).map((c: string) => (
                      renderRadioOption(filter.id, filter.value, c, c)
                    ))}
                    {categoryOptions.filter((c: string) => c.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                      <p className="text-xs text-[#64748b] py-1 px-1">No hay resultados</p>
                    )}
                  </div>
                </div>
              )}

              {isInventoriable && (
                <div className="px-1">
                  <button
                    className="flex items-center gap-2 px-1 py-1 w-full text-left rounded hover:bg-slate-50 transition-colors"
                    onClick={() => setFilterValue(filter.id, filter.value ? "" : true)}
                  >
                    <div className={`w-3.5 h-3.5 rounded-[4px] border flex items-center justify-center shrink-0 ${filter.value ? "border-primary bg-primary" : "border-slate-300"}`}>
                      {filter.value ? <Check className="w-2.5 h-2.5 text-white" /> : null}
                    </div>
                    <span className="text-xs text-[#475569]">Inventariable</span>
                  </button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      })}

      {columnFilters.length < itemFilterOptions.length && (
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
            {itemFilterOptions.map((opt) => {
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
        className="ml-auto text-xs text-black font-medium px-2 py-1 rounded focus:outline-none hover:bg-gray-100 cursor-pointer transition-colors whitespace-nowrap shrink-0"
        style={{ textDecoration: "none" }}
        onClick={removeAllFilters}
      >
        Remover filtros
      </button>
    </div>
  );
}
