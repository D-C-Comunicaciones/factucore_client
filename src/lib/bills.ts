import { apiClient } from "@/lib/api-client";
import type {
    BillPayload,
    BillDetailData,
    BillFindAllSuccess,
    StoreBillPaymentPayload,
    StoreBillDebitNotePayload,
    BillPayment,
    BillDebitNote,
} from "@/types/bill";

function buildQueryString(params?: Record<string, any>): string {
    if (!params) return "";
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === "") continue;
        if (Array.isArray(value)) {
            value.forEach((v) => search.append(`${key}[]`, String(v)));
        } else {
            search.append(key, String(value));
        }
    }
    const qs = search.toString();
    return qs ? `?${qs}` : "";
}

export class BillsService {
    static async list(params?: Record<string, any>) {
        return apiClient.get<BillFindAllSuccess>(`/bills${buildQueryString(params)}`);
    }

    static async getById(id: number | string) {
        return apiClient.get<BillDetailData>(`/bills/${id}`);
    }

    static async store(data: BillPayload) {
        return apiClient.post<BillDetailData>("/bills", data);
    }

    static async saveDraft(data: BillPayload) {
        return apiClient.post<BillDetailData>("/bills", { ...data, save_action: "DRAFT" });
    }

    static async update(id: number | string, data: BillPayload) {
        return apiClient.patch<BillDetailData>(`/bills/${id}`, data);
    }

    static async cancel(id: number | string) {
        return apiClient.post<BillDetailData>(`/bills/${id}/cancel`);
    }

    static async listPayments(id: number | string) {
        return apiClient.get<{ payments: BillPayment[] }>(`/bills/${id}/payments`);
    }

    static async storePayment(id: number | string, data: StoreBillPaymentPayload) {
        return apiClient.post<BillDetailData & { payment: BillPayment }>(`/bills/${id}/payments`, data);
    }

    static async deletePayment(id: number | string, paymentId: number | string) {
        return apiClient.delete(`/bills/${id}/payments/${paymentId}`);
    }

    static async listDebitNotes(id: number | string) {
        return apiClient.get<{ debit_notes: BillDebitNote[] }>(`/bills/${id}/debit-notes`);
    }

    static async storeDebitNote(id: number | string, data: StoreBillDebitNotePayload) {
        return apiClient.post<BillDetailData & { debit_note: BillDebitNote }>(`/bills/${id}/debit-notes`, data);
    }

    static async deleteDebitNote(id: number | string, debitNoteId: number | string) {
        return apiClient.delete(`/bills/${id}/debit-notes/${debitNoteId}`);
    }
}
