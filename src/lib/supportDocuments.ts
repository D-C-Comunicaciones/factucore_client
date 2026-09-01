import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import type {
    SupportDocumentPayload,
    SupportDocumentDetailData,
    SupportDocumentFindAllSuccess,
    SupportDocumentSendTestResult,
    StoreSupportDocumentPaymentPayload,
    SupportDocumentPayment,
} from "@/types/supportDocument";

// DIAN issued this TestSetId for this tenant's Documento Soporte habilitación (certification)
// process — it is fixed per company/document-type, not something an end user picks per
// document, so it's baked in here rather than asked for on every send. Once DIAN certifies
// production for this document type, this constant (and SupportDocumentsService.sendTest's
// call site) is what moves to a real, non-test send endpoint.
export const SUPPORT_DOCUMENT_TEST_SET_ID = "0b96ead9-eb82-48f1-a25d-83d0d3ec3755";

/**
 * Builds a query string honoring Laravel's array-param convention (`key[]=a&key[]=b`) — plain
 * `new URLSearchParams(obj)` stringifies an array value as one comma-joined string instead,
 * which `(array) $request->input(...)` on the backend would treat as a single bogus ID.
 */
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

export class SupportDocumentsService {
    static async list(params?: Record<string, any>) {
        return apiClient.get<SupportDocumentFindAllSuccess>(`/support-documents${buildQueryString(params)}`);
    }

    static async getById(id: number | string) {
        return apiClient.get<SupportDocumentDetailData>(`/support-documents/${id}`);
    }

    static async store(data: SupportDocumentPayload) {
        return apiClient.post<SupportDocumentDetailData>("/support-documents", data);
    }

    static async saveDraft(data: SupportDocumentPayload) {
        return apiClient.post<SupportDocumentDetailData>("/support-documents", {
            ...data,
            save_action: "DRAFT",
        });
    }

    static async update(id: number | string, data: SupportDocumentPayload) {
        return apiClient.patch<SupportDocumentDetailData>(`/support-documents/${id}`, data);
    }

    static async cancel(id: number | string) {
        return apiClient.post<SupportDocumentDetailData>(`/support-documents/${id}/cancel`);
    }

    /** Creates the Support Document AND sends it to DIAN's habilitación environment in one call. */
    static async sendTest(data: SupportDocumentPayload, testSetId: string = SUPPORT_DOCUMENT_TEST_SET_ID) {
        return apiClient.post<SupportDocumentSendTestResult>(`/support-documents/sendTest/${testSetId}`, data);
    }

    /** Sends an already-saved (BORRADOR/GUARDADO) Support Document without creating a new one. */
    static async sendExistingTest(id: number | string, testSetId: string = SUPPORT_DOCUMENT_TEST_SET_ID) {
        return apiClient.post<SupportDocumentSendTestResult>(`/support-documents/${id}/sendTest/${testSetId}`);
    }

    static async checkTestStatus(trackId: string) {
        return apiClient.get<Record<string, any>>(`/support-documents/sendTest/status/${trackId}`);
    }

    static async listPayments(id: number | string) {
        return apiClient.get<{ payments: SupportDocumentPayment[] }>(`/support-documents/${id}/payments`);
    }

    static async storePayment(id: number | string, data: StoreSupportDocumentPaymentPayload) {
        return apiClient.post<SupportDocumentDetailData & { payment: SupportDocumentPayment }>(
            `/support-documents/${id}/payments`,
            data
        );
    }

    static async deletePayment(id: number | string, paymentId: number | string) {
        return apiClient.delete(`/support-documents/${id}/payments/${paymentId}`);
    }

    static getPrintUrl(id: number | string) {
        return `${envs.apiUrl}/support-documents/${id}/pdf/preview`;
    }

    static getPdfUrl(id: number | string) {
        return `${envs.apiUrl}/support-documents/${id}/downloads/pdf`;
    }

    static getZipUrl(id: number | string) {
        return `${envs.apiUrl}/support-documents/${id}/downloads/zip`;
    }

    static async printPdfBlob(id: number | string) {
        return apiClient.getBlob(`/support-documents/${id}/pdf/preview`);
    }

    static async downloadPdfBlob(id: number | string) {
        return apiClient.getBlob(`/support-documents/${id}/downloads/pdf`);
    }

    static async downloadXmlBlob(id: number | string) {
        return apiClient.getBlob(`/support-documents/${id}/downloads/xml`);
    }

    static async downloadZipBlob(id: number | string) {
        return apiClient.getBlob(`/support-documents/${id}/downloads/zip`);
    }
}
