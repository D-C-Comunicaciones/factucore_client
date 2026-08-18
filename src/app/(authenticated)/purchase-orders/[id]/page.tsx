"use client";

import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { usePurchaseOrder } from "@/hooks/purchaseOrders/usePurchaseOrders";
import { PurchaseOrderDetailView } from "@/components/purchase-order/details/PurchaseOrderDetailView";

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data, isLoading, isError } = usePurchaseOrder(id);

  const purchaseOrder = data?.data?.purchase_order || data?.data;

  if (isLoading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !purchaseOrder) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <p className="text-lg font-semibold text-gray-700">No se encontró la orden de compra</p>
        <button
          onClick={() => router.push("/purchase-orders")}
          className="text-primary text-sm font-medium hover:underline"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return <PurchaseOrderDetailView purchaseOrder={purchaseOrder} />;
}
