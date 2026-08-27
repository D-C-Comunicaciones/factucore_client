"use client";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

/**
 * Checkbox de encabezado ("seleccionar todo") compartido por todas las tablas.
 * Usar junto con useTableSelection (o el estado de selección equivalente).
 */
export function SelectAllCheckbox({
  allSelected,
  someSelected,
  onToggle,
  className,
}: {
  allSelected: boolean;
  someSelected: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}) {
  return (
    <Checkbox
      className={cn(className)}
      checked={allSelected ? true : someSelected ? "indeterminate" : false}
      onClick={(e) => e.stopPropagation()}
      onCheckedChange={(value) => onToggle(value === true)}
      aria-label="Seleccionar todos"
    />
  );
}

/**
 * Checkbox de fila compartido por todas las tablas.
 */
export function SelectRowCheckbox({
  checked,
  onToggle,
  className,
}: {
  checked: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <div data-no-row-select="true" onClick={(e) => e.stopPropagation()}>
      <Checkbox
        className={cn(className)}
        checked={checked}
        onCheckedChange={() => onToggle()}
        aria-label="Seleccionar fila"
      />
    </div>
  );
}
