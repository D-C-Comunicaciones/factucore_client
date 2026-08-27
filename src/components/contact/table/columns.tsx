"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, FileEdit, Eye, UserX, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { isConsumerFinal } from "@/utils/is-consumer-final";

const CONSUMER_FINAL_EDIT_TOOLTIP = "Este contacto es predeterminado para facturación a consumidor final y no puede ser editado.";
const CONSUMER_FINAL_DELETE_TOOLTIP = "Este contacto es predeterminado para facturación a consumidor final y no puede ser eliminado.";

export interface Contact {
  id: number;
  name: string;
  identification: string;
  phone: string;
  type: "customer" | "provider" | "both";
  is_active?: boolean;
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

export function AvatarInitials({ name }: { name: string }) {
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
  onToggleActive,
}: {
  contact: Contact;
  onDelete: (id: number) => void;
  onToggleActive: (id: number, currentlyActive: boolean) => void;
}) {
  const router = useRouter();
  const isActive = contact.is_active !== false;
  const isFinalConsumer = isConsumerFinal(contact.identification);

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1" data-no-row-select="true">
        {isFinalConsumer ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-40 cursor-not-allowed" disabled>
                  <FileEdit className="w-4 h-4" />
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent className="max-w-64 text-center">{CONSUMER_FINAL_EDIT_TOOLTIP}</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-gray-100"
            onClick={() => router.push(`/contacts/${contact.id}/edit`)}
          >
            <FileEdit className="w-4 h-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-40 bg-popover border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={() => router.push(`/contacts/${contact.id}`)}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver detalle
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onToggleActive(contact.id, isActive)}
              className="hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {isActive ? (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Desactivar
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Activar
                </>
              )}
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {isFinalConsumer ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <DropdownMenuItem
                      disabled
                      className="opacity-40 cursor-not-allowed"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Eliminar
                    </DropdownMenuItem>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-64 text-center">{CONSUMER_FINAL_DELETE_TOOLTIP}</TooltipContent>
              </Tooltip>
            ) : (
              <DropdownMenuItem
                onClick={() => onDelete(contact.id)}
                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TooltipProvider>
  );
}

/* -------------------- columns -------------------- */

export function getContactColumns(
  onDelete: (id: number) => void,
  activeTab: string = "all",
  onToggleActive: (id: number, currentlyActive: boolean) => void = () => {}
): ColumnDef<Contact>[] {
  return [
    /* CHECKBOX — renderizado directamente en ContactTableBody (no via flexRender) */
    {
      id: "select",
      size: 48,
      header: () => null,
      cell: () => null,
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
      cell: ({ row }) => {
        const type = row.original.type;
        const showCustomer = type === "customer" || type === "both";
        const showProvider = type === "provider" || type === "both";

        return (
          <div className="flex gap-1 flex-wrap">
            {showCustomer && (activeTab === "all" || activeTab === "customer") && (
              <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-primary/10 text-primary uppercase">
                Cliente
              </span>
            )}
            {showProvider && (activeTab === "all" || activeTab === "provider") && (
              <span className="inline-flex px-2 py-0.5 text-[10px] rounded-full font-medium bg-secondary/20 text-foreground uppercase">
                Proveedor
              </span>
            )}
          </div>
        );
      },
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
          onToggleActive={onToggleActive}
        />
      ),
    },
  ];
}