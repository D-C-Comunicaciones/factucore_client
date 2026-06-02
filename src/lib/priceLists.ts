import { ApiResponse } from "@/types/api";
import { apiClient } from "@/lib/api-client";

/**
 * API wrapper for Price List endpoints.
 */
export const priceListsApi = {

    /** Get all price lists for catalogs */
    getPriceLists: async (): Promise<ApiResponse<any>> => {
        return apiClient.get<any>("/catalogs/price-lists");
    },

    /** Show a single price list */
    getPriceList: async (priceListId: number | string): Promise<ApiResponse<any>> => {
        return apiClient.get<any>(`/price-lists/${priceListId}`);
    },

    /** Create a new price list */
    createPriceList: async (payload: { name: string; description?: string; type_price_list_id: number | string; percentage?: number }): Promise<ApiResponse<any>> => {
        return apiClient.post<any>("/price-lists", payload);
    },

    /** Delete a price list */
    deletePriceList: async (priceListId: number | string): Promise<ApiResponse<any>> => {
        return apiClient.delete<any>(`/price-lists/${priceListId}`);
    },
};
