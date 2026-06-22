import { useState, useCallback, useMemo } from "react";
import type { RowSelectionState, OnChangeFn } from "@tanstack/react-table";

/**
 * useRowSelection — Hook genérico para gestión de selección de filas.
 *
 * Diseñado para ser reutilizable en cualquier tabla de la app.
 *
 * Integración con TanStack Table:
 *   Pasa `rowSelection` y `onRowSelectionChange` directamente a useReactTable.
 *   TanStack maneja toda la lógica interna (toggle, selectAll, indeterminate).
 *   Este hook solo expone el estado y utilidades derivadas hacia afuera.
 *
 * Uso:
 *   const { rowSelection, onRowSelectionChange, selectedIds, hasSelection, clear } = useRowSelection();
 *
 *   const table = useReactTable({
 *     ...
 *     state: { rowSelection },
 *     onRowSelectionChange,
 *     enableRowSelection: true,
 *     getRowId: (row) => String(row.id),
 *   });
 *
 * Acciones masivas:
 *   if (hasSelection) {
 *     await doSomethingWith([...selectedIds]);
 *   }
 */
export function useRowSelection() {
  // Estado controlado compatible con useReactTable: { [rowId: string]: boolean }
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  /**
   * Handler compatible con `onRowSelectionChange` de TanStack Table.
   * TanStack puede llamarlo con un updater function o un valor directo.
   */
  const onRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updater) => {
      setRowSelection((prev) =>
        typeof updater === "function" ? updater(prev) : updater
      );
    },
    []
  );

  /**
   * Set<number> con los IDs seleccionados.
   * Fuente de verdad para acciones masivas (enviar DIAN, descargar PDF, etc.)
   */
  const selectedIds = useMemo(
    () => new Set(Object.keys(rowSelection).map(Number)),
    [rowSelection]
  );

  /** Número de filas seleccionadas */
  const count = selectedIds.size;

  /** true si hay al menos una fila seleccionada */
  const hasSelection = count > 0;

  /** Deselecciona todo (útil para el botón cancelar de bulk actions) */
  const clear = useCallback(() => setRowSelection({}), []);

  return {
    // ── Para useReactTable ─────────────────────────────────────────────
    rowSelection,
    onRowSelectionChange,

    // ── Para UI de acciones masivas ────────────────────────────────────
    selectedIds,
    count,
    hasSelection,
    clear,
  };
}
