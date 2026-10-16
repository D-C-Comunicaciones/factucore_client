"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowDownToLine,
    ArrowLeft,
    ArrowLeftRight,
    ArrowUpFromLine,
    Building2,
    CalendarDays,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    Download,
    MoreVertical,
    Pencil,
    RefreshCw,
    Trash2,
    Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/sonner/CustomToaster";
import { formatAmount } from "@/utils/format-currency";
import { formatDate } from "@/utils/format-date";
import { useBankAccount, useBankAccountsList, useCreateBankReconciliation, useToggleBankAccountStatus } from "@/hooks/banks/useBanks";
import { AddBankAccountModal } from "@/components/banks/AddBankAccountModal";
import { TransferModal } from "@/components/banks/TransferModal";
import type { BankAccount, BankAccountType } from "@/lib/banks";

const TYPE_LABELS: Record<BankAccountType, string> = {
    banco: "Banco",
    efectivo: "Efectivo",
    tarjeta: "Tarjeta de crédito",
};

const TYPE_ICONS: Record<BankAccountType, React.ElementType> = {
    banco: Building2,
    efectivo: Wallet,
    tarjeta: CreditCard,
};

function DetailSkeleton() {
    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex items-center justify-between gap-3">
                    <Skeleton className="h-4 w-32" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9" />
                        <Skeleton className="h-9 w-28" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-6 w-64" />
                    <Skeleton className="h-3 w-80" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                    <Skeleton className="h-20 rounded-lg" />
                </div>
                <div className="bg-white rounded-lg border border-border overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-32" />
                    </div>
                    <div className="p-4 space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-10 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BankAccountDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const [activeFilters, setActiveFilters] = useState<Array<"fecha" | "valor">>([]);
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [valueFilter, setValueFilter] = useState("");

    const { data, isLoading, refetch } = useBankAccount(id);
    const { data: accountsData } = useBankAccountsList();
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [viewingEntry, setViewingEntry] = useState<any | null>(null);

    const toggleMutation = useToggleBankAccountStatus();
    const createReconciliationMutation = useCreateBankReconciliation();

    const bankAccount = data?.bank_account;
    const allMovements = data?.movements ?? [];
    const bankAccounts: BankAccount[] = accountsData?.bank_accounts ?? [];

    const movements = useMemo(() => {
        return allMovements.filter((line: any) => {
            if (dateFilter) {
                const entryDate = line.journal_entry?.entry_date;
                if (!entryDate || entryDate.slice(0, 10) !== dateFilter.toISOString().slice(0, 10)) return false;
            }
            if (valueFilter.trim() !== "") {
                const target = Number(valueFilter);
                if (Number(line.debit) !== target && Number(line.credit) !== target) return false;
            }
            return true;
        });
    }, [allMovements, dateFilter, valueFilter]);

    const hasQueryContext = activeFilters.length > 0 && (Boolean(dateFilter) || valueFilter.trim() !== "");

    const removeFilter = (kind: "fecha" | "valor") => {
        setActiveFilters((prev) => prev.filter((f) => f !== kind));
        if (kind === "fecha") setDateFilter(undefined);
        if (kind === "valor") setValueFilter("");
    };

    const removeAllFilters = () => {
        setActiveFilters([]);
        setDateFilter(undefined);
        setValueFilter("");
    };

    const availableToAdd = (["fecha", "valor"] as const).filter((k) => !activeFilters.includes(k));

    const handleToggleStatus = async () => {
        if (!bankAccount) return;
        try {
            await toggleMutation.mutateAsync({ id: bankAccount.id, isActive: !bankAccount.is_active });
            showToast(bankAccount.is_active ? "Cuenta desactivada" : "Cuenta activada", "success");
            refetch();
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo actualizar el estado", "error");
        }
    };

    const handleCreateReconciliation = async () => {
        if (!bankAccount) return;
        try {
            const res = await createReconciliationMutation.mutateAsync({ bank_account_id: bankAccount.id });
            const reconciliation = (res.data as any)?.reconciliation;
            if (reconciliation?.id) {
                router.push(`/banks/reconciliations/${reconciliation.id}`);
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo crear la conciliación", "error");
        }
    };

    if (isLoading || !bankAccount) {
        return isLoading ? <DetailSkeleton /> : (
            <div className="w-full min-h-screen flex items-center justify-center text-muted-foreground">
                Cuenta bancaria no encontrada.
            </div>
        );
    }

    const Icon = TYPE_ICONS[bankAccount.type as BankAccountType];

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex items-center justify-between gap-3">
                    <Link href="/banks" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Bancos y cajas
                    </Link>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="cursor-pointer">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push("/sales/payments/new")} className="cursor-pointer">
                                    <ArrowDownToLine className="w-3.5 h-3.5 mr-2" />
                                    Crear pago recibido
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push("/expenses/payments/new")} className="cursor-pointer">
                                    <ArrowUpFromLine className="w-3.5 h-3.5 mr-2" />
                                    Crear nuevo pago
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setIsTransferOpen(true)} className="cursor-pointer">
                                    <ArrowLeftRight className="w-3.5 h-3.5 mr-2" />
                                    Transferir
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/banks/reconciliations?bank_account_id=${bankAccount.id}`)} className="cursor-pointer">
                                    Ver conciliaciones
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleToggleStatus} className="cursor-pointer">
                                    {bankAccount.is_active ? "Desactivar" : "Activar"}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                                    Conciliar
                                    <ChevronDown className="w-3.5 h-3.5 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem disabled className="cursor-not-allowed opacity-60">
                                    <Download className="w-3.5 h-3.5 mr-2" />
                                    Importar movimientos
                                    <span className="ml-2 text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">Beta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleCreateReconciliation} className="cursor-pointer">
                                    Crear manualmente
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <div>
                    <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        {bankAccount.name}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Conoce y administra toda la información de tu cuenta bancaria</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-foreground">{bankAccount.name}</div>
                            <button onClick={() => setIsEditOpen(true)} className="text-muted-foreground hover:text-primary cursor-pointer">
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{TYPE_LABELS[bankAccount.type as BankAccountType]}</div>
                    </div>
                    <div className="bg-white rounded-lg border border-border p-4 text-center flex flex-col items-center justify-center">
                        <div className="text-sm text-muted-foreground">Saldo actual</div>
                        <div className={`text-xl font-bold mt-1 ${bankAccount.balance < 0 || (bankAccount.type === "tarjeta" && bankAccount.balance > 0) ? "text-destructive" : "text-emerald-600"}`}>
                            $ {formatAmount(bankAccount.balance)}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-border p-4">
                        <div className="font-semibold text-foreground">Descripción</div>
                        <div className="text-sm text-muted-foreground mt-1">{bankAccount.description || "Esta cuenta no tiene descripción"}</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-border overflow-hidden">
                    <div className="min-h-12 px-4 py-2 border-b border-border flex flex-wrap items-center justify-between gap-2">
                        {availableToAdd.length > 0 && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-muted-foreground cursor-pointer">
                                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="mr-1.5">
                                            <path d="M3 4h14M6 10h8M9 16h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        Filtrar
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <div className="px-3 py-2 text-xs text-muted-foreground font-semibold">Filtrar Por</div>
                                    {availableToAdd.includes("fecha") && (
                                        <DropdownMenuItem onClick={() => setActiveFilters((p) => [...p, "fecha"])} className="cursor-pointer">
                                            <CalendarDays className="w-4 h-4 mr-2" />
                                            Fecha
                                        </DropdownMenuItem>
                                    )}
                                    {availableToAdd.includes("valor") && (
                                        <DropdownMenuItem onClick={() => setActiveFilters((p) => [...p, "valor"])} className="cursor-pointer">
                                            <CircleDollarSign className="w-4 h-4 mr-2" />
                                            Valor
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => refetch()} className="text-muted-foreground cursor-pointer ml-auto">
                            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                            Actualizar datos
                        </Button>
                    </div>

                    {activeFilters.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-white">
                            {activeFilters.includes("fecha") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background text-foreground text-xs font-medium shadow-sm hover:bg-primary/10 hover:text-primary transition-colors">
                                            <CalendarDays className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                            Fecha
                                            {dateFilter && <span className="ml-1 font-normal text-gray-500">{dateFilter.toLocaleDateString()}</span>}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="min-w-[220px] p-3 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                                            Fecha
                                            <button onClick={() => removeFilter("fecha")} title="Quitar filtro" className="p-1 rounded hover:bg-gray-100">
                                                <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                                            </button>
                                        </div>
                                        <input
                                            type="date"
                                            className="w-full h-9 px-2 text-xs border border-gray-300 rounded-md outline-none"
                                            onChange={(e) => setDateFilter(e.target.value ? new Date(e.target.value) : undefined)}
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            {activeFilters.includes("valor") && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="inline-flex items-center px-3 py-1 rounded-full border border-border bg-background text-foreground text-xs font-medium shadow-sm hover:bg-primary/10 hover:text-primary transition-colors">
                                            <CircleDollarSign className="w-3.5 h-3.5 mr-1 text-gray-400" />
                                            Valor
                                            {valueFilter && <span className="ml-1 font-normal text-gray-500">{valueFilter}</span>}
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start" className="min-w-[220px] p-3 space-y-2">
                                        <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
                                            Valor
                                            <button onClick={() => removeFilter("valor")} title="Quitar filtro" className="p-1 rounded hover:bg-gray-100">
                                                <Trash2 className="w-3.5 h-3.5 text-gray-400" />
                                            </button>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="0.00"
                                            value={valueFilter}
                                            onChange={(e) => setValueFilter(e.target.value)}
                                            className="w-full h-9 px-2 text-xs border border-gray-300 rounded-md outline-none"
                                        />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}

                            <button
                                className="ml-auto text-xs text-black font-medium px-2 py-1 rounded hover:bg-gray-100 cursor-pointer transition-colors"
                                onClick={removeAllFilters}
                            >
                                Remover filtros
                            </button>
                        </div>
                    )}

                    {movements.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Building2 className="w-10 h-10 text-muted-foreground" />
                            <p className="text-sm font-medium text-foreground">
                                {hasQueryContext ? "No se encontraron transacciones con los filtros aplicados" : "¡Crea tu primer movimiento!"}
                            </p>
                            {!hasQueryContext && (
                                <>
                                    <p className="text-xs text-muted-foreground text-center max-w-xs">
                                        Agrega tus movimientos para tener un registro completo y poder conciliar tu cuenta bancaria.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => router.push("/expenses/payments/new")}>
                                            Crear nuevo pago
                                        </Button>
                                        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => router.push("/sales/payments/new")}>
                                            Crear pago recibido
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/30 border-b border-border">
                                    <tr>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Comprobante</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Descripción</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Débito</th>
                                        <th className="text-right px-4 py-3 font-medium text-muted-foreground">Crédito</th>
                                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Conciliación</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {movements.map((line: any) => (
                                        <tr
                                            key={line.id}
                                            className={`hover:bg-muted/20 cursor-pointer transition-colors ${viewingEntry?.id === line.journal_entry?.id ? "bg-primary/5" : ""}`}
                                            onClick={() => setViewingEntry(viewingEntry?.id === line.journal_entry?.id ? null : line.journal_entry)}
                                        >
                                            <td className="px-4 py-3 text-muted-foreground">{formatDate(line.journal_entry?.entry_date)}</td>
                                            <td className="px-4 py-3 font-medium text-primary">
                                                {line.journal_entry?.prefix}-{line.journal_entry?.number}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">{line.description || line.journal_entry?.description || "-"}</td>
                                            <td className="px-4 py-3 text-right text-foreground">{Number(line.debit) > 0 ? `$ ${formatAmount(Number(line.debit))}` : "-"}</td>
                                            <td className="px-4 py-3 text-right text-foreground">{Number(line.credit) > 0 ? `$ ${formatAmount(Number(line.credit))}` : "-"}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${line.is_reconciled ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                                                    {line.is_reconciled ? "Conciliado" : "No conciliado"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {viewingEntry && (
                        <div className="border-t border-border">
                            <div className="px-4 pt-4">
                                <div className="inline-flex border-b-2 border-primary text-primary text-sm font-medium pb-2">
                                    Asiento contable
                                </div>
                            </div>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Asiento contable: <span className="font-semibold text-foreground">{viewingEntry.prefix}-{viewingEntry.number}</span>
                                    </span>
                                    <span className="text-muted-foreground">
                                        Fecha: <span className="font-semibold text-foreground">{formatDate(viewingEntry.entry_date)}</span>
                                    </span>
                                </div>

                                <div className="overflow-x-auto border border-border rounded-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-muted/30 border-b border-border">
                                            <tr>
                                                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Tercero</th>
                                                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Código</th>
                                                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Cuenta contable</th>
                                                <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Centro de costo</th>
                                                <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Débito</th>
                                                <th className="text-right px-3 py-2.5 font-medium text-muted-foreground">Crédito</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {(viewingEntry.lines || []).map((l: any) => (
                                                <tr key={l.id}>
                                                    <td className="px-3 py-2.5 text-muted-foreground">{l.contact?.name || l.contact?.registration_name || "-"}</td>
                                                    <td className="px-3 py-2.5 text-primary">{l.account?.code}</td>
                                                    <td className="px-3 py-2.5 text-foreground">{l.account?.name}</td>
                                                    <td className="px-3 py-2.5 text-muted-foreground">{l.cost_center?.name || "-"}</td>
                                                    <td className="px-3 py-2.5 text-right text-foreground">{Number(l.debit) > 0 ? `COP ${formatAmount(Number(l.debit))}$` : "-"}</td>
                                                    <td className="px-3 py-2.5 text-right text-foreground">{Number(l.credit) > 0 ? `COP ${formatAmount(Number(l.credit))}$` : "-"}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-semibold bg-muted/10">
                                                <td colSpan={4} className="px-3 py-2.5 text-right text-foreground">Total</td>
                                                <td className="px-3 py-2.5 text-right text-foreground">
                                                    COP {formatAmount((viewingEntry.lines || []).reduce((s: number, l: any) => s + Number(l.debit || 0), 0))}$
                                                </td>
                                                <td className="px-3 py-2.5 text-right text-foreground">
                                                    COP {formatAmount((viewingEntry.lines || []).reduce((s: number, l: any) => s + Number(l.credit || 0), 0))}$
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AddBankAccountModal open={isEditOpen} onOpenChange={setIsEditOpen} bankAccount={bankAccount} />
            <TransferModal open={isTransferOpen} onOpenChange={setIsTransferOpen} bankAccounts={bankAccounts} />
        </div>
    );
}
