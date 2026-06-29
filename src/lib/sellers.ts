import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";

export class SellersService {
    static async list(params?: Record<string, any>): Promise<ApiResponse<any>> {
        return await apiClient.get<any>("/sellers", { params });
    }

    static async getById(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.get<any>(`/sellers/${id}`);
    }

    static async create(data: any): Promise<ApiResponse<any>> {
        return await apiClient.post<any>("/sellers", data);
    }

    static async update(id: number | string, data: any): Promise<ApiResponse<any>> {
        return await apiClient.patch<any>(`/sellers/${id}`, data);
    }

    static async delete(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.delete<any>(`/sellers/${id}`);
    }
}
