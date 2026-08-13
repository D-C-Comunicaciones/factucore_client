import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const costCentersApi = {
    // GET /cost-centers (index - listado con paginación)
    getCostCenters: async (params?: { page?: number; per_page?: number; search?: string; code?: string; is_active?: boolean }): Promise<ApiResponse<any>> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.per_page) queryParams.append("per_page", String(params.per_page));
        if (params?.search) queryParams.append("search", params.search);
        if (params?.code) queryParams.append("code", params.code);
        if (params?.is_active !== undefined) queryParams.append("is_active", String(params.is_active));
        const qs = queryParams.toString();
        return await apiClient.get<any>(`/cost-centers${qs ? `?${qs}` : ""}`);
    },

    // GET /cost-centers/{costCenterId} (show)
    getCostCenter: async (costCenterId: number): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(`/cost-centers/${costCenterId}`);
    },

    // POST /cost-centers (store)
    createCostCenter: async (payload: { name: string; code: string; description?: string }): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>("/cost-centers", payload);
    },

    // PUT /cost-centers/{costCenterId} (update)
    updateCostCenter: async (costCenterId: number, payload: { name: string; code: string; description?: string }): Promise<ApiResponse<any>> => {
        return await apiClient.put<any>(`/cost-centers/${costCenterId}`, payload);
    },

    // DELETE /cost-centers/{costCenterId} (destroy)
    deleteCostCenter: async (costCenterId: number): Promise<ApiResponse<any>> => {
        return await apiClient.delete<any>(`/cost-centers/${costCenterId}`);
    },

    // POST /cost-centers/{costCenterId}/toggle-status
    toggleStatus: async (costCenterId: number): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>(`/cost-centers/${costCenterId}/toggle-status`, {});
    },

    // GET /cost-center-settings
    getSettings: async (params?: { type_document?: string }): Promise<ApiResponse<any>> => {
        const queryParams = new URLSearchParams();
        if (params?.type_document) queryParams.append("type_document", params.type_document);
        const qs = queryParams.toString();
        return await apiClient.get<any>(`/cost-center-settings${qs ? `?${qs}` : ""}`);
    },

    // PUT /cost-center-settings
    updateSettings: async (payload: { settings: any[] }): Promise<ApiResponse<any>> => {
        return await apiClient.put<any>("/cost-center-settings", payload);
    },
};
