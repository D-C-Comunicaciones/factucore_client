"use client";

import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table";

import { getReconciliationColumns } from "@/components/banks/table/reconciliationColumns";
import { BankReconciliationsTableToolbar } from "@/components/banks/table/BankReconciliationsTableToolbar";
import { BankReconciliationFilterChips, filterValueToColumnId } from "@/components/banks/table/BankReconciliationFilterChips";
import { BankReconciliationsTableBody } from "@/components/banks/table/BankReconciliationsTableBody";
import { InvoiceTablePagination } from "@/components/invoice/table/InvoiceTablePagination";
import type { BankAccount, BankReconciliation } from "@/lib/banks";

interface BankReconciliationsTableProps {
    reconciliations: BankReconciliation[];
    bankAccounts: BankAccount[];
    loading?: boolean;
    isError?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    onCreateNew: () => void;
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
}

export function BankReconciliationsTable({
    reconciliations,
    bankAccounts,
    loading,
    isError = false,
    refreshing = false,
    onRefresh,
    onCreateNew,
    columnFilters,
    setColumnFilters,
}: BankReconciliationsTableProps) {
    const columns = React.useMemo(() => getReconciliationColumns(), []);

    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);

    React.useEffect(() => {
        setPage(1);
    }, [columnFilters, reconciliations.length]);

    const total = reconciliations.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, lastPage);
    const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
    const to = Math.min(safePage * perPage, total);
    const pageRows = React.useMemo(
        () => reconciliations.slice((safePage - 1) * perPage, safePage * perPage),
        [reconciliations, safePage, perPage]
    );

    const hasQueryContext = columnFilters.some((f) => Boolean(f.value));

    const table = useReactTable({
        data: pageRows,
        columns,
        state: { columnFilters },
        onColumnFiltersChange: setColumnFilters as any,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        rowCount: total,
    });

    function handleAddFilter(filterValue: string) {
        const columnId = filterValueToColumnId[filterValue];
        if (!columnId) return;
        if (columnFilters.some((f) => f.id === columnId)) return;
        setColumnFilters([...columnFilters, { id: columnId, value: "" }]);
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            <BankReconciliationsTableToolbar onAddFilter={handleAddFilter} activeFilterCount={columnFilters.length} />

            <BankReconciliationFilterChips
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters as any}
                table={table}
                bankAccounts={bankAccounts}
                onAddFilter={handleAddFilter}
            />

            <BankReconciliationsTableBody
                table={table}
                columns={columns}
                loading={loading}
                showNoDataMessage={!hasQueryContext && !loading}
                isError={isError}
                onCreateNew={onCreateNew}
            />

            <InvoiceTablePagination
                page={safePage}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={{ current_page: safePage, per_page: perPage, total, last_page: lastPage, from, to }}
                perPageLabel="Conciliaciones por pagina:"
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </div>
    );
}
