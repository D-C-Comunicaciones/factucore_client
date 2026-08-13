import React from "react";
import Link from "next/link";
import { PaymentStatusBadge } from "../table/PaymentStatusBadge";

interface PaymentDetailInfoProps {
  status: string;
  customerName: string;
  customerId?: string | number;
  creationDate: string;
  paymentMethod: string;
  bankAccount: string;
  notes: string;
}

export function PaymentDetailInfo({
  status,
  customerName,
  customerId,
  creationDate,
  paymentMethod,
  bankAccount,
  notes,
}: PaymentDetailInfoProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
      <h3 className="text-[15px] font-semibold text-slate-800 mb-6">
        Información del pago
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {/* Row 1 */}
        <div>
          <div className="text-[13px] font-medium text-slate-500 mb-2">Estado</div>
          <PaymentStatusBadge status={status} />
        </div>
        <div className="hidden md:block"></div>

        {/* Row 2 */}
        <div>
          <div className="text-[13px] font-medium text-slate-500 mb-1">Cliente</div>
          <Link
            href={customerId ? `/contacts/${customerId}` : "#"}
            className="text-sm font-medium text-primary hover:underline cursor-pointer"
          >
            {customerName}
          </Link>
        </div>
        <div>
          <div className="text-[13px] font-medium text-slate-500 mb-1">Fecha de creación</div>
          <div className="text-sm text-slate-700">{creationDate}</div>
        </div>

        {/* Row 3 */}
        <div>
          <div className="text-[13px] font-medium text-slate-500 mb-1">Forma de pago</div>
          <div className="text-sm text-slate-700">{paymentMethod || "—"}</div>
        </div>
        <div>
          <div className="text-[13px] font-medium text-slate-500 mb-1">Cuenta bancaria</div>
          <Link href="#" className="text-sm font-medium text-primary hover:underline">
            {bankAccount || "—"}
          </Link>
        </div>

        {/* Row 4 */}
        <div className="col-span-1 md:col-span-2">
          <div className="text-[13px] font-medium text-slate-500 mb-1">Notas</div>
          <div className="text-sm text-slate-700 whitespace-pre-wrap">
            {notes || "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
