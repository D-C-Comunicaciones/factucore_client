"use client";

import * as React from "react";
import { SectionCard } from "./SectionCard";

const CUSTOM_FIELDS = ["Código interno", "Proveedor", "Marca", "Color", "Talla"];

export function AdditionalFieldsSection() {
  const [search, setSearch] = React.useState("");

  return (
    <SectionCard title="Campos adicionales" defaultOpen={true}>
      <p className="text-sm text-muted-foreground mb-4">
        Conoce cómo crear campos personalizables aquí.
      </p>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Buscar</label>
        <div className="flex gap-2">
          <select
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 h-8 px-3 border border-foreground/20 rounded-md text-sm bg-white outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors text-muted-foreground"
          >
            <option value="">Buscar</option>
            {CUSTOM_FIELDS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <button
            type="button"
            className="h-8 px-4 text-primary text-sm font-bold rounded-lg hover:bg-background transition-all cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
