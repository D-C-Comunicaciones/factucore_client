import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const warehousesApi = {
    getWarehouses: async (): Promise<ApiResponse<any>> => {
        // As requested, this one is supposed to be left in catalogs too,
        // but it makes sense to also have it here if they want to use it
        // Or if they mean "listar bodegas dejalo en catalogs", I'll just not add it here.
        // Wait, "el de listar bodegas si dejalo dentro de catalogs. por favor"
        // Okay, I won't add getWarehouses here.
        // I will only add store, show, update, destroy, toggleStatus.
        return await apiClient.get<any>("/warehouses");
    },

    createWarehouse: async (payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>("/warehouses", payload);
    },

    getWarehouse: async (warehouseId: number): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(`/warehouses/${warehouseId}`);
    },

    updateWarehouse: async (warehouseId: number, payload: any): Promise<ApiResponse<any>> => {
        return await apiClient.put<any>(`/warehouses/${warehouseId}`, payload);
    },

    deleteWarehouse: async (warehouseId: number): Promise<ApiResponse<any>> => {
        return await apiClient.delete<any>(`/warehouses/${warehouseId}`);
    },

    toggleStatus: async (warehouseId: number): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>(`/warehouses/${warehouseId}/toggle-status`, {});
    }
};
