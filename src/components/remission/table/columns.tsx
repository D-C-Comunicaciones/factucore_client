"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown, Printer, Pencil, Minus, Coins, Eye } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RemissionsService } from "@/lib/remissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { RemissionSummary } from "@/types/remission";
import { showToast } from "@/components/sonner/CustomToaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
export function DianStatusBadge({ status }: { status: any }) {
  const estadoStr = typeof status === "string" ? status : (status?.name || "");
  const estado = estadoStr.toLowerCase();

  if (estado === "aprobada" || estado === "approved" || estado === "aceptada") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M7 10.5l2 2 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Aprobado
      </span>
    );
  }

  if (estado === "no aprobada" || estado === "not_approved" || estado === "rechazada") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-600 font-medium">
        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
          <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="13" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        No aprobado
      </span>
    );
  }

  if (estado === "por emitir" || estado === "to_send" || !estado || estado === "pendiente" || estado === "no enviada") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-medium">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Por emitir
      </span>
    );
  }

  return <span className="text-xs text-gray-500">{estadoStr || "Desconocido"}</span>;
}

/* -----------------------------------------------------------------------
   Badge de estado interno
   ----------------------------------------------------------------------- */
function StatusBadge({ status }: { status: any }) {
  const estadoStr = typeof status === "string" ? status : (status?.name || "");
  const estado = estadoStr.toLowerCase();

  if (estado === "enviada" || estado === "sent" || estado === "emitida") {
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
        Emitida
      </span>
    );
  }

  if (estado === "draft" || estado === "borrador") {
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-700">
        Borrador
      </span>
    );
  }

  if (estado === "saved" || estado === "guardada") {
    return (
      <span className="inline-flex px-2 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-800">
        Guardada
      </span>
    );
  }

  const styles: Record<string, string> = {
    "pagada": "bg-green-100 text-green-700",
    "cobrada": "bg-green-100 text-green-700",
    "por pagar": "bg-blue-100 text-blue-700",
    parcial: "bg-yellow-100 text-yellow-700",
    pendiente: "bg-primary/10 text-primary",
    vencida: "bg-red-100 text-red-700",
    anulada: "bg-red-100 text-red-700",
  };

  const style = styles[estado] ?? "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${style}`}>
      {estadoStr ? estadoStr.charAt(0).toUpperCase() + estadoStr.slice(1) : "Desconocido"}
    </span>
  );
}

/* -----------------------------------------------------------------------
   Celda de acciones (descarga PDF)
   ----------------------------------------------------------------------- */
