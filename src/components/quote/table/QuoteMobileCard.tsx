"use client";

import { useRouter } from "next/navigation";
import type { QuoteSummary } from "@/types/quote";
import { StatusBadge, ActionsCell } from "@/components/quote/table/columns";

interface QuoteMobileCardProps {
  quote: QuoteSummary;
}

export function QuoteMobileCard({ quote }: QuoteMobileCardProps) {
  const router = useRouter();

  return (
    <div
      className="border-b border-gray-200 p-4 bg-white"
      onClick={() => router.push(`/sales/quotes/${quote.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{quote.number}</span>
        <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1">
          <ActionsCell quote={quote} />
        </div>
      </div>

      <div className="mt-0.5 truncate text-xs text-gray-600">
        {quote.contact ?? "NO ESPECIFICADO"}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-400">Creación</div>
          <div className="text-xs text-gray-600">{quote.created_at}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400">Total</div>
          <div className="text-sm font-medium text-gray-900">
            $ {Number(quote.total || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <StatusBadge status={quote.status} />
      </div>
    </div>
  );
}
