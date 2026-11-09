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
import { getSupportDocumentColumns } from "./table/columns";
import { SupportDocumentTableToolbar } from "./table/SupportDocumentTableToolbar";
import { SupportDocumentFilterChips, filterValueToColumnId } from "./table/SupportDocumentFilterChips";
import { SupportDocumentTablePagination } from "./table/SupportDocumentTablePagination";
import type { SupportDocument } from "@/types/supportDocument";

interface ServerPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

interface SupportDocumentTableProps {
    documents: SupportDocument[];
    loading?: boolean;
    refreshing?: boolean;
    onRefresh?: () => void;
    columnFilters?: ColumnFiltersState;
    setColumnFilters?: (filters: ColumnFiltersState) => void;
    page: number;
    setPage: (page: number) => void;
    perPage: number;
    setPerPage: (perPage: number) => void;
    pagination: ServerPagination;
    search: string;
    setSearch: (search: string) => void;
    isError?: boolean;
    onCancel?: (id: string | number) => void;
}

export function SupportDocumentTable({
    documents,
    loading = false,
    refreshing = false,
    onRefresh,
    columnFilters: externalColumnFilters,
    setColumnFilters,
    page,
    setPage,
    perPage,
    setPerPage,
    pagination,
    search,
    setSearch,
    isError = false,
    onCancel,
}: SupportDocumentTableProps) {
    const router = useRouter();
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

    const effectiveFilters = externalColumnFilters ?? internalColumnFilters;

    const {
        selection: rowSelection,
        allSelected,
        someSelected,
        toggle: handleToggleSelection,
        toggleAll: handleToggleSelectAll,
    } = useTableSelection(
        documents,
        (d: SupportDocument) => String(d.id)
    );

    const columns = React.useMemo(
        () => getSupportDocumentColumns(router, onCancel),
        [router, onCancel]
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
        data: documents,
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

    const handleAddFilter = (filterValue: string) => {
        const columnId = filterValueToColumnId[filterValue];
        if (!columnId) return;
        if (effectiveFilters.some((f) => f.id === columnId)) return;
        setEffectiveFilters([...effectiveFilters, { id: columnId, value: "" }]);
    };

    return (
        <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Toolbar */}
            <SupportDocumentTableToolbar
                table={table}
                search={search}
                setSearch={setSearch}
                onAddFilter={handleAddFilter}
                perPage={perPage}
                setPerPage={setPerPage}
            />

            <SupportDocumentFilterChips
                columnFilters={effectiveFilters}
                setColumnFilters={setEffectiveFilters as any}
                table={table}
                onAddFilter={handleAddFilter}
            />

            {/* Table or Loading */}
            <div className="relative overflow-x-auto min-h-[300px] flex flex-col justify-between">
                <Table className="w-full text-xs text-center border-collapse">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/50">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
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
                        {documents.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    onClick={() => router.push(`/expenses/support-documents/${row.original.id}`)}
                                    className="hover:bg-slate-50 transition-colors duration-100 cursor-pointer"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="px-3 py-3 text-slate-700">
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
                                            No se encontraron documentos soporte. Intenta usar o quitar los filtros de búsqueda.
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

            {/* Pagination Footer */}
            <SupportDocumentTablePagination
                page={page}
                setPage={setPage}
                perPage={perPage}
                setPerPage={setPerPage}
                pagination={pagination}
                onRefresh={onRefresh}
                refreshing={refreshing}
            />
        </div>
    );
}
