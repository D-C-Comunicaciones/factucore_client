import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export type BankAccountType = "banco" | "efectivo" | "tarjeta";

export interface BankAccountTypeOption {
    id: number;
    code: BankAccountType;
    name: string;
    description: string | null;
}

export interface BankAccount {
    id: number;
    account_id: number;
    type: BankAccountType;
    account_number: string | null;
    initial_balance: string | number;
    initial_balance_date: string;
    description: string | null;
    is_active: boolean;
    balance: number;
    name: string;
    account?: { id: number; code: string; name: string; nature: string };
}

export interface BankSummary {
    cash_balance: number;
    credit_card_debt: number;
    total_balance: number;
}

export interface CashFlowPoint {
    month: string;
    income: number;
    expense: number;
}

export interface JournalEntryLineRow {
    id: number;
    journal_entry_id: number;
    account_id: number;
    debit: string | number;
    credit: string | number;
    description: string | null;
    journal_entry?: {
        id: number;
        prefix: string;
        number: number;
        entry_date: string;
        description: string | null;
        source_type: string;
        source_id: number | null;
    };
    is_reconciled: boolean;
    reconciled_at: string | null;
    reconciled_by_user_id: number | null;
    bank_reconciliation_id: number | null;
    reconciled_by?: { id: number; name: string } | null;
}

export interface BankTransfer {
    id: number;
    from_bank_account_id: number;
    to_bank_account_id: number;
    amount: string | number;
    transfer_date: string;
    description: string | null;
    from_bank_account?: BankAccount;
    to_bank_account?: BankAccount;
}

export interface BankReconciliation {
    id: number;
    bank_account_id: number;
    period_start: string;
    period_end: string;
    previous_balance: string | number;
    total_in: string | number;
    total_out: string | number;
    bank_balance: string | number | null;
    bank_charges: string | number;
    bank_taxes: string | number;
    bank_other_entries: string | number;
    status: "in_progress" | "completed";
    total_balance: number;
    difference: number | null;
    completed_by_user_id: number | null;
    completed_by?: { id: number; name: string } | null;
    started_by?: { id: number; name: string } | null;
    user_id: number | null;
    bank_account?: BankAccount;
}

export const bankAccountTypesApi = {
    list: (): Promise<ApiResponse<any>> => apiClient.get("/bank-account-types"),
};

export const bankAccountsApi = {
    list: (params?: { search?: string; range?: string; type?: string }): Promise<ApiResponse<any>> =>
        apiClient.get("/bank-accounts", { params }),
    create: (payload: Partial<BankAccount>): Promise<ApiResponse<any>> =>
        apiClient.post("/bank-accounts", payload),
    show: (id: number, params?: { from?: string; to?: string; only_unreconciled?: boolean }): Promise<ApiResponse<any>> =>
        apiClient.get(`/bank-accounts/${id}`, { params }),
    update: (id: number, payload: Partial<BankAccount>): Promise<ApiResponse<any>> =>
        apiClient.patch(`/bank-accounts/${id}`, payload),
    remove: (id: number): Promise<ApiResponse<any>> => apiClient.delete(`/bank-accounts/${id}`),
    toggleStatus: (id: number, isActive: boolean): Promise<ApiResponse<any>> =>
        apiClient.post(`/bank-accounts/${id}/toggle-status`, { is_active: isActive }),
};

export const bankTransfersApi = {
    list: (bankAccountId?: number): Promise<ApiResponse<any>> =>
        apiClient.get("/bank-transfers", { params: bankAccountId ? { bank_account_id: bankAccountId } : undefined }),
    create: (payload: any): Promise<ApiResponse<any>> => apiClient.post("/bank-transfers", payload),
    remove: (id: number): Promise<ApiResponse<any>> => apiClient.delete(`/bank-transfers/${id}`),
};

export const bankReconciliationsApi = {
    list: (params?: { bank_account_id?: number; status?: string; from?: string; to?: string }): Promise<ApiResponse<any>> =>
        apiClient.get("/bank-reconciliations", { params }),
    create: (payload: { bank_account_id: number; period_start?: string; period_end?: string }): Promise<ApiResponse<any>> =>
        apiClient.post("/bank-reconciliations", payload),
    show: (id: number, params?: { include_reconciled?: boolean }): Promise<ApiResponse<any>> =>
        apiClient.get(`/bank-reconciliations/${id}`, { params }),
    update: (
        id: number,
        payload: {
            bank_account_id?: number;
            period_start?: string;
            period_end?: string;
            bank_balance?: number | null;
            bank_charges?: number;
            bank_taxes?: number;
            bank_other_entries?: number;
            reconciled_line_ids?: number[];
        }
    ): Promise<ApiResponse<any>> => apiClient.patch(`/bank-reconciliations/${id}`, payload),
    complete: (id: number): Promise<ApiResponse<any>> => apiClient.post(`/bank-reconciliations/${id}/complete`, {}),
    reopen: (id: number): Promise<ApiResponse<any>> => apiClient.post(`/bank-reconciliations/${id}/reopen`, {}),
    remove: (id: number): Promise<ApiResponse<any>> => apiClient.delete(`/bank-reconciliations/${id}`),
};
