"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Lightbulb, LightbulbOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Resolution } from "@/lib/resolutions";

/* -----------------------------------------------------------------------
   Badge de Preferida
------------------------------------------------------------------------ */
function BooleanBadge({ value }: { value?: boolean }) {
  return value ? (
    <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-primary/10 text-primary">
      Sí
    </span>
  ) : (
    <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-500">
      No
    </span>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones
------------------------------------------------------------------------ */
function ResolutionActionsCell({
  resolution,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  resolution: Resolution;
  onEdit: (id: number) => void;
  onToggleActive: (id: number, isActive: boolean) => void;
  onDelete: (id: number) => void;
}) {
  const isActive = resolution.is_active;

  return (
    <div className="flex items-center gap-0" data-no-row-select="true">
      <TooltipProvider delayDuration={300}>
        {/* Editar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() => onEdit(resolution.id)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>

        {/* Activar/Desactivar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() => onToggleActive(resolution.id, !isActive)}
            >
              {isActive ? (
                <LightbulbOff className="w-3.5 h-3.5" />
              ) : (
                <Lightbulb className="w-3.5 h-3.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isActive ? "Inactivar" : "Activar"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Eliminar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() => onDelete(resolution.id)}
              disabled={resolution.is_main}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Eliminar</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

import { Checkbox } from "@/components/ui/checkbox";

/* -----------------------------------------------------------------------
   Factory de columnas
------------------------------------------------------------------------ */
export function getResolutionColumns(
  onEdit: (id: number) => void,
  onToggleActive: (id: number, isActive: boolean) => void,
  onDelete: (id: number) => void,
  onToggle?: (id: number) => void,
  onToggleAll?: () => void,
  allSelected?: boolean,
  someSelected?: boolean
): ColumnDef<Resolution>[] {
  return [
    {
      accessorKey: "name",
      header: "Nombre",
      size: 180,
      cell: ({ row }) => (
        <span className="text-xs text-foreground font-medium">
          {row.original.description || row.original.name || "—"}
        </span>
      ),
    },
    {
      accessorKey: "is_main",
      header: "Preferida",
      size: 100,
      cell: ({ row }) => <BooleanBadge value={row.original.is_main} />,
    },
    {
      accessorKey: "is_electronic",
      header: "Electrónica",
      size: 100,
      cell: ({ row }) => <BooleanBadge value={row.original.is_electronic} />,
    },
    {
      accessorKey: "resolution_number",
      header: "Resolución",
      size: 120,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.resolution_number || "—"}
        </span>
      ),
    },
    {
      accessorKey: "prefix",
      header: "Prefijo",
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.prefix || "—"}
        </span>
      ),
    },
    {
      accessorKey: "next_number",
      header: "Siguiente número",
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.current_number || row.original.from_number || "1"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Acciones",
      size: 100,
      enableSorting: false,
      cell: ({ row }) => (
        <ResolutionActionsCell
          resolution={row.original}
          onEdit={onEdit}
          onToggleActive={onToggleActive}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
