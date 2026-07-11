"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2, MoreVertical, Printer, Ban, CheckCircle2, MoreHorizontal } from "lucide-react";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Payment } from "@/types/payments";

/* -----------------------------------------------------------------------
   Badge de estado de pago
------------------------------------------------------------------------ */


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
    <div className="flex items-center justify-center gap-0 mr-2" data-no-row-select="true">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-slate-500 hover:bg-slate-200 cursor-pointer">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 rounded-xl shadow-md border-gray-100 p-1">
          <DropdownMenuItem onClick={() => onView(payment.id)} className="cursor-pointer text-[13px] text-slate-700 py-1.5 rounded-md hover:bg-slate-100">
            <Printer className="mr-2 h-3.5 w-3.5" />
            <span>Imprimir</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="cursor-pointer text-[13px] text-slate-700 py-1.5 rounded-md hover:bg-slate-100">
            <Ban className="mr-2 h-3.5 w-3.5" />
            <span>Anular</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(payment.id)} className="cursor-pointer text-[13px] text-slate-700 py-1.5 rounded-md hover:bg-slate-100">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            <span>Editar</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-100 my-1" />
          <DropdownMenuItem onClick={() => onDelete(payment.id)} className="cursor-pointer text-[13px] text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50 py-1.5 rounded-md">
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
      accessorKey: "customer",
      header: "Cliente",
      size: 180,
      cell: ({ row }) => {
        const contactId = row.original.contact_id || row.original.customer_id;
        return contactId ? (
          <Link 
            href={`/contacts/${contactId}`}
            className="text-xs text-primary font-medium hover:underline cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            {row.original.customer}
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">
            {row.original.customer}
          </span>
        );
      },
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
      accessorKey: "account_name",
      header: "Cuenta bancaria",
      size: 160,
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.account_name}
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
      header: "",
      size: 60,
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
