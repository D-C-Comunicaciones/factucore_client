"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, X, Lightbulb, ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

/* -----------------------------------------------------------------------
   Tipos
   ----------------------------------------------------------------------- */
export interface CostCenter {
  id: number;
  code: string;
  name: string;
  created_at: string;
  description: string;
  status: number | boolean;
}

/* -----------------------------------------------------------------------
   Header de columna sortable reutilizable
   ----------------------------------------------------------------------- */
function SortableHeader({
  column,
  label,
}: {
  column: { getIsSorted: () => false | "asc" | "desc"; toggleSorting: (desc: boolean) => void; clearSorting: () => void };
  label: string;
}) {
  const isSorted = column.getIsSorted();

  const handleSort = () => {
    if (!isSorted) column.toggleSorting(false);
    else if (isSorted === "desc") column.toggleSorting(true);
    else column.clearSorting();
  };

  return (
    <button
      className={`flex items-center justify-center gap-1 w-full px-2 py-1 rounded group transition-colors duration-100 cursor-pointer ${isSorted ? "bg-primary/10" : "hover:bg-accent"
        }`}
      onClick={handleSort}
      tabIndex={0}
      type="button"
      style={{ background: "none" }}
    >
      <span className="text-xs font-medium text-gray-700">{label}</span>
      <span style={{ width: 16, display: "inline-flex", justifyContent: "center" }}>
        {isSorted === "desc" && <ArrowUp className="w-4 h-4 ml-1 text-black" />}
        {isSorted === "asc" && <ArrowDown className="w-4 h-4 ml-1 text-black" />}
        {!isSorted && (
          <ArrowUp className="w-4 h-4 ml-1 text-black opacity-0 group-hover:opacity-60 transition-opacity duration-100" />
        )}
      </span>
    </button>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones
   ----------------------------------------------------------------------- */
function ActionsCell({
  costCenter,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  costCenter: CostCenter;
  onEdit: (cc: CostCenter) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:!bg-primary/10 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onEdit(costCenter); }}
            >
              <Pencil className="h-4 w-4 text-slate-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1e293b] text-white border-none" side="top">
            <p className="font-medium">Editar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:!bg-destructive/10 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onDelete(costCenter.id); }}
            >
              <X className="h-4 w-4 text-slate-700" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1e293b] text-white border-none" side="top">
            <p className="font-medium">Eliminar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:!bg-yellow-100 transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); onToggleStatus(costCenter.id); }}
            >
              <Lightbulb
                className={
                  costCenter.status
                    ? "h-4 w-4 text-yellow-500 fill-yellow-500"
                    : "h-4 w-4 text-slate-700"
                }
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1e293b] text-white border-none" side="top">
            <p className="font-medium">{costCenter.status ? "Inactivar" : "Activar"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Factory de columnas
   ----------------------------------------------------------------------- */
export function getColumns(callbacks: {
  onEdit: (cc: CostCenter) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}): ColumnDef<CostCenter>[] {
  return [
    {
      accessorKey: "code",
      header: ({ column }) => <SortableHeader column={column} label="Código" />,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 font-medium block text-center w-full">{row.original.code}</span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} label="Nombre" />,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 text-left">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="Creación" /></div>,
      enableSorting: true,
      cell: ({ row }) => {
        const dateStr = row.original.created_at;
        let formatted = dateStr;
        try {
          if (dateStr) {
            const d = new Date(dateStr);
            formatted = d.toLocaleDateString('es-CO');
          }
        } catch { /* keep raw */ }
        return (
          <span className="text-xs text-gray-600 text-center block">{formatted}</span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Descripción",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-xs text-gray-600 text-left block truncate max-w-xs">
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ActionsCell
          costCenter={row.original}
          onEdit={callbacks.onEdit}
          onDelete={callbacks.onDelete}
          onToggleStatus={callbacks.onToggleStatus}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 120,
    },
  ];
}
