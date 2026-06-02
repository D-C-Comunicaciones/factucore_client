import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

/**
 * Custom Fields service API wrapper.
 * Provides full CRUD access to custom field definitions and types.
 */
export const customFieldsApi = {

    /** Create a new custom field */
    createCustomField: async (data: any): Promise<ApiResponse<any>> => {
        return apiClient.post<any>("/custom-fields", data);
    },

    /** Update an existing custom field */
    updateCustomField: async (id: string, data: any): Promise<ApiResponse<any>> => {
        return apiClient.patch<any>(`/custom-fields/${id}`, data);
    },

    /** Delete a custom field */
    deleteCustomField: async (id: string): Promise<ApiResponse<void>> => {
        return apiClient.delete<void>(`/custom-fields/${id}`);
    },
};
