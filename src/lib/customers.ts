import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const customersApi = {
    getCustomers: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/customers", { params });
    },

    createCustomer: async (payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>("/customers", payload);
    },

    getCustomer: async (customerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(`/customers/${customerId}`);
    },

    updateCustomer: async (customerId: number, payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.put<any>(`/customers/${customerId}`, payload);
    },

    deleteCustomer: async (customerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.delete<any>(`/customers/${customerId}`);
    },

    toggleStatus: async (customerId: number): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>(`/customers/${customerId}/toggle-status`, {});
    }
};
