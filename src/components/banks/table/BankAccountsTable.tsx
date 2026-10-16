"use client";

import * as React from "react";
import {
    getCoreRowModel,
    useReactTable,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { getColumns } from "@/components/banks/table/columns";
import { BankAccountsTableToolbar } from "@/components/banks/table/BankAccountsTableToolbar";
import { BankAccountFilterChips, filterValueToColumnId } from "@/components/banks/table/BankAccountFilterChips";
import { BankAccountsTableBody } from "@/components/banks/table/BankAccountsTableBody";
import { InvoiceTablePagination } from "@/components/invoice/table/InvoiceTablePagination";
import type { BankAccount } from "@/lib/banks";

interface BankAccountsTableProps {
    accounts: BankAccount[];
    loading?: boolean;
    isError?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    search: string;
    setSearch: (v: string) => void;
    columnFilters: ColumnFiltersState;
    setColumnFilters: (filters: ColumnFiltersState) => void;
    onTransfer: (account: BankAccount) => void;
    onEdit: (account: BankAccount) => void;
    onToggleStatus: (account: BankAccount) => void;
    onDelete: (account: BankAccount) => void;
    onReconcile: (account: BankAccount) => void;
}

export function BankAccountsTable({
    accounts,
    loading,
    isError = false,
    refreshing = false,
    onRefresh,
    search,
    setSearch,
    columnFilters,
    setColumnFilters,
    onTransfer,
    onEdit,
    onToggleStatus,
    onDelete,
    onReconcile,
}: BankAccountsTableProps) {
    const router = useRouter();

    const columns = React.useMemo(
        () => getColumns(router, { onTransfer, onEdit, onToggleStatus, onDelete, onReconcile }),
        [router, onTransfer, onEdit, onToggleStatus, onDelete, onReconcile]
    );

    const [page, setPage] = React.useState(1);
    const [perPage, setPerPage] = React.useState(10);

    React.useEffect(() => {
        setPage(1);
    }, [search, columnFilters, accounts.length]);

    const total = accounts.length;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const safePage = Math.min(page, lastPage);
    const from = total === 0 ? 0 : (safePage - 1) * perPage + 1;
    const to = Math.min(safePage * perPage, total);
    const pageRows = React.useMemo(
        () => accounts.slice((safePage - 1) * perPage, safePage * perPage),
        [accounts, safePage, perPage]
    );

    const hasActiveFilters = columnFilters.some((f) => {
        if (typeof f.value === "string") return f.value.trim() !== "";
        return Boolean(f.value);
    });
    const hasQueryContext = Boolean(search.trim()) || hasActiveFilters;

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
            <BankAccountsTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAddFilter={handleAddFilter}
                activeFilterCount={columnFilters.length}
            />

            <BankAccountFilterChips
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters as any}
                table={table}
                onAddFilter={handleAddFilter}
            />

            <BankAccountsTableBody
                table={table}
                columns={columns}
                loading={loading}
                showNoDataMessage={!hasQueryContext && !loading}
                isError={isError}
                onTransfer={onTransfer}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                onDelete={onDelete}
                onReconcile={onReconcile}
            />

            <InvoiceTablePagination
                page={safePage}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={{ current_page: safePage, per_page: perPage, total, last_page: lastPage, from, to }}
                perPageLabel="Cuentas por pagina:"
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </div>
    );
}
