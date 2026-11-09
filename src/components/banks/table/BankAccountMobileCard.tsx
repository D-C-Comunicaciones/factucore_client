"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftRight, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatAmount } from "@/utils/format-currency";
import { TYPE_ICONS, TYPE_LABELS } from "@/components/banks/table/columns";
import type { BankAccount } from "@/lib/banks";

interface BankAccountMobileCardProps {
    account: BankAccount;
    onTransfer: (account: BankAccount) => void;
    onEdit: (account: BankAccount) => void;
    onToggleStatus: (account: BankAccount) => void;
    onDelete: (account: BankAccount) => void;
    onReconcile: (account: BankAccount) => void;
}

export function BankAccountMobileCard({ account, onTransfer, onEdit, onToggleStatus, onDelete, onReconcile }: BankAccountMobileCardProps) {
    const router = useRouter();
    const Icon = TYPE_ICONS[account.type];
    const isNegative = account.balance < 0 || (account.type === "tarjeta" && account.balance > 0);

    return (
        <div
            className={`border-b border-gray-200 p-4 ${!account.is_active ? "opacity-50" : "bg-white"}`}
            onClick={() => router.push(`/banks/${account.id}`)}
        >
            <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />

                <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-gray-900">{account.name}</span>
                        <div onClick={(e) => e.stopPropagation()} className="-mr-2 -mt-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 cursor-pointer">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onTransfer(account)} className="cursor-pointer">
                                        <ArrowLeftRight className="w-3.5 h-3.5 mr-2" />
                                        Transferir
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onEdit(account)} className="cursor-pointer">Editar</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onToggleStatus(account)} className="cursor-pointer">
                                        {account.is_active ? "Desactivar" : "Activar"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onDelete(account)} className="cursor-pointer text-destructive focus:text-destructive">
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="mt-0.5 truncate text-xs text-gray-600">{TYPE_LABELS[account.type]} · {account.account_number || "-"}</div>

                    <div className="mt-3">
                        <div className="text-[11px] text-gray-400">Saldo</div>
                        <div className={`text-sm font-medium ${isNegative ? "text-destructive" : "text-emerald-600"}`}>
                            $ {formatAmount(account.balance)}
                        </div>
                    </div>

                    <div className="mt-3">
                        <button
                            className="h-8 px-3 rounded-md border border-gray-300 text-xs font-medium hover:bg-gray-50 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onReconcile(account);
                            }}
                        >
                            Conciliar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
