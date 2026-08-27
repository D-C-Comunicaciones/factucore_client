"use client";

import { useRouter } from "next/navigation";
import type { RemissionSummary } from "@/types/remission";
import { StatusBadge, ActionsCell } from "@/components/remission/table/columns";

interface RemissionMobileCardProps {
  remission: RemissionSummary;
}

export function RemissionMobileCard({ remission }: RemissionMobileCardProps) {
  const router = useRouter();

  return (
    <div
      className="border-b border-gray-200 p-4 bg-white"
      onClick={() => router.push(`/remissions/${remission.id}`)}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold text-gray-900">{remission.number}</span>
        <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1">
          <ActionsCell remission={remission} />
        </div>
      </div>

      <div className="mt-0.5 truncate text-xs text-gray-600">
        {remission.contact ?? "NO ESPECIFICADO"}
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] text-gray-400">Creación</div>
          <div className="text-xs text-gray-600">{remission.created_at}</div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-400">Total</div>
          <div className="text-sm font-medium text-gray-900">
            $ {Number(remission.total || 0).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3">
        <StatusBadge status={remission.status} />
      </div>
    </div>
  );
}