function ActionsCell({ remission }: { remission: RemissionSummary }) {
  const router = useRouter();
  const [showAnularDialog, setShowAnularDialog] = React.useState(false);
  const [isAnulando, setIsAnulando] = React.useState(false);

  const handleDownloadPDF = async () => {
    try {
      showToast("Preparando documento...", "info");
      const fileName = `Remission Electronica No. ${remission.number || remission.id}.pdf`;
      sessionStorage.setItem(`print_remission_${encodeURIComponent(fileName)}`, remission.id.toString());
      const url = `/print/${encodeURIComponent(fileName)}`;
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al preparar impresiÃ³n:", error);
      showToast("Error al cargar el documento", "error");
    }
  };

  const estadoDianStr = typeof remission.status_dian === "string" ? remission.status_dian : ((remission.status_dian as any)?.name || "");
  const estadoDian = estadoDianStr.toLowerCase();

  const estadoStr = typeof remission.status === "string" ? remission.status : ((remission.status as any)?.name || "");
  const estado = estadoStr.toLowerCase();

  const isDianAprobada = estadoDian === "aprobada" || estadoDian === "approved" || estadoDian === "aceptada";

  // Disable Anular if approved by DIAN, or if status is 'cobrada', 'por cobrar', 'pendiente', 'vencida', 'parcial'
  // Only allow if 'borrador', 'guardada' etc and not approved.
  const isCobradaOPorCobrar = estado === "cobrada" || estado === "por cobrar" || estado === "pendiente" || estado === "vencida" || estado === "parcial";
  const canAnular = (estado === "borrador" || estado === "draft" || estado === "guardada" || estado === "saved" || estado === "no electrÃ³nico") && !isDianAprobada && !isCobradaOPorCobrar;

  const canEdit = !isDianAprobada && (
    estado === "borrador" ||
    estado === "draft" ||
    estado === "guardada" ||
    estado === "saved" ||
    estadoDian === "no aprobada" ||
    estadoDian === "rechazada" ||
    estado === "no electrÃ³nico"
  );

  const handleEdit = () => {
    console.log("Editar remission", remission.id);
  };

  const handleAnular = async () => {
    setIsAnulando(true);
    try {
      await RemissionsService.cancel(remission.id);
      showToast("Remission anulada correctamente", "success", "Ã‰xito");
      window.location.reload();
    } catch (error: any) {
      console.error("Error al anular la remission:", error);
      const errorData = error.response?.data || error.data || error;
      const errorMsg = errorData?.message || "No se pudo anular la remission";
      showToast(errorMsg, "error", "Error");
    } finally {
      setIsAnulando(false);
      setShowAnularDialog(false);
    }
  };

  const handlePayment = () => {
    console.log("Agregar pago a remission", remission.id);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:!bg-primary/10 transition-colors" onClick={(e) => { e.stopPropagation(); handlePayment(); }}>
                <div className="flex items-center text-slate-700">
                  <span className="text-[10px] font-bold mt-0.5 mr-[1px]">$</span>
                  <Coins className="h-[15px] w-[15px]" strokeWidth={2.5} />
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1e293b] text-white border-none" side="top">
              <p className="font-medium">Agregar pago</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="relative inline-block text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 transition-colors text-slate-700 focus-visible:ring-1 focus-visible:ring-teal-500" onClick={(e) => e.stopPropagation()}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <circle cx="10" cy="4.5" r="1.2" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                  <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="mt-2 min-w-[140px]">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()} onSelect={() => router.push(`/remissions/${remission.id}`)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2 text-slate-700" />
                Ver detalle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => e.stopPropagation()} onSelect={() => handleDownloadPDF()} className="cursor-pointer">
                <Printer className="w-4 h-4 mr-2 text-slate-700" />
                Imprimir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => {
                  if (!canEdit) e.preventDefault();
                  else handleEdit();
                }}
                className={`cursor-pointer ${!canEdit ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={!canEdit}
              >
                <Pencil className="w-4 h-4 mr-2 text-slate-700" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => e.stopPropagation()}
                onSelect={(e) => {
                  if (!canAnular) e.preventDefault();
                  else setShowAnularDialog(true);
                }}
                className={`cursor-pointer ${!canAnular ? 'opacity-50 pointer-events-none' : ''}`}
                disabled={!canAnular}
              >
                <Minus className="w-4 h-4 mr-2 text-slate-700" />
                Anular
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showAnularDialog} onOpenChange={setShowAnularDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Â¿EstÃ¡s seguro de que deseas anular esta remission?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acciÃ³n no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAnulando}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isAnulando}
              onClick={(e) => {
                e.stopPropagation();
                handleAnular();
              }}
            >
              {isAnulando ? "Anulando..." : "Anular remission"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* -----------------------------------------------------------------------
   Factory de columnas
   ----------------------------------------------------------------------- */
export function getColumns(
  router: ReturnType<typeof useRouter>
): ColumnDef<RemissionSummary>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={
            table.getRowModel().rows.length > 0 &&
            table.getRowModel().rows.every(
              row => row.getIsSelected()
            )
          }
          ref={(el) => {
            if (!el) return;

            const rows = table.getRowModel().rows;
            const selected = rows.filter(
              row => row.getIsSelected()
            ).length;

            el.indeterminate =
              selected > 0 &&
              selected < rows.length;
          }}
          onChange={(e) => {
            const checked = e.target.checked;

            table.getRowModel().rows.forEach(
              row => row.toggleSelected(checked)
            );
          }}
        />
      ),
      cell: ({ row }) => (
        <>
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => {
              row.toggleSelected(e.target.checked);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
    {
      accessorKey: "number",
      header: ({ column }) => <SortableHeader column={column} label="NÃºmero" />,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 font-medium text-left">{row.original.number}</span>
      ),
    },
    {
      accessorKey: "contact",
      header: "Cliente",
      cell: ({ row }) => (
        <span className="text-xs text-gray-900 text-left">
          {row.original.contact ?? "NO ESPECIFICADO"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => <div className="text-center"><SortableHeader column={column} label="CreaciÃ³n" /></div>,
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
        <span className="text-xs text-gray-600 text-center block">{row.original.payment_due_date || row.original.created_at || "-"}</span>
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
      header: () => <div className="text-right">Por pagar</div>,
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
      cell: ({ row }) => <ActionsCell remission={row.original} />,
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
  ];
}

