"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { ArrowLeftRight, Building2, CreditCard, Eye, MoreVertical, Wallet } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/utils/format-currency";
import type { BankAccount, BankAccountType } from "@/lib/banks";

export const TYPE_LABELS: Record<BankAccountType, string> = {
    banco: "Banco",
    efectivo: "Efectivo",
    tarjeta: "Tarjeta",
};

export const TYPE_ICONS: Record<BankAccountType, React.ElementType> = {
    banco: Building2,
    efectivo: Wallet,
    tarjeta: CreditCard,
};

interface BankAccountActions {
    onTransfer: (account: BankAccount) => void;
    onEdit: (account: BankAccount) => void;
    onToggleStatus: (account: BankAccount) => void;
    onDelete: (account: BankAccount) => void;
    onReconcile: (account: BankAccount) => void;
}

export function getColumns(router: ReturnType<typeof useRouter>, actions: BankAccountActions): ColumnDef<BankAccount>[] {
    return [
        {
            accessorKey: "name",
            header: "Nombre",
            cell: ({ row }) => {
                const account = row.original;
                const Icon = TYPE_ICONS[account.type];
                return (
                    <span className={`flex items-center gap-2 font-medium text-gray-900 ${!account.is_active ? "opacity-50" : ""}`}>
                        <Icon className="w-4 h-4 text-gray-500 shrink-0" />
                        {account.name}
                    </span>
                );
            },
        },
        {
            accessorKey: "type",
            header: "Tipo de cuenta",
            cell: ({ row }) => {
                const account = row.original;
                const Icon = TYPE_ICONS[account.type];
                return (
                    <span className="inline-flex items-center gap-1.5 text-gray-600">
                        <Icon className="w-3.5 h-3.5" />
                        {TYPE_LABELS[account.type]}
                    </span>
                );
            },
        },
        {
            accessorKey: "account_number",
            header: "Número de cuenta",
            cell: ({ row }) => <span className="text-gray-600">{row.original.account_number || "-"}</span>,
        },
        {
            accessorKey: "balance",
            header: "Saldo",
            cell: ({ row }) => {
                const account = row.original;
                const isNegative = account.balance < 0 || (account.type === "tarjeta" && account.balance > 0);
                return (
                    <span className={`font-medium ${isNegative ? "text-destructive" : "text-emerald-600"}`}>
                        $ {formatAmount(account.balance)}
                    </span>
                );
            },
        },
        {
            id: "reconciliation",
            header: "Conciliación",
            cell: ({ row }) => (
                <button
                    className="h-8 px-3 rounded-md border border-gray-300 text-xs font-medium hover:bg-gray-50 cursor-pointer"
                    onClick={(e) => {
                        e.stopPropagation();
                        actions.onReconcile(row.original);
                    }}
                >
                    Conciliar
                </button>
            ),
        },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const account = row.original;
                return (
                    <div className="flex items-center justify-end gap-1">
                        <button
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/banks/${account.id}`);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => actions.onTransfer(account)} className="cursor-pointer">
                                    <ArrowLeftRight className="w-3.5 h-3.5 mr-2" />
                                    Transferir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => actions.onEdit(account)} className="cursor-pointer">
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => actions.onToggleStatus(account)} className="cursor-pointer">
                                    {account.is_active ? "Desactivar" : "Activar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => actions.onDelete(account)} className="cursor-pointer text-destructive focus:text-destructive">
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}
