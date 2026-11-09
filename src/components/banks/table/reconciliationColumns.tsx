"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatAmount } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import type { BankReconciliation } from "@/lib/banks";

export function getReconciliationColumns(): ColumnDef<BankReconciliation>[] {
    return [
        {
            id: "bank_account_id",
            header: "Cuenta",
            cell: ({ row }) => {
                const r = row.original as any;
                return <span className="font-medium text-primary hover:underline">{r.bank_account?.account?.name || r.bank_account?.name}</span>;
            },
        },
        {
            id: "period",
            header: "Periodo",
            cell: ({ row }) => (
                <span className="text-gray-600">{formatDate(row.original.period_start as any)} - {formatDate(row.original.period_end as any)}</span>
            ),
        },
        {
            id: "total_balance",
            header: "Saldo total",
            cell: ({ row }) => <span className="text-gray-900">$ {formatAmount(row.original.total_balance)}</span>,
        },
        {
            id: "difference",
            header: "Diferencia",
            cell: ({ row }) => {
                const diff = row.original.difference;
                return (
                    <span className={diff !== null && Math.abs(diff) > 0.01 ? "text-destructive" : "text-emerald-600"}>
                        {diff === null ? "-" : `$ ${formatAmount(diff)}`}
                    </span>
                );
            },
        },
        {
            id: "status",
            header: "Estado",
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {status === "completed" ? "Conciliada" : "En progreso"}
                    </span>
                );
            },
        },
    ];
}
