"use client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function PurchaseOrderPageHeader() {
  const router = useRouter();

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#0F2843]">Órdenes de compra recibidas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Registra las órdenes de compra que tus clientes te entregan para asociarlas a la factura de venta correspondiente.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => router.push("/purchase-orders/new")}
            className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
          >
            <Plus className="w-3 h-3 mr-1" />
            Nueva orden de compra
          </Button>
        </div>
      </div>
    </div>
  );
}
