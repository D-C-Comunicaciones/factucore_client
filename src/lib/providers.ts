import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const providersApi = {
    getProviders: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/providers", { params });
    },

    createProvider: async (payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>("/providers", payload);
    },

    getProvider: async (providerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(`/providers/${providerId}`);
    },

    updateProvider: async (providerId: number, payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.put<any>(`/providers/${providerId}`, payload);
    },

    deleteProvider: async (providerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.delete<any>(`/providers/${providerId}`);
    },

    toggleStatus: async (providerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>(`/providers/${providerId}/toggle-status`, {});
    }
};
