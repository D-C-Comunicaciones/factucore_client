"use client";

import * as React from "react";
import { FileText, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/format-currency";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

/* -----------------------------------------------------------------------
   Badge de estado DIAN
   ----------------------------------------------------------------------- */
function DianStatusBadge({ statusId, statusName }: { statusId?: number; statusName?: string }) {
  const label = (statusName || "").toLowerCase();

  if (label === "aprobada" || label === "aceptada" || label === "approved") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Aprobada
      </span>
    );
  }

  if (label === "no aprobada" || label === "rechazada" || label === "not_approved") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        No aprobada
      </span>
    );
  }

  if (label === "no electrónica" || label === "no electronica" || statusId === 1) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
        No electrónica
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      </svg>
      {statusName || "Desconocido"}
    </span>
  );
}

/* -----------------------------------------------------------------------
   Fila de tabla
   ----------------------------------------------------------------------- */
function ReturnRow({ item }: { item: any }) {
  const router = useRouter();
  const customerName =
    item.customer_name ||
    item.customer?.registration_name ||
    item.customer?.name ||
    "—";

  const currencyCode = item.type_currency_id === 35 || !item.type_currency_id ? "COP" : "USD";

  const navigateToDetail = () => router.push(`/returns/${item.id}`);

  return (
    <TableRow className="hover:bg-slate-50 cursor-pointer" onClick={navigateToDetail}>
      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
        <Checkbox />
      </TableCell>
      <TableCell className="font-medium text-slate-800">
        {item.prefix || ""}{item.number}
      </TableCell>
      <TableCell className="text-gray-700 max-w-[200px] truncate">
        {customerName}
      </TableCell>
      <TableCell className="text-gray-600">
        {item.issue_date && item.issue_date.includes("-") 
            ? dayjs(item.issue_date).format("DD/MM/YYYY") 
            : (item.issue_date || "—")}
      </TableCell>
      <TableCell className="text-gray-800 font-medium">
        {formatCurrency(Number(item.total || 0), currencyCode)}
      </TableCell>
      <TableCell className="text-gray-600 text-right">
        {formatCurrency(Number(item.balance ?? item.total ?? 0), currencyCode)}
      </TableCell>
      <TableCell>
        <DianStatusBadge statusId={item.dian_status_id} statusName={item.dian_status_name} />
      </TableCell>
      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="inline-flex items-center justify-center w-7 h-7 rounded hover:bg-gray-100 transition-colors"
              type="button"
            >
              <MoreVertical className="w-4 h-4 text-gray-500" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={navigateToDetail}>
              Ver detalle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

/* -----------------------------------------------------------------------
   Componente principal
   ----------------------------------------------------------------------- */
interface ReturnsTableBodyProps {
  loading?: boolean;
  items?: any[];
}

export function ReturnsTableBody({ loading = false, items = [] }: ReturnsTableBodyProps) {
  const router = useRouter();

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-10 border-l border-gray-200">
              <Checkbox />
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700">
              <span className="flex items-center gap-1">Número</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700">
              <span className="flex items-center gap-1">Cliente</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700">
              <span className="flex items-center gap-1">Fecha</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700">
              <span className="flex items-center gap-1">Total</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700 text-right">
              <span className="flex items-center justify-end gap-1">Por aplicar</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-gray-700">
              <span className="flex items-center gap-1">Estado DIAN</span>
            </TableHead>
            <TableHead className="w-10 border-r border-gray-200" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <ReturnRow key={item.id} item={item} />
            ))
          ) : loading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="h-64 bg-white" />
            </TableRow>
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="h-64 bg-white text-center align-middle">
                <div className="flex h-full flex-col items-center justify-center py-8">
                  <FileText className="w-10 h-10 text-slate-400 mb-4" strokeWidth={1.5} />
                  <div className="text-center text-xl font-medium text-[#003B73]">
                    ¡Aún no tienes devoluciones!
                  </div>
                  <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
                    Crea una devolución para empezar a registrar tus devoluciones en ventas.
                  </div>
                  <button
                    type="button"
                    className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
                    onClick={() => router.push("/returns/new")}
                  >
                    Crear primera devolución
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}
