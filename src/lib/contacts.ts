import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";

export class ContactsService {
    static async list(params?: Record<string, any>): Promise<ApiResponse<any>> {
        return await apiClient.get<any>("/contacts", { params });
    }

    static async getById(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.get<any>(`/contacts/${id}`);
    }

    static async create(data: any): Promise<ApiResponse<any>> {
        return await apiClient.post<any>("/contacts", data);
    }

    static async update(id: number | string, data: any): Promise<ApiResponse<any>> {
        return await apiClient.patch<any>(`/contacts/${id}`, data);
    }

    static async delete(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.delete<any>(`/contacts/${id}`);
    }
}
