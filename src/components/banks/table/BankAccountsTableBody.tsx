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
import { BankAccountMobileCard } from "@/components/banks/table/BankAccountMobileCard";
import type { BankAccount } from "@/lib/banks";

interface BankAccountsTableBodyProps {
    table: TanTable<BankAccount>;
    columns: ColumnDef<BankAccount>[];
    loading?: boolean;
    showNoDataMessage?: boolean;
    isError?: boolean;
    onTransfer: (account: BankAccount) => void;
    onEdit: (account: BankAccount) => void;
    onToggleStatus: (account: BankAccount) => void;
    onDelete: (account: BankAccount) => void;
    onReconcile: (account: BankAccount) => void;
}

export function BankAccountsTableBody({
    table,
    columns,
    loading,
    showNoDataMessage = false,
    isError = false,
    onTransfer,
    onEdit,
    onToggleStatus,
    onDelete,
    onReconcile,
}: BankAccountsTableBodyProps) {
    const router = useRouter();
    const rows = table.getRowModel().rows;
    const hasRows = rows.length > 0;

    const stateContent = loading ? (
        <div className="h-64 bg-white" />
    ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
            <div className="text-lg font-semibold text-red-500">Error al cargar las cuentas bancarias</div>
            <div className="text-sm text-gray-500 mt-1">Verifica tu conexión a internet e intenta de nuevo</div>
        </div>
    ) : (
        <div className="flex h-64 flex-col items-center justify-center py-8 text-center">
            {showNoDataMessage ? (
                <>
                    <Building2 className="w-10 h-10 text-gray-300 mb-4" />
                    <div className="text-center text-xl font-medium text-[#003B73]">¡Aún no tienes cuentas bancarias!</div>
                    <div className="mt-2 mb-6 text-center text-sm text-gray-500 max-w-md">
                        Agrega tu primera cuenta para controlar tus movimientos de dinero.
                    </div>
                </>
            ) : (
                <>
                    <div className="text-lg font-semibold text-gray-700">Sin resultados</div>
                    <div className="text-sm text-gray-500 mt-1">La búsqueda no arrojó cuentas bancarias</div>
                </>
            )}
        </div>
    );

    return (
        <div className="relative">
            <div className="sm:hidden">
                {hasRows
                    ? rows.map((row) => (
                        <BankAccountMobileCard
                            key={row.id}
                            account={row.original}
                            onTransfer={onTransfer}
                            onEdit={onEdit}
                            onToggleStatus={onToggleStatus}
                            onDelete={onDelete}
                            onReconcile={onReconcile}
                        />
                    ))
                    : stateContent}
            </div>

            <div className="hidden sm:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((hg) => (
                            <TableRow key={hg.id} className="bg-gray-50/50">
                                {hg.headers.map((header, idx) => {
                                    const isActions = header.column.id === "actions";
                                    let thClass = "";
                                    if (!isActions) {
                                        if (idx === 0) thClass = "border-l border-gray-200";
                                        else if (idx === hg.headers.length - 1) thClass = "border-r border-gray-200";
                                    }
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
                                <TableRow key={row.id} className={`hover:bg-slate-50 ${!row.original.is_active ? "opacity-50" : ""}`}>
                                    {row.getVisibleCells().map((cell) => {
                                        const isClickable = cell.column.id !== "actions" && cell.column.id !== "reconciliation";
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={isClickable ? "cursor-pointer" : ""}
                                                onClick={() => {
                                                    if (isClickable) router.push(`/banks/${row.original.id}`);
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
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
