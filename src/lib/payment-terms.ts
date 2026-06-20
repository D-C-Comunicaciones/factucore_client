import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";

export class PaymentTermsService {
    static async list(params?: Record<string, any>): Promise<ApiResponse<any>> {
        return await apiClient.get<any>("/payment-terms", { params });
    }

    static async getById(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.get<any>(`/payment-terms/${id}`);
    }

    static async create(data: any): Promise<ApiResponse<any>> {
        return await apiClient.post<any>("/payment-terms", data);
    }

    static async update(id: number | string, data: any): Promise<ApiResponse<any>> {
        return await apiClient.patch<any>(`/payment-terms/${id}`, data);
    }

    static async delete(id: number | string): Promise<ApiResponse<any>> {
        return await apiClient.delete<any>(`/payment-terms/${id}`);
    }
}
