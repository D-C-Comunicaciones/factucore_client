"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { ArrowLeftRight, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { showToast } from "@/components/sonner/CustomToaster";
import { formatAmount } from "@/utils/format-currency";
import { useBankAccountsList, useCreateBankReconciliation, useDeleteBankAccount, useToggleBankAccountStatus } from "@/hooks/banks/useBanks";
import { AddBankAccountModal } from "@/components/banks/AddBankAccountModal";
import { TransferModal } from "@/components/banks/TransferModal";
import { BankAccountsTable } from "@/components/banks/table/BankAccountsTable";
import type { BankAccount } from "@/lib/banks";

const RANGE_OPTIONS: { value: string; label: string }[] = [
    { value: "last_6_months", label: "Últimos 6 meses" },
    { value: "last_3_months", label: "Últimos 3 meses" },
    { value: "last_7_days", label: "Últimos 7 días" },
];

function formatMonthLabel(month: string): string {
    const [year, m] = month.split("-");
    const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return labels[(Number(m) || 1) - 1] ?? month;
}

export default function BancosPage() {
    return (
        <Suspense fallback={null}>
            <BancosPageContent />
        </Suspense>
    );
}

function BancosPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [range, setRange] = useState("last_6_months");
    const [search, setSearch] = useState("");
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);

    useEffect(() => {
        if (searchParams?.get("new") === "1") {
            setEditingAccount(null);
            setIsAddOpen(true);
            router.replace("/banks");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const typeFilterValue = (columnFilters.find((f) => f.id === "type")?.value as string) || undefined;

    const { data, isLoading, isError, refetch } = useBankAccountsList({
        search: search || undefined,
        range,
        type: typeFilterValue,
    });
    const deleteMutation = useDeleteBankAccount();
    const toggleMutation = useToggleBankAccountStatus();
    const createReconciliationMutation = useCreateBankReconciliation();

    const bankAccounts: BankAccount[] = data?.bank_accounts ?? [];
    const summary = data?.summary ?? { cash_balance: 0, credit_card_debt: 0, total_balance: 0 };
    const chartData = useMemo(
        () => (data?.cash_flow ?? []).map((p: any) => ({ label: formatMonthLabel(p.month), Ingresos: p.income, Gastos: p.expense })),
        [data?.cash_flow]
    );

    const handleDelete = async (account: BankAccount) => {
        if (!confirm(`¿Eliminar la cuenta "${account.name}"? Esta acción no se puede deshacer.`)) return;
        try {
            await deleteMutation.mutateAsync(account.id);
            showToast("Cuenta bancaria eliminada", "success");
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo eliminar la cuenta bancaria", "error");
        }
    };

    const handleToggleStatus = async (account: BankAccount) => {
        try {
            await toggleMutation.mutateAsync({ id: account.id, isActive: !account.is_active });
            showToast(account.is_active ? "Cuenta desactivada" : "Cuenta activada", "success");
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo actualizar el estado", "error");
        }
    };

    // El botón "Conciliar" de la lista se salta la pregunta "¿qué cuenta deseas conciliar?" —
    // ya sabemos la cuenta (la de la fila), así que se crea la conciliación de una vez y se
    // navega directo a su vista de detalle.
    const handleReconcile = async (account: BankAccount) => {
        try {
            const res = await createReconciliationMutation.mutateAsync({ bank_account_id: account.id });
            const reconciliation = (res.data as any)?.reconciliation;
            if (reconciliation?.id) {
                router.push(`/banks/reconciliations/${reconciliation.id}`);
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo crear la conciliación", "error");
        }
    };

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Bancos</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Controla los movimientos de dinero con tus cuentas de banco, efectivo y tarjetas de crédito.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsTransferOpen(true)}
                            className="text-xs border-border bg-white text-foreground hover:bg-primary/10 hover:text-foreground transition-colors"
                        >
                            <ArrowLeftRight className="w-3 h-3 mr-1" />
                            Transferir
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => { setEditingAccount(null); setIsAddOpen(true); }}
                            className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            Agregar banco
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 bg-white rounded-lg border border-border p-4 md:p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold text-foreground">Ingresos y gastos</h2>
                            <SearchableSelect
                                value={range}
                                onValueChange={setRange}
                                options={RANGE_OPTIONS}
                                className="w-[170px] h-8 text-xs"
                            />
                        </div>
                        <div className="h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                                    <RechartsTooltip
                                        formatter={(value: number) => `$ ${formatAmount(value)}`}
                                        contentStyle={{ backgroundColor: "white", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} iconType="circle" />
                                    <Line type="monotone" dataKey="Ingresos" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                                    <Line type="monotone" dataKey="Gastos" stroke="var(--color-chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-border p-4 md:p-6 space-y-4">
                        <h2 className="text-sm font-bold text-foreground">Resumen</h2>
                        <div>
                            <div className="text-xs font-medium text-primary">Saldo en bancos y efectivo</div>
                            <div className="text-xl font-bold text-emerald-600 mt-1">$ {formatAmount(summary.cash_balance)}</div>
                        </div>
                        <div className="flex justify-center text-muted-foreground">−</div>
                        <div>
                            <div className="text-xs font-medium text-primary">Deuda en tarjetas de crédito</div>
                            <div className="text-xl font-bold text-destructive mt-1">$ {formatAmount(summary.credit_card_debt)}</div>
                        </div>
                        <div className="flex justify-center text-muted-foreground">=</div>
                        <div>
                            <div className="text-xs font-medium text-muted-foreground">Saldo total</div>
                            <div className="text-xl font-bold text-foreground mt-1">$ {formatAmount(summary.total_balance)}</div>
                        </div>
                    </div>
                </div>

                <BankAccountsTable
                    accounts={bankAccounts}
                    loading={isLoading}
                    isError={isError}
                    onRefresh={() => refetch()}
                    search={search}
                    setSearch={setSearch}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    onTransfer={() => setIsTransferOpen(true)}
                    onEdit={(account) => { setEditingAccount(account); setIsAddOpen(true); }}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDelete}
                    onReconcile={handleReconcile}
                />
            </div>

            <AddBankAccountModal
                open={isAddOpen}
                onOpenChange={(open) => { setIsAddOpen(open); if (!open) setEditingAccount(null); }}
                bankAccount={editingAccount}
            />

            <TransferModal open={isTransferOpen} onOpenChange={setIsTransferOpen} bankAccounts={bankAccounts} />
        </div>
    );
}
