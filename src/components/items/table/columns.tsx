"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  Eye,
  Pencil,
  Lightbulb,
  LightbulbOff,
  Trash2,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";

import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import type {
  ItemListResponse,
} from "@/types/items";

/* -----------------------------------------------------------------------
   Badge de estado activo/inactivo
------------------------------------------------------------------------ */
function StatusBadge({
  active,
}: {
  active: boolean;
}) {
  return active ? (
    <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-primary/10 text-primary">
      Activo
    </span>
  ) : (
    <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-gray-100 text-gray-500">
      Inactivo
    </span>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones
------------------------------------------------------------------------ */
function ItemActionsCell({
  item,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: {
  item: ItemListResponse;

  onView: (id: number) => void;

  onEdit: (id: number) => void;

  onToggleActive: (
    id: number
  ) => void;

  onDelete: (id: number) => void;
}) {
  const canEdit =
    item.permissions?.can_edit ??
    true;

  const canDelete =
    item.permissions?.can_delete ??
    true;

  return (
    <div
      className="flex items-center gap-0"
      data-no-row-select="true"
    >
      <TooltipProvider
        delayDuration={300}
      >
        {/* Detalles */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() =>
                onView(item.id)
              }
            >
              <Eye className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p>Detalles</p>
          </TooltipContent>
        </Tooltip>

        {/* Editar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background disabled:opacity-30"
              onClick={() =>
                onEdit(item.id)
              }
              disabled={!canEdit}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p>
              {canEdit
                ? "Editar"
                : "No tienes permisos para editar este ítem"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Activar/Desactivar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background disabled:opacity-30"
              onClick={() =>
                onToggleActive(item.id)
              }
              disabled={!canEdit}
            >
              {item.active ? (
                <Lightbulb className="w-3.5 h-3.5" />
              ) : (
                <LightbulbOff className="w-3.5 h-3.5" />
              )}
            </Button>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p>
              {canEdit
                ? item.active
                  ? "Desactivar"
                  : "Activar"
                : "No tienes permisos para cambiar el estado"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Eliminar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background disabled:opacity-30"
              onClick={() =>
                onDelete(item.id)
              }
              disabled={!canDelete}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>

          <TooltipContent side="bottom">
            <p>
              {canDelete
                ? "Eliminar"
                : "Este ítem no puede ser eliminado (tiene transacciones asociadas)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Factory de columnas
------------------------------------------------------------------------ */
export function getItemColumns(
  onView: (id: number) => void,

  onEdit: (id: number) => void,

  onToggleActive: (
    id: number
  ) => void,

  onDelete: (id: number) => void,

  onToggle?: (id: number) => void,

  onToggleAll?: () => void,

  allSelected?: boolean,

  someSelected?: boolean,

  selection?: Record<
    string,
    boolean
  >
): ColumnDef<ItemListResponse>[] {
  return [
    /* CHECKBOX */
    {
      id: "select",

      size: 48,

      header: ({ table }) => {
        const showIndeterminate =
          someSelected &&
          !allSelected;

        return (
          <Checkbox
            key={
              allSelected
                ? "all-selected"
                : someSelected
                  ? "some-selected"
                  : "none-selected"
            }
            checked={
              allSelected
                ? true
                : showIndeterminate
                  ? "indeterminate"
                  : false
            }
            onClick={(e) =>
              e.stopPropagation()
            }
            onCheckedChange={() =>
              onToggleAll
                ? onToggleAll()
                : table.toggleAllPageRowsSelected()
            }
          />
        );
      },

      cell: ({ row }) => {
        const isSelected =
          selection
            ? !!selection[
            String(
              row.original.id
            )
            ]
            : row.getIsSelected();

        return (
          <Checkbox
            checked={isSelected}
            onClick={(e) =>
              e.stopPropagation()
            }
            onCheckedChange={() =>
              onToggle
                ? onToggle(
                  row.original.id
                )
                : row.toggleSelected()
            }
          />
        );
      },

      enableSorting: false,
    },

    /* NOMBRE */
    {
      accessorKey: "name",

      header: "Nombre",

      size: 220,

      cell: ({ row }) => (
        <span className="text-xs text-foreground font-medium">
          {row.original.name}
        </span>
      ),
    },

    /* REFERENCIA */
    {
      accessorKey: "reference",

      header: "Referencia",

      size: 140,

      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.reference ||
            "—"}
        </span>
      ),
    },

    /* PRECIO */
    {
      accessorKey: "price",

      header: () => (
        <div className="text-right">
          Precio
        </div>
      ),

      size: 120,

      cell: ({ row }) => (
        <div className="text-xs text-gray-900 font-medium text-right">
          ${" "}
          {Number(
            row.original.price
          ).toLocaleString("es-CO")}
        </div>
      ),
    },

    /* DESCRIPCIÓN */
    {
      accessorKey: "description",

      header: "Descripción",

      size: 260,

      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground line-clamp-2">
          {row.original.description ||
            "—"}
        </span>
      ),
    },

    /* ESTADO */
    {
      accessorKey: "active",

      header: "Estado",

      size: 100,

      cell: ({ row }) => (
        <StatusBadge
          active={
            row.original.active
          }
        />
      ),
    },

    /* ACCIONES */
    {
      id: "actions",

      header: "Acciones",

      size: 100,

      enableSorting: false,

      cell: ({ row }) => (
        <ItemActionsCell
          item={row.original}
          onView={onView}
          onEdit={onEdit}
          onToggleActive={
            onToggleActive
          }
          onDelete={onDelete}
        />
      ),
    },
  ];
}