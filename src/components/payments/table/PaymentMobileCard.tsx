"use client";

import { useRouter } from "next/navigation";
import type { Payment } from "@/types/payments";
import { PaymentActionsCell } from "@/components/payments/table/columns";
import { PaymentStatusBadge } from "@/components/payments/table/PaymentStatusBadge";
import { SelectRowCheckbox } from "@/components/ui/selection-checkbox";

interface PaymentMobileCardProps {
  payment: Payment;
  selected: boolean;
  onToggleSelection: () => void;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PaymentMobileCard({
  payment,
  selected,
  onToggleSelection,
  onView,
  onEdit,
  onDelete,
}: PaymentMobileCardProps) {
  const router = useRouter();
  const contactId = payment.contact_id || payment.customer_id;

  return (
    <div
      className={`flex items-start gap-3 border-b border-border p-4 ${selected ? "bg-primary/5" : "bg-white"}`}
      onClick={() => router.push(`/sales/payments/${payment.id}`)}
    >
      <div className="pt-0.5" onClick={(e) => e.stopPropagation()} data-no-row-select="true">
        <SelectRowCheckbox checked={selected} onToggle={onToggleSelection} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900">{payment.number}</span>
          <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1 shrink-0">
            <PaymentActionsCell payment={payment} onView={onView} onEdit={onEdit} onDelete={onDelete} />
          </div>
        </div>

        <div className="mt-0.5 truncate text-xs text-gray-600">{payment.customer}</div>
        {payment.account_name && (
          <div className="text-xs text-gray-400">{payment.account_name}</div>
        )}

        <div className="mt-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] text-gray-400">Creación</div>
            <div className="text-xs text-gray-600">{payment.created_at}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-gray-400">Monto</div>
            <div className="text-sm font-medium text-gray-900">
              $ {Number(payment.amount || 0).toLocaleString("es-CO")}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <PaymentStatusBadge status={payment.payment_status} />
        </div>
      </div>
    </div>
  );
}
