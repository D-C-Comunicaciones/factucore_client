import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { accountsApi, journalEntriesApi, CreateAccountPayload, CreateJournalEntryPayload } from "@/lib/accounting";

const ACCOUNTS_KEY = ["accounts"];
const JOURNAL_ENTRIES_KEY = ["journal-entries"];

export function useAccountsList(params?: { search?: string; postable_only?: boolean }) {
    return useQuery({
        queryKey: [...ACCOUNTS_KEY, params],
        queryFn: async () => {
            const res = await accountsApi.list(params);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener las cuentas contables");
            }
            return res.data?.accounts ?? [];
        },
    });
}

export function useChooseCatalog() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (catalog: "niif" | "puc") => {
            const res: any = await accountsApi.chooseCatalog(catalog);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al configurar el catálogo de cuentas");
            }
            return res.data?.accounts ?? 0;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useSortMode() {
    return useQuery({
        queryKey: ["accounts-sort-mode"],
        queryFn: async () => {
            const res: any = await accountsApi.sortMode();
            return (res?.data?.sort_mode ?? "code") as "code" | "manual";
        },
    });
}

export function useUpdateSortMode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (mode: "code" | "manual") => {
            const res: any = await accountsApi.updateSortMode(mode);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar el orden");
            }
            return res.data?.sort_mode;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts-sort-mode"] });
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useReorderAccounts() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (orderedIds: number[]) => {
            const res: any = await accountsApi.reorder(orderedIds);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al reordenar las cuentas");
            }
            return true;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useAccountTypes() {
    return useQuery({
        queryKey: ["account-types"],
        queryFn: async () => {
            const res: any = await accountsApi.accountTypes();
            return res?.data?.account_types ?? [];
        },
    });
}

export function useAccountUsages() {
    return useQuery({
        queryKey: ["account-usages"],
        queryFn: async () => {
            const res: any = await accountsApi.accountUsages();
            return res?.data?.account_usages ?? [];
        },
    });
}

export function useCreateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateAccountPayload) => {
            const res: any = await accountsApi.create(payload);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear la cuenta contable");
            }
            return res.data?.account;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useUpdateAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<CreateAccountPayload> }) => {
            const res: any = await accountsApi.update(id, data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar la cuenta contable");
            }
            return res.data?.account;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useDeleteAccount() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const res: any = await accountsApi.delete(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al eliminar la cuenta contable");
            }
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ACCOUNTS_KEY });
        },
    });
}

export function useJournalEntriesList(params?: { page?: number; per_page?: number; date_from?: string; date_to?: string; source_type?: string; account_id?: number | string }) {
    return useQuery({
        queryKey: [...JOURNAL_ENTRIES_KEY, params],
        queryFn: async () => {
            const res: any = await journalEntriesApi.list(params);
            return {
                entries: res?.data?.journal_entries ?? [],
                pagination: res?.data?.pagination,
            };
        },
    });
}

export function useVoucherTypes() {
    return useQuery({
        queryKey: ["voucher-types"],
        queryFn: async () => {
            const res: any = await journalEntriesApi.voucherTypes();
            return res?.data?.voucher_types ?? [];
        },
    });
}

export function useJournalEntryNextNumber(voucherType: string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ["journal-entry-next-number", voucherType],
        queryFn: async () => {
            const res: any = await journalEntriesApi.nextNumber(voucherType);
            return { prefix: res?.data?.prefix ?? "", number: res?.data?.number ?? 1 };
        },
        enabled: Boolean(voucherType) && (options?.enabled ?? true),
    });
}

export function useJournalEntry(id: number | string, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...JOURNAL_ENTRIES_KEY, id],
        queryFn: async () => {
            const res: any = await journalEntriesApi.get(Number(id));
            return res?.data?.journal_entry;
        },
        enabled: Boolean(id) && (options?.enabled ?? true),
    });
}

export function useCreateJournalEntry() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: CreateJournalEntryPayload) => {
            const res: any = await journalEntriesApi.create(payload);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear el comprobante contable");
            }
            return res.data?.journal_entry;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_KEY });
            queryClient.invalidateQueries({ queryKey: ["journal-entry-next-number"] });
        },
    });
}
