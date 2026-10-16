import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bankAccountsApi, bankAccountTypesApi, bankTransfersApi, bankReconciliationsApi } from "@/lib/banks";
import { QUERY_KEYS } from "@/lib/queryKeys";

const BANK_ACCOUNTS_KEY = ["bank-accounts"];
const BANK_ACCOUNT_TYPES_KEY = ["bank-account-types"];
const BANK_TRANSFERS_KEY = ["bank-transfers"];
const BANK_RECONCILIATIONS_KEY = ["bank-reconciliations"];

export function useBankAccountTypesList() {
    return useQuery({
        queryKey: BANK_ACCOUNT_TYPES_KEY,
        queryFn: async () => {
            const res = await bankAccountTypesApi.list();
            return ((res.data as any)?.bank_account_types ?? []) as import("@/lib/banks").BankAccountTypeOption[];
        },
        staleTime: 10 * 60 * 1000,
    });
}

export function useBankAccountsList(params?: { search?: string; range?: string; type?: string }) {
    return useQuery({
        queryKey: [...BANK_ACCOUNTS_KEY, params],
        queryFn: async () => {
            const res = await bankAccountsApi.list(params);
            return res.data as { bank_accounts: any[]; summary: any; cash_flow: any[] };
        },
    });
}

export function useBankAccount(id: number | null, params?: { from?: string; to?: string; only_unreconciled?: boolean }) {
    return useQuery({
        queryKey: [...BANK_ACCOUNTS_KEY, id, params],
        queryFn: async () => {
            const res = await bankAccountsApi.show(id as number, params);
            return res.data as { bank_account: any; movements: any[] };
        },
        enabled: !!id,
    });
}

function invalidateBankAccounts(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: BANK_ACCOUNTS_KEY });
    // El select de "cuenta bancaria" en pagos (recibidos/gastos) lee del catálogo, no de este
    // módulo — sin esto queda con datos obsoletos tras crear/editar/borrar una cuenta bancaria.
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.bankAccounts() });
}

export function useCreateBankAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => bankAccountsApi.create(payload),
        onSuccess: () => invalidateBankAccounts(queryClient),
    });
}

export function useUpdateBankAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => bankAccountsApi.update(id, data),
        onSuccess: () => invalidateBankAccounts(queryClient),
    });
}

export function useDeleteBankAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => bankAccountsApi.remove(id),
        onSuccess: () => invalidateBankAccounts(queryClient),
    });
}

export function useToggleBankAccountStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => bankAccountsApi.toggleStatus(id, isActive),
        onSuccess: () => invalidateBankAccounts(queryClient),
    });
}

export function useBankTransfersList(bankAccountId?: number) {
    return useQuery({
        queryKey: [...BANK_TRANSFERS_KEY, bankAccountId],
        queryFn: async () => {
            const res = await bankTransfersApi.list(bankAccountId);
            return (res.data as any)?.transfers ?? [];
        },
    });
}

export function useCreateBankTransfer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: any) => bankTransfersApi.create(payload),
        onSuccess: () => {
            invalidateBankAccounts(queryClient);
            queryClient.invalidateQueries({ queryKey: BANK_TRANSFERS_KEY });
        },
    });
}

export function useBankReconciliationsList(params?: { bank_account_id?: number; status?: string; from?: string; to?: string }) {
    return useQuery({
        queryKey: [...BANK_RECONCILIATIONS_KEY, params],
        queryFn: async () => {
            const res = await bankReconciliationsApi.list(params);
            return (res.data as any)?.reconciliations ?? [];
        },
    });
}

export function useBankReconciliation(id: number | null, params?: { include_reconciled?: boolean }) {
    return useQuery({
        queryKey: [...BANK_RECONCILIATIONS_KEY, id, params],
        queryFn: async () => {
            const res = await bankReconciliationsApi.show(id as number, params);
            return res.data as { reconciliation: any; movements: any[] };
        },
        enabled: !!id,
    });
}

export function useCreateBankReconciliation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: { bank_account_id: number; period_start?: string; period_end?: string }) =>
            bankReconciliationsApi.create(payload),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: BANK_RECONCILIATIONS_KEY }),
    });
}

export function useUpdateBankReconciliation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: any }) => bankReconciliationsApi.update(id, data),
        onSuccess: (_res, vars) => {
            queryClient.invalidateQueries({ queryKey: [...BANK_RECONCILIATIONS_KEY, vars.id] });
        },
    });
}

export function useCompleteBankReconciliation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => bankReconciliationsApi.complete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BANK_RECONCILIATIONS_KEY });
            invalidateBankAccounts(queryClient);
        },
    });
}

export function useReopenBankReconciliation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => bankReconciliationsApi.reopen(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BANK_RECONCILIATIONS_KEY });
            invalidateBankAccounts(queryClient);
        },
    });
}
