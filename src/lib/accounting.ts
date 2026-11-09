import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export interface ChartAccount {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    is_active: boolean;
    type: string | null;
    account_type_id: number | null;
    account_usage_id: number | null;
    parent_id: number | null;
    level: number | null;
    is_postable: boolean | null;
    nature: "debito" | "credito" | null;
    usage: string | null;
    has_movements: boolean;
}

export interface CreateAccountPayload {
    account_type_id: number;
    account_usage_id?: number | null;
    parent_id?: number | null;
    code: string;
    name: string;
    description?: string;
    nature: "debito" | "credito";
    is_postable?: boolean;
    is_active?: boolean;
}

export const accountsApi = {
    list: async (params?: { search?: string; postable_only?: boolean }): Promise<ApiResponse<{ accounts: ChartAccount[] }>> => {
        const query = new URLSearchParams();
        if (params?.search) query.append("search", params.search);
        if (params?.postable_only) query.append("postable_only", "1");
        const qs = query.toString();
        return apiClient.get<{ accounts: ChartAccount[] }>(`/catalogs/accounts${qs ? `?${qs}` : ""}`);
    },
    create: async (payload: CreateAccountPayload): Promise<ApiResponse<{ account: any }>> => {
        return apiClient.post<{ account: any }>("/catalogs/accounts", payload);
    },
    update: async (id: number, payload: Partial<CreateAccountPayload>): Promise<ApiResponse<{ account: any }>> => {
        return apiClient.patch<{ account: any }>(`/catalogs/accounts/${id}`, payload);
    },
    delete: async (id: number): Promise<ApiResponse<any>> => {
        return apiClient.delete<any>(`/catalogs/accounts/${id}`);
    },
    accountTypes: async (): Promise<ApiResponse<{ account_types: any[] }>> => {
        return apiClient.get<{ account_types: any[] }>("/catalogs/account-types");
    },
    accountUsages: async (): Promise<ApiResponse<{ account_usages: any[] }>> => {
        return apiClient.get<{ account_usages: any[] }>("/catalogs/account-usages");
    },
    chooseCatalog: async (catalog: "niif" | "puc"): Promise<ApiResponse<{ accounts: number }>> => {
        return apiClient.post<{ accounts: number }>("/catalogs/accounts/choose-catalog", { catalog });
    },
    sortMode: async (): Promise<ApiResponse<{ sort_mode: "code" | "manual" }>> => {
        return apiClient.get<{ sort_mode: "code" | "manual" }>("/catalogs/accounts/sort-mode");
    },
    updateSortMode: async (mode: "code" | "manual"): Promise<ApiResponse<{ sort_mode: "code" | "manual" }>> => {
        return apiClient.post<{ sort_mode: "code" | "manual" }>("/catalogs/accounts/sort-mode", { mode });
    },
    reorder: async (orderedIds: number[]): Promise<ApiResponse<any>> => {
        return apiClient.post<any>("/catalogs/accounts/reorder", { ordered_ids: orderedIds });
    },
};

export interface JournalEntryLine {
    id?: number;
    account_id: number;
    account?: ChartAccount;
    contact_id?: number | null;
    contact?: { id: number; registration_name?: string; name?: string } | null;
    cost_center_id?: number | null;
    cost_center?: { id: number; name: string } | null;
    document_number?: string | null;
    description?: string | null;
    debit: number;
    credit: number;
}

export interface JournalEntry {
    id: number;
    prefix: string;
    number: number;
    entry_date: string;
    description: string | null;
    source_type: string | null;
    source_id: number | null;
    voucher_type: string | null;
    total_debit: number;
    total_credit: number;
    status: string;
    lines: JournalEntryLine[];
}

export interface VoucherType {
    value: string;
    label: string;
    prefix: string;
}

export interface CreateJournalEntryPayload {
    entry_date: string;
    description?: string;
    voucher_type?: string;
    lines: {
        account_id: number;
        contact_id?: number | null;
        cost_center_id?: number | null;
        document_number?: string;
        description?: string;
        debit?: number;
        credit?: number;
    }[];
}

export const journalEntriesApi = {
    list: async (params?: { page?: number; per_page?: number; date_from?: string; date_to?: string; source_type?: string; account_id?: number | string }): Promise<ApiResponse<any>> => {
        const query = new URLSearchParams();
        if (params?.page) query.append("page", String(params.page));
        if (params?.per_page) query.append("per_page", String(params.per_page));
        if (params?.date_from) query.append("date_from", params.date_from);
        if (params?.date_to) query.append("date_to", params.date_to);
        if (params?.source_type) query.append("source_type", params.source_type);
        if (params?.account_id) query.append("account_id", String(params.account_id));
        const qs = query.toString();
        return apiClient.get<any>(`/journal-entries${qs ? `?${qs}` : ""}`);
    },
    get: async (id: number): Promise<ApiResponse<{ journal_entry: JournalEntry }>> => {
        return apiClient.get<{ journal_entry: JournalEntry }>(`/journal-entries/${id}`);
    },
    create: async (payload: CreateJournalEntryPayload): Promise<ApiResponse<{ journal_entry: JournalEntry }>> => {
        return apiClient.post<{ journal_entry: JournalEntry }>("/journal-entries", payload);
    },
    voucherTypes: async (): Promise<ApiResponse<{ voucher_types: VoucherType[] }>> => {
        return apiClient.get<{ voucher_types: VoucherType[] }>("/journal-entries/voucher-types");
    },
    nextNumber: async (voucherType: string): Promise<ApiResponse<{ prefix: string; number: number }>> => {
        return apiClient.get<{ prefix: string; number: number }>(`/journal-entries/next-number?voucher_type=${voucherType}`);
    },
};
