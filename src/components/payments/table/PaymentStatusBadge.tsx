import React from "react";
import { CheckCircle2, MoreHorizontal, Ban } from "lucide-react";

export function PaymentStatusBadge({
  status,
}: {
  status: "No conciliado" | "Conciliado" | "Anulado" | string;
}) {
  if (status === "Conciliado") {
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span>Conciliado</span>
      </div>
    );
  }
  if (status === "No conciliado") {
    return (
      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
        <div className="flex items-center justify-center w-4 h-4 rounded-full border border-slate-300">
          <MoreHorizontal className="w-2.5 h-2.5 text-slate-400" />
        </div>
        <span>No conciliado</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-red-500">
      <Ban className="w-4 h-4 text-red-500" />
      <span>Anulado</span>
    </div>
  );
}
