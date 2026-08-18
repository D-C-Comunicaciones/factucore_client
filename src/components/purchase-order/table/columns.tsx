"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PurchaseOrdersService } from "@/lib/purchaseOrders";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PurchaseOrderSummary } from "@/types/purchaseOrder";
import { showToast } from "@/components/sonner/CustomToaster";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function PurchaseOrderStatusBadge({ status }: { status: any }) {
  const estadoStr = typeof status === "string" ? status : status?.name || "";
  const estado = estadoStr.toLowerCase();

  const styles: Record<string, string> = {
    open: "bg-primary/10 text-primary",
    abierta: "bg-primary/10 text-primary",
    closed: "bg-green-100 text-green-700",
    cerrada: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    cancelada: "bg-red-100 text-red-700",
  };

  const labels: Record<string, string> = {
    open: "Abierta",
    closed: "Cerrada",
    cancelled: "Cancelada",
  };

  const style = styles[estado] ?? "bg-gray-100 text-gray-700";
  const label = labels[estado] ?? (estadoStr ? estadoStr.charAt(0).toUpperCase() + estadoStr.slice(1) : "Desconocido");

  return <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${style}`}>{label}</span>;
}

function ActionsCell({ purchaseOrder, basePath }: { purchaseOrder: PurchaseOrderSummary; basePath: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isAssociatedToInvoice = !!purchaseOrder.invoice_id;

  const handleEdit = () => {
    router.push(`${basePath}/${purchaseOrder.id}/edit`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await PurchaseOrdersService.delete(purchaseOrder.id);
      showToast("Orden de compra eliminada correctamente", "success", "Éxito");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    } catch (error: any) {
      const errorData = error.response?.data || error.data || error;
      const errorMsg = errorData?.message || "No se pudo eliminar la orden de compra";
      showToast(errorMsg, "error", "Error");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <div className="relative inline-block text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 transition-colors text-slate-700 focus-visible:ring-1 focus-visible:ring-teal-500"
                onClick={(e) => e.stopPropagation()}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                  <circle cx="10" cy="4.5" r="1.2" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.2" fill="currentColor" />
                  <circle cx="10" cy="15.5" r="1.2" fill="currentColor" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="mt-2 min-w-[160px]">
              <DropdownMenuItem onClick={(e) => e.stopPropagation()} onSelect={handleEdit} className="cursor-pointer">
                <Pencil className="w-4 h-4 mr-2 text-slate-700" />
                Editar
              </DropdownMenuItem>

              {isAssociatedToInvoice ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <DropdownMenuItem
                          disabled
                          onClick={(e) => e.stopPropagation()}
                          className="cursor-not-allowed opacity-50 text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                      No se puede eliminar: ya está asociada a una factura.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <DropdownMenuItem
                  onClick={(e) => e.stopPropagation()}
                  onSelect={() => setShowDeleteDialog(true)}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que deseas eliminar esta orden de compra?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              {isDeleting ? "Eliminando..." : "Eliminar orden de compra"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function getColumns(variant: "internal" | "external" = "external"): ColumnDef<PurchaseOrderSummary>[] {
  const basePath = variant === "internal" ? "/expenses/purchase-orders" : "/purchase-orders";

  return [
    variant === "internal"
      ? {
        accessorKey: "number",
        header: "Número",
        cell: ({ row }: { row: any }) => (
          <span className="text-xs text-gray-900 font-medium">
            {row.original.prefix || ""}
            {row.original.number || row.original.id}
          </span>
        ),
      }
      : {
        accessorKey: "reference",
        header: "N° orden del cliente",
        cell: ({ row }: { row: any }) => (
          <span className="text-xs text-gray-900 font-medium">{row.original.reference || "—"}</span>
        ),
      },
    {
      accessorKey: "contact",
      header: variant === "internal" ? "Proveedor" : "Cliente",
      cell: ({ row }) => <span className="text-xs text-gray-900">{row.original.contact ?? "NO ESPECIFICADO"}</span>,
    },
    {
      accessorKey: "issue_date",
      header: () => <div className="text-center">Fecha de emisión</div>,
      cell: ({ row }) => <span className="text-xs text-gray-600 text-center block">{row.original.issue_date}</span>,
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right">Total</div>,
      cell: ({ row }) => (
        <div className="text-xs text-gray-900 font-medium text-right">
          $ {Number(row.original.total || 0).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: ({ row }) => <PurchaseOrderStatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <ActionsCell purchaseOrder={row.original} basePath={basePath} />,
      enableSorting: false,
      enableHiding: false,
      size: 48,
    },
  ];
}
