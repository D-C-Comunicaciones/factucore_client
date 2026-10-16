"use client";

import * as React from "react";
import { Building2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { InvoiceTablePagination } from "@/components/invoice/table/InvoiceTablePagination";
import { formatAmount } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";

interface ReconciliationMovementsTableProps {
    movements: any[];
    checkedIds: number[];
    onToggleLine: (id: number) => void;
    isCompleted: boolean;
    currentReconciliationId: number;
    loading?: boolean;
    onRefresh?: () => void;
}

export function ReconciliationMovementsTable({
    movements,
    checkedIds,
    onToggleLine,
    isCompleted,
    currentReconciliationId,
    loading,
    onRefresh,
}: ReconciliationMovementsTableProps) {
    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(30);

    React.useEffect(() => {
        setPage(1);
    }, [movements.length]);

    const total = movements.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, lastPage);
    const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
    const to = Math.min(safePage * perPage, total);
    const pageRows = movements.slice((safePage - 1) * perPage, safePage * perPage);

    return (
        <div className="bg-white rounded-lg border border-border overflow-hidden">
            <div className="relative">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50/50 border-b border-gray-200">
                            <tr>
                                <th className="w-10 px-4 py-3 border-l border-gray-200"></th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Comprobante</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-600">Débito</th>
                                <th className="text-right px-4 py-3 font-medium text-gray-600">Crédito</th>
                                <th className="text-left px-4 py-3 font-medium text-gray-600 border-r border-gray-200">Conciliación</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {pageRows.length === 0 ? (
                                <tr className="hover:bg-transparent">
                                    <td colSpan={7} className="p-0">
                                        {loading ? (
                                            <div className="h-64 bg-white" />
                                        ) : (
                                            <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
                                                <Building2 className="w-10 h-10 text-gray-300 mb-3" />
                                                <div className="text-lg font-medium text-[#003B73]">¡Aún no has registrado una transacción en este banco!</div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ) : (
                                pageRows.map((line: any) => {
                                    const claimedByOther = line.is_reconciled && line.bank_reconciliation_id !== currentReconciliationId;
                                    return (
                                        <tr key={line.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3">
                                                <Checkbox
                                                    checked={checkedIds.includes(line.id)}
                                                    onCheckedChange={() => onToggleLine(line.id)}
                                                    disabled={isCompleted || claimedByOther}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{formatDate(line.journal_entry?.entry_date)}</td>
                                            <td className="px-4 py-3 font-medium text-primary">{line.journal_entry?.prefix}-{line.journal_entry?.number}</td>
                                            <td className="px-4 py-3 text-gray-600">{line.description || line.journal_entry?.description || "-"}</td>
                                            <td className="px-4 py-3 text-right text-gray-900">{Number(line.debit) > 0 ? `$ ${formatAmount(Number(line.debit))}` : "-"}</td>
                                            <td className="px-4 py-3 text-right text-gray-900">{Number(line.credit) > 0 ? `$ ${formatAmount(Number(line.credit))}` : "-"}</td>
                                            <td className="px-4 py-3">
                                                {line.is_reconciled ? (
                                                    <span className="inline-flex flex-col text-xs">
                                                        <span className="font-medium text-emerald-700">Conciliado</span>
                                                        <span className="text-gray-500">
                                                            {formatDate(line.reconciled_at?.slice(0, 10))} · {line.reconciled_by?.name || "-"}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-medium text-amber-700">No conciliado</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
                    </div>
                )}
            </div>

            <InvoiceTablePagination
                page={safePage}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={{ current_page: safePage, per_page: perPage, total, last_page: lastPage, from, to }}
                perPageLabel="Ítems por página:"
                onRefresh={onRefresh}
                refreshing={loading}
            />
        </div>
    );
}
