"use client";

import * as React from "react";
import { FileText, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/format-currency";
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
import {
  SelectAllCheckbox,
  SelectRowCheckbox,
} from "@/components/ui/selection-checkbox";

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
function ReturnRow({
  item,
  isSelected,
  onToggleSelection,
}: {
  item: any;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}) {
  const router = useRouter();
  const customerName =
    item.customer_name ||
    item.customer?.registration_name ||
    item.customer?.name ||
    "—";

  const currencyCode = item.type_currency_id === 35 || !item.type_currency_id ? "COP" : "USD";

  const navigateToDetail = () => router.push(`/sales/returns/${item.id}`);

  return (
    <TableRow className="hover:bg-slate-50 cursor-pointer" onClick={navigateToDetail}>
      <TableCell className="w-10" onClick={(e) => e.stopPropagation()}>
        <SelectRowCheckbox
          checked={isSelected}
          onToggle={() => onToggleSelection(String(item.id))}
        />
      </TableCell>
      <TableCell className="font-medium text-slate-800">
        {item.prefix || ""}{item.number}
      </TableCell>
      <TableCell className="text-gray-700 max-w-[200px] truncate">
        {customerName}
      </TableCell>
      <TableCell className="text-gray-600">
        {item.issue_date && item.issue_date.includes("-") 
            ? item.issue_date.split("T")[0].split(" ")[0].split("-").reverse().join("/") 
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
   Tarjeta móvil
   ----------------------------------------------------------------------- */
function ReturnMobileCard({
  item,
  isSelected,
  onToggleSelection,
}: {
  item: any;
  isSelected: boolean;
  onToggleSelection: (id: string) => void;
}) {
  const router = useRouter();
  const customerName =
    item.customer_name ||
    item.customer?.registration_name ||
    item.customer?.name ||
    "—";

  const currencyCode = item.type_currency_id === 35 || !item.type_currency_id ? "COP" : "USD";
  const navigateToDetail = () => router.push(`/sales/returns/${item.id}`);
  const formattedDate = item.issue_date && item.issue_date.includes("-")
    ? item.issue_date.split("T")[0].split(" ")[0].split("-").reverse().join("/")
    : (item.issue_date || "—");

  return (
    <div
      className={`flex items-start gap-3 border-b border-gray-200 p-4 ${isSelected ? "bg-primary/5" : "bg-white"}`}
      onClick={navigateToDetail}
    >
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()} data-no-row-select="true">
        <SelectRowCheckbox checked={isSelected} onToggle={() => onToggleSelection(String(item.id))} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-slate-800">
            {item.prefix || ""}{item.number}
          </span>
          <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1 shrink-0">
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
          </div>
        </div>

        <div className="mt-0.5 truncate text-xs text-gray-600">{customerName}</div>
        <div className="text-xs text-gray-400">{formattedDate}</div>

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-gray-400">Total</div>
            <div className="text-sm font-medium text-gray-900">
              {formatCurrency(Number(item.total || 0), currencyCode)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400">Por aplicar</div>
            <div className="text-xs text-gray-600">
              {formatCurrency(Number(item.balance ?? item.total ?? 0), currencyCode)}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <DianStatusBadge statusId={item.dian_status_id} statusName={item.dian_status_name} />
        </div>
      </div>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Componente principal
   ----------------------------------------------------------------------- */
interface ReturnsTableBodyProps {
  loading?: boolean;
  items?: any[];
  selection?: Record<string, boolean>;
  onToggleSelection?: (id: string) => void;
  allSelected?: boolean;
  someSelected?: boolean;
  onToggleSelectAll?: (value: boolean) => void;
}

export function ReturnsTableBody({
  loading = false,
  items = [],
  selection = {},
  onToggleSelection = () => {},
  allSelected = false,
  someSelected = false,
  onToggleSelectAll = () => {},
}: ReturnsTableBodyProps) {
  const router = useRouter();
  const hasRows = items.length > 0;

  const emptyState = (
    <div className="flex h-full flex-col items-center justify-center py-8">
      <FileText className="w-10 h-10 text-slate-400 mb-4" strokeWidth={1.5} />
      <div className="text-center text-xl font-medium text-[#003B73]">
        ¡Aún no tienes devoluciones!
      </div>
      <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md px-4">
        Crea una devolución para empezar a registrar tus devoluciones en ventas.
      </div>
      <button
        type="button"
        className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
        onClick={() => router.push("/sales/returns/new")}
      >
        Crear primera devolución
      </button>
    </div>
  );

  return (
    <div className="relative">
      {/* Tarjetas — pantallas angostas (below sm) */}
      <div className="sm:hidden">
        {hasRows
          ? items.map((item) => (
              <ReturnMobileCard
                key={item.id}
                item={item}
                isSelected={Boolean(selection[String(item.id)])}
                onToggleSelection={onToggleSelection}
              />
            ))
          : !loading && <div className="h-64">{emptyState}</div>}
      </div>

      {/* Tabla — sm y superior */}
      <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableHead className="w-10 border-l border-gray-200">
              <SelectAllCheckbox
                allSelected={allSelected}
                someSelected={someSelected}
                onToggle={onToggleSelectAll}
              />
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900">
              <span className="flex items-center gap-1">Número</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900">
              <span className="flex items-center gap-1">Cliente</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900">
              <span className="flex items-center gap-1">Fecha</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900">
              <span className="flex items-center gap-1">Total</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900 text-right">
              <span className="flex items-center justify-end gap-1">Por aplicar</span>
            </TableHead>
            <TableHead className="font-medium text-xs text-slate-900">
              <span className="flex items-center gap-1">Estado DIAN</span>
            </TableHead>
            <TableHead className="w-10 border-r border-gray-200" />
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.length > 0 ? (
            items.map((item) => (
              <ReturnRow
                key={item.id}
                item={item}
                isSelected={Boolean(selection[String(item.id)])}
                onToggleSelection={onToggleSelection}
              />
            ))
          ) : loading ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="h-64 bg-white" />
            </TableRow>
          ) : (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={8} className="h-64 bg-white text-center align-middle">
                {emptyState}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      </div>

      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
        </div>
      )}
    </div>
  );
}
