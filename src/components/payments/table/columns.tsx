"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Payment } from "@/types/payments";

/* -----------------------------------------------------------------------
   Badge de estado de pago
------------------------------------------------------------------------ */
function PaymentStatusBadge({
  status,
}: {
  status: "No conciliado" | "Conciliado" | "Anulado";
}) {
  if (status === "Conciliado") {
    return (
      <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-emerald-100 text-emerald-700">
        Conciliado
      </span>
    );
  }
  if (status === "No conciliado") {
    return (
      <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-amber-100 text-amber-700">
        No conciliado
      </span>
    );
  }
  return (
    <span className="inline-flex px-2 py-0.5 text-xs rounded-full font-medium bg-slate-100 text-slate-700">
      Anulado
    </span>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones
------------------------------------------------------------------------ */
function PaymentActionsCell({
  payment,
  onView,
  onEdit,
  onDelete,
}: {
  payment: Payment;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="flex items-center gap-0" data-no-row-select="true">
      <TooltipProvider delayDuration={300}>
        {/* Detalles */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() => onView(payment.id)}
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
              className="h-7 w-7 hover:bg-background"
              onClick={() => onEdit(payment.id)}
            >
              <Pencil className="w-3.5 h-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Editar</p>
          </TooltipContent>
        </Tooltip>

        {/* Eliminar */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-background"
              onClick={() => onDelete(payment.id)}
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

/* -----------------------------------------------------------------------
   Factory de columnas
------------------------------------------------------------------------ */
export function getPaymentColumns(
  onView: (id: number) => void,
  onEdit: (id: number) => void,
  onDelete: (id: number) => void,
  onToggle?: (uniqueId: string) => void,
  onToggleAll?: (value: boolean) => void,
  allSelected?: boolean,
  someSelected?: boolean
): ColumnDef<Payment>[] {
  return [
    /* CHECKBOX */
    {
      id: "select",
      size: 48,
      header: () => {
        const showIndeterminate = someSelected && !allSelected;
        return (
          <Checkbox
            checked={allSelected ? true : showIndeterminate ? "indeterminate" : false}
            onClick={(e) => e.stopPropagation()}
            onCheckedChange={(value) => onToggleAll && onToggleAll(!!value)}
          />
        );
      },
      cell: ({ row }) => {
        const isSelected = row.getIsSelected();
        return (
          <div data-no-row-select="true" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => (onToggle ? onToggle(row.id.toString()) : row.toggleSelected())}
            />
          </div>
        );
      },
      enableSorting: false,
    },

    /* NÚMERO */
    {
      accessorKey: "number",
      header: "Número",
      size: 100,
      cell: ({ row }) => (
        <span className="text-xs text-foreground font-medium">
          {row.original.number}
        </span>
      ),
    },

    /* CLIENTE */
    {
      accessorKey: "client",
      header: "Cliente",
      size: 180,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.client}
        </span>
      ),
    },

    /* FECHA DE CREACIÓN */
    {
      accessorKey: "created_at",
      header: "Fecha de creación",
      size: 140,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.created_at}
        </span>
      ),
    },

    /* CUENTA BANCARIA */
    {
      accessorKey: "bank_account",
      header: "Cuenta bancaria",
      size: 160,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.bank_account}
        </span>
      ),
    },

    /* ESTADO DE PAGO */
    {
      accessorKey: "payment_status",
      header: "Estado de pago",
      size: 130,
      cell: ({ row }) => (
        <PaymentStatusBadge status={row.original.payment_status} />
      ),
    },

    /* MONTO */
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Monto</div>,
      size: 120,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 font-medium text-right">
          $ {Number(row.original.amount).toLocaleString("es-CO")}
        </div>
      ),
    },

    /* ACCIONES */
    {
      id: "actions",
      header: "Acciones",
      size: 100,
      enableSorting: false,
      cell: ({ row }) => (
        <PaymentActionsCell
          payment={row.original}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ];
}
