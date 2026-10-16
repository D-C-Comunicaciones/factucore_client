"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { showToast } from "@/components/sonner/CustomToaster";
import { useBankAccountsList } from "@/hooks/banks/useBanks";
import { useBankReconciliationsList, useCreateBankReconciliation } from "@/hooks/banks/useBanks";
import { BankReconciliationsTable } from "@/components/banks/table/BankReconciliationsTable";
import type { BankAccount } from "@/lib/banks";

export default function BankReconciliationsPage() {
    return (
        <Suspense fallback={null}>
            <BankReconciliationsContent />
        </Suspense>
    );
}

function toDateString(date?: Date): string | undefined {
    return date ? date.toISOString().split("T")[0] : undefined;
}

function BankReconciliationsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedAccountId = searchParams?.get("bank_account_id") ? Number(searchParams.get("bank_account_id")) : null;

    const [isNewOpen, setIsNewOpen] = useState(false);
    const [bankAccountId, setBankAccountId] = useState(preselectedAccountId ? String(preselectedAccountId) : "");

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        preselectedAccountId ? [{ id: "bank_account_id", value: String(preselectedAccountId) }] : []
    );

    const { data: accountsData } = useBankAccountsList();
    const bankAccounts: BankAccount[] = accountsData?.bank_accounts ?? [];

    const bankAccountFilterValue = columnFilters.find((f) => f.id === "bank_account_id")?.value as string | undefined;
    const statusFilterValue = columnFilters.find((f) => f.id === "status")?.value as string | undefined;
    const periodFilterValue = columnFilters.find((f) => f.id === "period")?.value as Date | undefined;

    const { data: reconciliations, isLoading, isError, refetch } = useBankReconciliationsList({
        bank_account_id: bankAccountFilterValue ? Number(bankAccountFilterValue) : undefined,
        status: statusFilterValue || undefined,
        from: toDateString(periodFilterValue),
        to: toDateString(periodFilterValue),
    });
    const createMutation = useCreateBankReconciliation();

    const accountOptions = bankAccounts.map((a) => ({ value: String(a.id), label: a.name }));

    const openNew = () => {
        setBankAccountId(preselectedAccountId ? String(preselectedAccountId) : "");
        setIsNewOpen(true);
    };

    useEffect(() => {
        if (searchParams?.get("new") === "1") {
            openNew();
            router.replace(preselectedAccountId ? `/banks/reconciliations?bank_account_id=${preselectedAccountId}` : "/banks/reconciliations");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreate = async () => {
        if (!bankAccountId) {
            showToast("Selecciona la cuenta bancaria a conciliar", "warning");
            return;
        }

        try {
            const res = await createMutation.mutateAsync({
                bank_account_id: Number(bankAccountId),
            });
            const reconciliation = (res.data as any)?.reconciliation;
            setIsNewOpen(false);
            if (reconciliation?.id) {
                router.push(`/banks/reconciliations/${reconciliation.id}`);
            }
        } catch (error: any) {
            showToast(error?.response?.data?.message || "No se pudo crear la conciliación", "error");
        }
    };

    const list = useMemo(() => reconciliations ?? [], [reconciliations]);

    return (
        <div className="w-full min-h-screen">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 py-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-lg md:text-xl font-bold text-foreground">Conciliaciones bancarias</h1>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Accede fácilmente a tu listado conciliaciones y mantén un control preciso de tus cuentas bancarias.
                        </p>
                    </div>
                    <Button
                        size="sm"
                        onClick={openNew}
                        className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground cursor-pointer"
                    >
                        <Plus className="w-3 h-3 mr-1" />
                        Nueva conciliación
                    </Button>
                </div>

                <BankReconciliationsTable
                    reconciliations={list}
                    bankAccounts={bankAccounts}
                    loading={isLoading}
                    isError={isError}
                    onRefresh={() => refetch()}
                    onCreateNew={openNew}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                />
            </div>

            <Dialog open={isNewOpen} onOpenChange={setIsNewOpen}>
                <DialogContent className="sm:max-w-[420px] bg-white">
                    <DialogHeader>
                        <DialogTitle>¿Qué cuenta deseas conciliar?</DialogTitle>
                        <DialogDescription>Elige la cuenta bancaria para empezar a conciliar tus movimientos.</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Cuenta bancaria</label>
                        <SearchableSelect value={bankAccountId} onValueChange={setBankAccountId} options={accountOptions} placeholder="Selecciona un banco" className="w-full h-9" />
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsNewOpen(false)} className="cursor-pointer">Cancelar</Button>
                        <Button onClick={handleCreate} disabled={createMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
                            {createMutation.isPending ? "Creando..." : "Continuar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
