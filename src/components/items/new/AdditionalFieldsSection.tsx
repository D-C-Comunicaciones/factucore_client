"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { SectionCard } from "./SectionCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CUSTOM_FIELDS = ["Código interno", "Proveedor", "Marca", "Color", "Talla"];

const selectItemClass = "rounded-lg cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 data-[state=checked]:bg-primary/10 data-[state=checked]:text-primary";

export function AdditionalFieldsSection({
  customFields,
  onCustomFieldsChange,
  catalogs
}: {
  customFields: any[],
  onCustomFieldsChange: (v: any[]) => void,
  catalogs: any
}) {
  const baseInput = "bg-white h-[34px] pl-3 pr-3 text-sm border border-foreground/20 shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none flex items-center w-full rounded-xl box-border";
  const [search, setSearch] = React.useState("");

  return (
    <SectionCard title="Campos adicionales" defaultOpen={true}>
      <p className="text-sm text-muted-foreground mb-4">
        Conoce cómo crear campos personalizables aquí.
      </p>
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Buscar</label>
        <div className="flex gap-2">
          <Select value={search} onValueChange={setSearch}>
            <SelectTrigger className={cn(baseInput, "flex-1 justify-between pr-2")}>
              <SelectValue placeholder="Buscar" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-border rounded-xl shadow-xl">
              {CUSTOM_FIELDS.map((f) => (
                <SelectItem key={f} value={f} className={selectItemClass}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button
            type="button"
            className="h-8 px-4 text-primary text-sm font-bold rounded-lg hover:bg-primary/5 transition-all cursor-pointer"
          >
            Agregar
          </button>
        </div>
      </div>
    </SectionCard>
  );
}
