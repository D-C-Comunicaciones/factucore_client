import { apiClient } from "@/lib/api-client";
import type {
    SupportDocument,
    SupportDocumentDetailResponse,
    SupportDocumentFindAllSuccess
} from "@/types/supportDocument";

export class SupportDocumentsService {
    static async list(params?: Record<string, any>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient.get<SupportDocumentFindAllSuccess>(`/support-documents${query}`);
    }

    static async getById(id: number | string) {
        return apiClient.get<SupportDocumentDetailResponse>(`/support-documents/${id}`);
    }

    static async saveDraft(data: Partial<SupportDocument>) {
        return apiClient.post<any>("/support-documents", {
            ...data,
            save_action: "DRAFT"
        });
    }

    static async store(data: Partial<SupportDocument>) {
        return apiClient.post<any>("/support-documents", data);
    }

    static async sendDirect(data: Partial<SupportDocument>) {
        return apiClient.post<any>("/support-documents/send", data);
    }

    static async update(id: number | string, data: Partial<SupportDocument>) {
        return apiClient.patch<any>(`/support-documents/${id}`, data);
    }

    static async delete(id: number | string) {
        return apiClient.delete<any>(`/support-documents/${id}`);
    }

    static async printPdfBlob(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/support-documents/${id}/pdf`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    static async downloadXml(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/support-documents/${id}/xml`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }
}
