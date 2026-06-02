import { ApiResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * API wrapper for Category endpoints.
 * Includes GET for catalog list and full CRUD (except create) as defined in routes.
 */
export const categoriesApi = {

    /** Show a single category */
    getCategory: async (categoryId: number | string): Promise<ApiResponse<any>> => {
        return apiClient.get<any>(`/categories/${categoryId}`);
    },

    /** Create a new category */
    createCategory: async (payload: { name: string; description?: string }): Promise<ApiResponse<any>> => {
        return apiClient.post<any>("/categories", payload);
    },

    /** Update an existing category */
    updateCategory: async (
        categoryId: number | string,
        payload: { name?: string; description?: string }
    ): Promise<ApiResponse<any>> => {
        return apiClient.patch<any>(`/categories/${categoryId}`, payload);
    },

    /** Toggle active status */
    toggleStatus: async (categoryId: number | string): Promise<ApiResponse<any>> => {
        return apiClient.post<any>(`/categories/${categoryId}/toggle-status`);
    },

    /** Delete a category */
    deleteCategory: async (categoryId: number | string): Promise<ApiResponse<any>> => {
        return apiClient.delete<any>(`/categories/${categoryId}`);
    },
};
