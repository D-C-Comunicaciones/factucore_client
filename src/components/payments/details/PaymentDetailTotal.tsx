import React from "react";
import { formatCurrency } from "@/utils/format-currency";

interface PaymentDetailTotalProps {
  amount: number | string;
}

export function PaymentDetailTotal({ amount }: PaymentDetailTotalProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
      <div className="text-sm font-medium text-slate-500 mb-1">Valor total</div>
      <div className="text-2xl font-semibold text-slate-800">
        {formatCurrency(Number(amount))}
      </div>
    </div>
  );
}
