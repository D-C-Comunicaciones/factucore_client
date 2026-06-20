"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";

export function ContactAssociatedPersons() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
      >
        <div>
          <span className="text-sm font-semibold text-slate-800">Personas asociadas</span>
          <p className="text-xs text-slate-400 font-normal mt-0.5">Vincula los datos de personas relacionadas a este contacto</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
      </button>

      <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-5 border-t border-gray-100 bg-white">
            <button
              type="button"
              className="py-1.5 px-3 border border-primary/50 text-primary hover:bg-primary/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Asociar persona
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
