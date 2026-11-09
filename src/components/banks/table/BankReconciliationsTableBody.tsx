"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Table as TanTable, ColumnDef, flexRender } from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Building2 } from "lucide-react";
import type { BankReconciliation } from "@/lib/banks";

interface BankReconciliationsTableBodyProps {
    table: TanTable<BankReconciliation>;
    columns: ColumnDef<BankReconciliation>[];
    loading?: boolean;
    showNoDataMessage?: boolean;
    isError?: boolean;
    onCreateNew: () => void;
}

export function BankReconciliationsTableBody({
    table,
    columns,
    loading,
    showNoDataMessage = false,
    isError = false,
    onCreateNew,
}: BankReconciliationsTableBodyProps) {
    const router = useRouter();
    const rows = table.getRowModel().rows;
    const hasRows = rows.length > 0;

    const stateContent = loading ? (
        <div className="h-64 bg-white" />
    ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
            <div className="text-lg font-semibold text-red-500">Error al cargar las conciliaciones</div>
            <div className="text-sm text-gray-500 mt-1">Verifica tu conexión a internet e intenta de nuevo</div>
        </div>
    ) : (
        <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
            {showNoDataMessage ? (
                <>
                    <Building2 className="w-10 h-10 text-gray-300 mb-4" />
                    <div className="text-center text-xl font-medium text-[#003B73]">¡Crea tu primera conciliación!</div>
                    <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
                        Concilia tus movimientos bancarios y genera reportes detallados al instante.
                    </div>
                    <button
                        type="button"
                        className="cursor-pointer inline-flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-medium text-[#003B73] hover:bg-gray-50 transition-colors shadow-sm"
                        onClick={onCreateNew}
                    >
                        Nueva conciliación
                    </button>
                </>
            ) : (
                <>
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">No se encontraron conciliaciones con los filtros aplicados</div>
                </>
            )}
        </div>
    );

    return (
        <div className="relative">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="bg-gray-50/50">
                                {hg.headers.map((header, idx) => {
                                    const thClass = idx === 0 ? "border-l border-gray-200" : idx === hg.headers.length - 1 ? "border-r border-gray-200" : "";
                                    return (
                                        <TableHead key={header.id} className={thClass}>
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {hasRows ? (
                            rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-slate-50 cursor-pointer"
                                    onClick={() => router.push(`/banks/reconciliations/${row.original.id}`)}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow className="hover:bg-transparent">
                                <TableCell colSpan={columns.length} className="bg-white text-center align-middle p-0">
                                    {stateContent}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/55">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-ring/25 border-t-primary" />
                </div>
            )}
        </div>
    );
}
