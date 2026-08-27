"use client";

import { useState, useCallback, useMemo } from "react";

/**
 * useTableSelection — selección de filas compartida por todas las tablas de la app
 * (items, contactos, pagos, facturas, devoluciones, etc.)
 *
 * Reemplaza las implementaciones ad-hoc de "seleccionar todo" que existían
 * duplicadas (y en algunos casos rotas o sin conectar) en cada tabla.
 *
 * Uso:
 *   const sel = useTableSelection(rows, (row) => String(row.id));
 *   <SelectAllCheckbox allSelected={sel.allSelected} someSelected={sel.someSelected} onToggle={sel.toggleAll} />
 *   <SelectRowCheckbox checked={sel.isSelected(row)} onToggle={() => sel.toggle(getId(row))} />
 */
export function useTableSelection<T>(
  items: T[],
  getId: (item: T) => string
) {
  const [selection, setSelection] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  }, []);

  const toggleAll = useCallback(
    (value: boolean) => {
      setSelection((prev) => {
        const next = { ...prev };
        items.forEach((item) => {
          const id = getId(item);
          if (value) {
            next[id] = true;
          } else {
            delete next[id];
          }
        });
        return next;
      });
    },
    [items, getId]
  );

  const isSelected = useCallback(
    (item: T) => Boolean(selection[getId(item)]),
    [selection, getId]
  );

  const allSelected =
    items.length > 0 && items.every((item) => selection[getId(item)] === true);

  const someSelected = items.some((item) => selection[getId(item)] === true);

  const selectedCount = Object.keys(selection).length;

  const selectedItems = useMemo(
    () => items.filter((item) => selection[getId(item)]),
    [items, selection, getId]
  );

  const clear = useCallback(() => setSelection({}), []);

  return {
    selection,
    setSelection,
    toggle,
    toggleAll,
    isSelected,
    allSelected,
    someSelected,
    selectedCount,
    selectedItems,
    clear,
  };
}
