"use client";

import * as React from "react";
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    flexRender,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTableSelection } from "@/hooks/use-table-selection";
import { getBillColumns } from "./table/columns";
import { BillTableToolbar } from "./table/BillTableToolbar";
import { BillTablePagination } from "./table/BillTablePagination";
import type { Bill } from "@/types/bill";

interface ServerPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface BillTableProps {
    data: Bill[];
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    columnFilters?: ColumnFiltersState;
    setColumnFilters?: (filters: ColumnFiltersState) => void;
    search?: string;
    setSearch?: (v: string) => void;
    page: number;
    setPage: (p: number) => void;
    perPage: number;
    setPerPage: (n: number) => void;
    pagination: ServerPagination;
    onCancelBill?: (id: number | string) => void;
    onApplyFilters?: (filters: any) => void;
}

export function BillTable({
    data,
    loading = false,
    refreshing = false,
    onRefresh,
    columnFilters,
    setColumnFilters,
    search = "",
    setSearch = () => {},
    page,
    setPage,
    perPage,
    setPerPage,
    pagination,
    onCancelBill,
    onApplyFilters,
}: BillTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const effectiveFilters = columnFilters ?? internalColumnFilters;

    const {
        selection: rowSelection,
        allSelected,
        someSelected,
        toggle: handleToggleSelection,
        toggleAll: handleToggleSelectAll,
    } = useTableSelection(
        data,
        (b: Bill) => String(b.id)
    );

    const columns = React.useMemo(
        () => getBillColumns(router, onCancelBill),
        [router, onCancelBill]
    );

    const setEffectiveFilters = React.useCallback(
        (updaterOrValue: ColumnFiltersState | ((old: ColumnFiltersState) => ColumnFiltersState)) => {
            const resolve = (prev: ColumnFiltersState) =>
                typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue;

            if (setColumnFilters) {
                setColumnFilters(resolve(effectiveFilters));
            } else {
                setInternalColumnFilters((prev) => resolve(prev));
            }
        },
        [setColumnFilters, effectiveFilters]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters: effectiveFilters,
            columnVisibility,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: () => {},
        onSortingChange: setSorting,
        onColumnFiltersChange: setEffectiveFilters as any,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
    });

    const handleAddFilter = (filterKey: string) => {
        // filter handler
    };

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            {/* Toolbar */}
            <BillTableToolbar
                search={search}
                setSearch={setSearch}
                onAddFilter={handleAddFilter}
            />

            {/* Table or Loading / Empty */}
            <div className="relative overflow-x-auto min-h-[340px] flex flex-col justify-between">
                <Table className="w-full text-xs text-center border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{
                                            width: header.getSize() !== 150 ? header.getSize() : undefined,
                                        }}
                                        className="select-none text-center"
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 bg-white">
                        {data.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => router.push(`/expenses/bills/${row.original.id}`)}
                                    className={`transition-colors hover:bg-slate-50/80 cursor-pointer ${
                                        row.getIsSelected() ? "bg-blue-50/40" : ""
                                    }`}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-3 py-3 whitespace-nowrap align-middle">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : loading ? (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="bg-white text-center align-middle p-0">
                                    <div className="h-64 bg-white" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="bg-white text-center align-middle p-0">
                                    <div className="flex h-64 flex-col items-center justify-center py-8 text-center px-4">
                                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
                                            <svg className="w-8 h-8 stroke-[1.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground mb-1">
                                            Sin resultados
                                        </h3>
                                        <p className="text-xs text-muted-foreground max-w-sm">
                                            No se encontraron facturas de compra. Intenta usar o quitar los filtros de búsqueda.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {loading && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
                    </div>
                )}
            </div>

            {/* Pagination */}
            <BillTablePagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={pagination}
                onRefresh={onRefresh}
                refreshing={refreshing || loading}
            />
        </div>
    );
}
