import { apiClient } from "@/lib/api-client";

export interface ExpensePaymentRow {
    id: number;
    document_type: "support_document" | "bill";
    document_id: number | null;
    document_number: string | null;
    prefix?: string;
    number: number;
    amount: number | string;
    payment_date: string;
    notes?: string | null;
    contact?: { id: number; registration_name?: string; name?: string } | null;
}

export class ExpensePaymentsService {
    static async list(params?: Record<string, any>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient.get<{ payments: ExpensePaymentRow[] }>(`/expense-payments${query}`);
    }
}
