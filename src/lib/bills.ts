import { apiClient } from "@/lib/api-client";
import type {
    Bill,
    BillDetailResponse,
    BillFindAllSuccess
} from "@/types/bill";

export class BillsService {
    static async list(params?: Record<string, any>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient.get<BillFindAllSuccess>(`/bills${query}`);
    }

    static async getById(id: number | string) {
        return apiClient.get<BillDetailResponse>(`/bills/${id}`);
    }

    static async store(data: Partial<Bill>) {
        return apiClient.post<any>("/bills", data);
    }

    static async update(id: number | string, data: Partial<Bill>) {
        return apiClient.patch<any>(`/bills/${id}`, data);
    }

    static async delete(id: number | string) {
        return apiClient.delete<any>(`/bills/${id}`);
    }

    static async printPdfBlob(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/bills/${id}/pdf`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    static async exportExcel(params?: Record<string, any>): Promise<Blob> {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        const res = await apiClient.get<Blob>(`/bills/export${query}`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    static async importFromExcel(formData: FormData) {
        return apiClient.post<any>("/bills/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }

    static async uploadBillFile(formData: FormData) {
        return apiClient.post<any>("/bills/upload-file", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
}
