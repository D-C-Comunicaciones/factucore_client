"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, FileText, Search, Filter, SortDesc, Calendar, MoreHorizontal, ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";

export function ReturnsTable() {
  const router = useRouter();
  
  // State for showing filters to match the screenshot UX
  const [activeFilters, setActiveFilters] = useState<string[]>(["numero", "fecha", "estado"]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col w-full h-full min-h-[500px]">
      {/* TOOLBAR */}
      <div className="flex flex-col border-b border-gray-200">
        <div className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center bg-white rounded-t-lg">
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar" 
                className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary pl-9"
              />
            </div>
            
            {/* Filter Menu Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-gray-200 bg-transparent shadow-sm hover:bg-gray-100 hover:text-gray-900 h-9 px-4 py-2">
                  <Filter className="h-4 w-4 mr-2 text-gray-500" />
                  Filtrar
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2" align="start">
                <div className="text-xs text-gray-500 font-medium px-2 py-1.5 mb-1">Filtrar Por</div>
                <div className="flex flex-col gap-1">
                  <button className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left">
                    <SortDesc className="h-4 w-4 text-slate-500" />
                    Número
                  </button>
                  <button className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Fecha de creación
                  </button>
                  <button className="flex items-center gap-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    Estado DIAN
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* ACTIVE FILTERS ROW (From Screenshot) */}
        {activeFilters.length > 0 && (
          <div className="px-4 py-3 bg-slate-50/50 flex items-center justify-between border-t border-gray-100">
            <div className="flex flex-wrap gap-2 items-center">
              
              {/* Número Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 h-8 px-3 text-sm font-medium border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-slate-700 transition-colors">
                    <SortDesc className="h-4 w-4 text-slate-500" />
                    Número
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Número</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <input type="text" className="w-full h-9 px-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40" />
                </PopoverContent>
              </Popover>

              {/* Fecha de creación Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 h-8 px-3 text-sm font-medium border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-slate-700 transition-colors">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    Fecha de creación
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-3" align="start">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Fecha de creación</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-md overflow-hidden">
                     <DatePickerSimple />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Estado DIAN Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="inline-flex items-center gap-2 h-8 px-3 text-sm font-medium border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-slate-700 transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                    Estado DIAN
                    <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-3" align="start">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">Estado DIAN</span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <Checkbox className="rounded shadow-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      Emitida
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <Checkbox className="rounded shadow-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      En proceso
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <Checkbox className="rounded shadow-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      Por emitir
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <Checkbox className="rounded shadow-none border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                      No electrónica
                    </label>
                  </div>
                </PopoverContent>
              </Popover>

            </div>
            
            <button 
              className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              onClick={() => setActiveFilters([])}
            >
              Remover filtros
            </button>
          </div>
        )}
      </div>

      {/* TABLE BODY (Empty State) */}
      <div className="flex-1 flex flex-col items-center justify-center py-8 bg-white">
        <div className="flex h-full flex-col items-center justify-center">
          <div className="w-16 h-16 flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-primary opacity-80" strokeWidth={1.5} />
          </div>
          <div className="max-w-[520px] text-center text-[40px] font-semibold leading-tight text-primary mb-2">
            Aun no has creado devoluciones
          </div>
          <div className="text-sm text-gray-500 mb-6 font-medium">
            Crea una devolución para empezar a registrar tus devoluciones en ventas
          </div>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-[10px] bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
            onClick={() => router.push("/returns/new")}
          >
            <Plus className="h-3.5 w-3.5" />
            Nueva devolución
          </button>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-between bg-white rounded-b-lg">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <p>Ítems por página:</p>
          <select className="h-8 rounded-md border border-gray-200 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span className="ml-4 pl-4 border-l border-gray-200">1-1 De 1</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Página</span>
          <input type="number" defaultValue={1} className="w-12 h-8 rounded-md border border-gray-200 px-2 text-center focus:outline-none focus:ring-1 focus:ring-primary" />
          <span>De 1</span>
          <div className="flex items-center ml-2">
            <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 transition-colors" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left w-5 h-5"><path d="m15 18-6-6 6-6"></path></svg>
            </button>
            <button className="p-1 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-50 transition-colors" disabled>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right w-5 h-5"><path d="m9 18 6-6-6-6"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
