"use client";

import { useRouter } from "next/navigation";
import type { InvoiceSummary } from "@/types/invoice";
import { DianStatusBadge, StatusBadge, ActionsCell } from "@/components/invoice/table/columns";
import { SelectRowCheckbox } from "@/components/ui/selection-checkbox";

interface InvoiceMobileCardProps {
  invoice: InvoiceSummary;
  selected: boolean;
  onToggleSelection: () => void;
}

export function InvoiceMobileCard({ invoice, selected, onToggleSelection }: InvoiceMobileCardProps) {
  const router = useRouter();

  return (
    <div
      className={`border-b border-gray-200 p-4 ${selected ? "bg-primary/5" : "bg-white"}`}
      onClick={() => router.push(`/sales/invoices/${invoice.id}`)}
    >
      <div className="flex items-start gap-3">
        <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
          <SelectRowCheckbox checked={selected} onToggle={onToggleSelection} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-900">{invoice.number}</span>
            <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1">
              <ActionsCell invoice={invoice} />
            </div>
          </div>

          <div className="mt-0.5 truncate text-xs text-gray-600">
            {invoice.contact ?? "NO ESPECIFICADO"}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
            <div>
              <div className="text-[11px] text-gray-400">Total</div>
              <div className="text-sm font-medium text-gray-900">
                $ {Number(invoice.total).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">Por pagar</div>
              <div className="text-sm text-gray-900">
                $ {Number(invoice.pending_amount).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">Creación</div>
              <div className="text-xs text-gray-600">{invoice.created_at}</div>
            </div>
            <div>
              <div className="text-[11px] text-gray-400">Vencimiento</div>
              <div className="text-xs text-gray-600">{invoice.payment_due_date || invoice.created_at || "-"}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={invoice.status} pendingAmount={Number(invoice.pending_amount)} />
            <DianStatusBadge status={invoice.status_dian} />
          </div>
        </div>
      </div>
    </div>
  );
}
