"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PurchaseOrderDetailHeader } from "@/components/purchase-order/details/PurchaseOrderDetailHeader";
import { PurchaseOrderDetailDocument } from "@/components/purchase-order/details/PurchaseOrderDetailDocument";
import { CommentsAndReminders } from "@/components/shared/CommentsAndReminders";
import { useDeletePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { showToast } from "@/components/sonner/CustomToaster";
import type { PurchaseOrder } from "@/types/purchaseOrder";

export function PurchaseOrderDetailView({ purchaseOrder }: { purchaseOrder: PurchaseOrder }) {
  const router = useRouter();
  const deletePurchaseOrder = useDeletePurchaseOrder();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isAssociatedToInvoice = !!purchaseOrder.invoice_id;

  const handleDelete = async () => {
    try {
      await deletePurchaseOrder.mutateAsync(purchaseOrder.id);
      showToast("Orden de compra eliminada correctamente", "success");
      router.push("/sales/purchase-orders");
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "No se pudo eliminar la orden de compra";
      showToast(errorMsg, "error");
    } finally {
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4 space-y-6 text-sm text-slate-700 relative">
      <PurchaseOrderDetailHeader
        purchaseOrder={purchaseOrder}
        isAssociatedToInvoice={isAssociatedToInvoice}
        onEdit={() => router.push(`/sales/purchase-orders/${purchaseOrder.id}/edit`)}
        onDeleteClick={() => setShowDeleteDialog(true)}
      />

      <PurchaseOrderDetailDocument purchaseOrder={purchaseOrder} />

      <CommentsAndReminders type="purchase_order" commentableId={purchaseOrder.id} />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de que deseas eliminar esta orden de compra?</AlertDialogTitle>
            <AlertDialogDescription>Esta acción no se puede deshacer.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer hover:bg-gray-100" disabled={deletePurchaseOrder.isPending}>
              Cancelar
            </AlertDialogCancel>
            <Button variant="destructive" className="cursor-pointer" disabled={deletePurchaseOrder.isPending} onClick={handleDelete}>
              {deletePurchaseOrder.isPending && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
              Eliminar orden de compra
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
