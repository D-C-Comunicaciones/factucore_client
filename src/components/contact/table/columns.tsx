"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, FileEdit, Eye, UserX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Contact {
  id: number;
  name: string;
  identification: string;
  phone: string;
  type: "customer" | "provider";
}

/* -------------------- helpers -------------------- */

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-primary",
    "bg-chart-2",
    "bg-chart-3",
    "bg-primary/85",
    "bg-chart-2/85",
    "bg-primary/70",
    "bg-chart-3/85",
    "bg-ring",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function AvatarInitials({ name }: { name: string }) {
  return (
    <div
      className={`w-7 h-7 rounded-full ${getColorFromName(
        name
      )} flex items-center justify-center`}
    >
      <span className="text-white text-xs font-medium">
        {getInitials(name)}
      </span>
    </div>
  );
}

/* -------------------- actions -------------------- */

function ContactActionsCell({
  contact,
  onDelete,
}: {
  contact: Contact;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-1" data-no-row-select="true">
      <Button variant="ghost" size="icon" className="h-7 w-7">
        <FileEdit className="w-4 h-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-40 bg-popover border border-border"
        >
          <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">
            <Eye className="w-4 h-4 mr-2" />
            Ver detalle
          </DropdownMenuItem>

          <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary transition-colors">
            <UserX className="w-4 h-4 mr-2" />
            Desactivar
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onDelete(contact.id)}
            className="hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* -------------------- columns -------------------- */

export function getContactColumns(
  onDelete: (id: number) => void,
  onToggle?: (id: number) => void,
  onToggleAll?: () => void,
  allSelected?: boolean,
  someSelected?: boolean,
  selection?: Record<string, boolean>
): ColumnDef<Contact>[] {
  return [
    /* CHECKBOX */
    {
      id: "select",
      size: 48,
      header: ({ table }) => {
        const showIndeterminate = someSelected && !allSelected;

        return (
          <Checkbox
            checked={
              allSelected || (showIndeterminate ? "indeterminate" : false)
            }
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() =>
              onToggleAll ? onToggleAll() : table.toggleAllPageRowsSelected()
            }
          />
        );
      },
      cell: ({ row }) => {
        const isSelected = selection
          ? !!selection[String(row.original.id)]
          : row.getIsSelected();

        return (
          <Checkbox
            checked={isSelected}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={() =>
              onToggle ? onToggle(row.original.id) : row.toggleSelected()
            }
          />
        );
      },
      enableSorting: false,
    },

    /* NOMBRE (MÁS GRANDE) */
    {
      accessorKey: "name",
      header: "Nombre",
      size: 260,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <AvatarInitials name={row.original.name} />
          <span className="text-xs text-foreground font-medium">
            {row.original.name}
          </span>
        </div>
      ),
    },

    /* IDENTIFICACIÓN (MÁS PEQUEÑA) */
    {
      accessorKey: "identification",
      header: "Identificación",
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.identification}
        </span>
      ),
    },

    /* TELÉFONO */
    {
      accessorKey: "phone",
      header: "Teléfono",
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.phone}
        </span>
      ),
    },

    /* TIPO */
    {
      accessorKey: "type",
      header: "Tipo",
      size: 120,
      cell: ({ row }) => (
        <span
          className={`inline-flex px-2 py-0.5 text-xs rounded-full font-medium ${row.original.type === "customer"
              ? "bg-primary/10 text-primary"
              : "bg-secondary/20 text-foreground"
            }`}
        >
          {row.original.type === "customer" ? "Cliente" : "Proveedor"}
        </span>
      ),
    },

    /* ACCIONES (MÁS GRANDE) */
    {
      id: "actions",
      header: "Acciones",
      size: 160,
      enableSorting: false,
      cell: ({ row }) => (
        <ContactActionsCell
          contact={row.original}
          onDelete={onDelete}
        />
      ),
    },
  ];
}