import React from "react";
import { Info } from "lucide-react";

interface PaymentInvoicesListProps {
  contactId: string | null;
}

export function PaymentInvoicesList({ contactId }: PaymentInvoicesListProps) {
  if (!contactId) {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-indigo-500" />
        <span className="text-sm text-indigo-900">
          Selecciona un cliente para traer sus facturas por cobrar.
        </span>
      </div>
    );
  }

  // Placeholder for when a client IS selected
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/50 p-4 border-b border-border text-sm font-medium text-foreground">
        Facturas por cobrar del cliente
      </div>
      <div className="p-8 text-center text-muted-foreground text-sm">
        Listado de facturas en desarrollo...
      </div>
    </div>
  );
}
