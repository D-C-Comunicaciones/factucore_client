import React from "react";
import { Info } from "lucide-react";
import { formatCurrency } from "@/utils/format-currency";
import Link from "next/link";

interface PaymentDetailAccountingAccountsProps {
  invoice?: {
    id: number;
    number: string;
    created_at: string;
    total: string | number;
    paid: string | number;
    pending: string | number;
  };
}

export function PaymentDetailAccountingAccounts({ invoice }: PaymentDetailAccountingAccountsProps) {
  if (!invoice) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4">
          <Info className="w-6 h-6 text-blue-500" />
        </div>
        <h3 className="text-sm font-medium text-slate-800 mb-1">
          Este pago no está asociado a ninguna factura
        </h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Si el pago no tiene una factura asociada se convertirá en un anticipo a favor del cliente
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-sm font-semibold text-slate-800 mb-4">Facturas asociadas</h3>
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="py-3 px-4 font-medium">Factura</th>
              <th className="py-3 px-4 font-medium">Fecha de creación</th>
              <th className="py-3 px-4 font-medium text-right">Total Factura</th>
              <th className="py-3 px-4 font-medium text-right">Monto Pagado</th>
              <th className="py-3 px-4 font-medium text-right">Saldo Pendiente</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-3 px-4 font-medium text-primary">
                <Link href={`/sales/invoices/${invoice.id}`} className="hover:underline cursor-pointer">
                  {invoice.number}
                </Link>
              </td>
              <td className="py-3 px-4 text-slate-600">
                {invoice.created_at}
              </td>
              <td className="py-3 px-4 text-slate-600 text-right">
                {formatCurrency(Number(invoice.total))}
              </td>
              <td className="py-3 px-4 text-slate-600 text-right">
                {formatCurrency(Number(invoice.paid))}
              </td>
              <td className="py-3 px-4 text-slate-600 text-right">
                {formatCurrency(Number(invoice.pending))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
