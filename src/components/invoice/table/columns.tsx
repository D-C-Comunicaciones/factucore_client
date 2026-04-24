"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Printer } from "lucide-react";
import { InvoicesService } from "@/lib/invoices";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { InvoiceSummary } from "@/types/invoice";

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
   Badge de estado DIAN
   ----------------------------------------------------------------------- */
function DianStatusBadge({ status }: { status: string }) {
  const estado = (status || "").toLowerCase();

  if (estado === "aprobada") {
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

  if (estado === "no aprobada") {
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

  if (estado === "pendiente") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M10 6v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Pendiente
      </span>
    );
  }

  return <span className="text-xs text-gray-500">{status}</span>;
}

/* -----------------------------------------------------------------------
   Badge de estado interno
   ----------------------------------------------------------------------- */
function StatusBadge({ status }: { status: string }) {
  const estado = (status || "").toLowerCase();

  if (estado === "enviada") {
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
        Enviada
      </span>
    );
  }

  const styles: Record<string, string> = {
    cobrada: "bg-green-100 text-green-700",
    parcial: "bg-yellow-100 text-yellow-700",
    pendiente: "bg-primary/10 text-primary",
    vencida: "bg-red-100 text-red-700",
  };

  const style = styles[estado] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${style}`}>
      {estado.charAt(0).toUpperCase() + estado.slice(1)}
    </span>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones (descarga PDF)
   ----------------------------------------------------------------------- */
function ActionsCell({ invoice }: { invoice: InvoiceSummary }) {
  const handleDownloadPDF = async () => {
    const url = InvoicesService.getPdfUrl(invoice.id, 1);
    try {
      const axios = (await import("axios")).default;
      const response = await axios.get(url, {
        responseType: "blob",
        headers: { Accept: "application/pdf" },
        withCredentials: true,
      });
      const blob = response.data;
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `FEV_${invoice.number || invoice.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      alert("No se pudo descargar el PDF");
    }
  };

  return (
    <div className="relative inline-block text-left">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <circle cx="10" cy="4.5" r="1.2" fill="currentColor" />
              <circle cx="10" cy="10" r="1.2" fill="currentColor" />
              <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
            </svg>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" sideOffset={8} className="mt-2 min-w-[140px]">
          <DropdownMenuItem onClick={handleDownloadPDF}>
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/* -----------------------------------------------------------------------
   Factory de columnas
   ----------------------------------------------------------------------- */
export function getColumns(
  router: ReturnType<typeof useRouter>
): ColumnDef<InvoiceSummary>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Seleccionar todo"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Seleccionar fila"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    {
      accessorKey: "number",
      header: ({ column }) => <SortableHeader column={column} label="Número" />,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 font-medium text-left">{row.original.number}</span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Cliente",
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 text-left">
          {row.original.customer ?? "NO ESPECIFICADO"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="Creación" /></div>,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-600 text-center block">{row.original.created_at}</span>
      ),
    },
    {
      accessorKey: "payment_due_date",
      header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="Vencimiento" /></div>,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-600 text-center block">{row.original.payment_due_date ?? "-"}</span>
      ),
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 font-medium text-right">
          $ {Number(row.original.total).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "pending_amount",
      header: () => <div className="text-right">Por cobrar</div>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 text-right">
          $ {Number(row.original.pending_amount).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status_dian",
      header: "Estado DIAN",
      cell: ({ row }) => <div className="text-left"><DianStatusBadge status={row.original.status_dian} /></div>,
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <div className="text-left"><StatusBadge status={row.original.status} /></div>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell invoice={row.original} />,
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
  ];
}
