"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PurchaseOrderStatusBadge } from "@/components/purchase-order/table/columns";
import { useDeletePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { showToast } from "@/components/sonner/CustomToaster";
import type { PurchaseOrder } from "@/types/purchaseOrder";

function contactLabel(contact: PurchaseOrder["contact"]): string {
  if (!contact) return "NO ESPECIFICADO";
  if (typeof contact === "string") return contact;
  return (
    contact.registration_name ||
    `${contact.first_name || ""} ${contact.last_name || ""}`.trim() ||
    contact.name ||
    "NO ESPECIFICADO"
  );
}

export function PurchaseOrderDetailView({ purchaseOrder }: { purchaseOrder: PurchaseOrder }) {
  const router = useRouter();
  const deletePurchaseOrder = useDeletePurchaseOrder();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAssociatedToInvoice = !!purchaseOrder.invoice_id;
  const lines = purchaseOrder.lines || purchaseOrder.items || [];
  const globalAdjustments = [...(purchaseOrder.global_discounts || []), ...(purchaseOrder.global_charges || [])];
  const hasBackendTotals = purchaseOrder.total !== undefined;

  const handleDelete = async () => {
    try {
      await deletePurchaseOrder.mutateAsync(purchaseOrder.id);
      showToast("Orden de compra eliminada correctamente", "success");
      router.push("/purchase-orders");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "No se pudo eliminar la orden de compra";
      showToast(errorMsg, "error");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="w-full min-h-screen">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-6">
          <div className="flex items-center text-sm text-primary font-medium">
            <Link href="/purchase-orders" className="hover:underline">
              Órdenes de compra recibidas
            </Link>
            <ChevronRight className="w-4 h-4 mx-1 text-slate-400" />
            <span className="text-slate-500">Detalle</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/purchase-orders")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#001D4A]">Orden de compra {purchaseOrder.reference || `#${purchaseOrder.id}`}</h1>
                <p className="text-sm text-slate-500 mt-0.5">Registrada el {purchaseOrder.created_at || purchaseOrder.issue_date}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PurchaseOrderStatusBadge status={purchaseOrder.status} />
              <Button variant="outline" size="sm" onClick={() => router.push(`/purchase-orders/${purchaseOrder.id}/edit`)}>
                <Pencil className="w-4 h-4 mr-1" />
                Editar
              </Button>

              {isAssociatedToInvoice ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button variant="outline" size="sm" disabled className="text-destructive">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Eliminar
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-zinc-800 text-white p-2 text-xs max-w-[220px]">
                      No se puede eliminar: ya está asociada a una factura.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Eliminar
                </Button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="block text-xs font-medium text-muted-foreground mb-1">Cliente</span>
                <span className="text-sm text-foreground font-medium">{contactLabel(purchaseOrder.contact)}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-muted-foreground mb-1">Fecha de emisión</span>
                <span className="text-sm text-foreground font-medium">{purchaseOrder.issue_date}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-muted-foreground mb-1">N° orden del cliente</span>
                <span className="text-sm text-foreground font-medium">{purchaseOrder.reference || "—"}</span>
              </div>
            </div>

            {purchaseOrder.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Notas</span>
                <span className="text-sm text-foreground">{purchaseOrder.notes}</span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Ítems</h3>
            <div className="overflow-x-auto w-full rounded-lg border border-border">
              <table className="min-w-full bg-background">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    {["Ítem", "Descripción", "Cantidad", "Precio unitario", "Descuento", "Impuesto", "Total"].map((title) => (
                      <th key={title} className="px-4 py-3 text-xs font-semibold text-muted-foreground text-left">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((item: any, idx: number) => {
                    const discount = (item.discounts || item.allowance_charges || [])[0];
                    const tax = (item.taxes || [])[0];
                    const lineTotal = item.line_total ?? Number(item.quantity || 0) * Number(item.unit_price || 0);
                    return (
                      <tr key={idx} className="border-b border-border bg-white">
                        <td className="px-4 py-3 text-sm text-foreground">{item.name || item.reference || `Ítem ${item.item_id}`}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{item.description || "—"}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-foreground">$ {Number(item.unit_price || 0).toLocaleString("es-CO")}</td>
                        <td className="px-4 py-3 text-sm text-destructive">
                          {discount ? (discount.value_type === "percentage" ? `${discount.value}%` : `- $ ${Number(discount.value).toLocaleString("es-CO")}`) : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{tax ? `${tax.name} (${tax.rate}%)` : "—"}</td>
                        <td className="px-4 py-3 text-sm font-medium text-foreground">$ {Number(lineTotal).toLocaleString("es-CO")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="p-4 bg-muted/10 border-t border-border flex justify-end">
                <div className="w-full max-w-xs space-y-1.5">
                  {hasBackendTotals ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="text-foreground">$ {Number(purchaseOrder.line_extension_amount || 0).toLocaleString("es-CO")}</span>
                      </div>
                      {!!purchaseOrder.discount_total && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Descuentos</span>
                          <span className="text-destructive">- $ {Number(purchaseOrder.discount_total).toLocaleString("es-CO")}</span>
                        </div>
                      )}
                      {!!purchaseOrder.charge_total && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Cargos</span>
                          <span className="text-foreground">$ {Number(purchaseOrder.charge_total).toLocaleString("es-CO")}</span>
                        </div>
                      )}
                      {!!purchaseOrder.tax_total && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Impuestos</span>
                          <span className="text-foreground">$ {Number(purchaseOrder.tax_total).toLocaleString("es-CO")}</span>
                        </div>
                      )}
                    </>
                  ) : null}
                  <div className="flex justify-between text-sm font-semibold pt-1 border-t border-border">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">
                      $ {Number(purchaseOrder.total ?? lines.reduce((sum: number, l: any) => sum + (l.line_total ?? Number(l.quantity || 0) * Number(l.unit_price || 0)), 0)).toLocaleString("es-CO")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {globalAdjustments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Ajustes globales</h3>
              <div className="bg-white rounded-lg border border-border divide-y divide-border">
                {globalAdjustments.map((adj: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-3">
                    <span className="text-sm text-foreground">{adj.reason || (adj.charge_indicator ? "Cargo" : "Descuento")}</span>
                    <span className={`text-sm font-medium ${adj.charge_indicator ? "text-foreground" : "text-destructive"}`}>
                      {adj.value_type === "percentage" ? `${adj.value}%` : `$ ${Number(adj.value).toLocaleString("es-CO")}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que deseas eliminar esta orden de compra?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePurchaseOrder.isPending}>Cancelar</AlertDialogCancel>
            <Button variant="destructive" disabled={deletePurchaseOrder.isPending} onClick={handleDelete}>
              {deletePurchaseOrder.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Eliminar orden de compra
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
