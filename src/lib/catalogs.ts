import { apiClient } from "@/lib/api-client";

import type { ApiResponse } from "@/types/api";

export const catalogsApi = {
    /* ====================================================================== */
    /* CATEGORIES                                                             */
    /* ====================================================================== */

    getCategories: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/categories"
        );
    },

    /* ====================================================================== */
    /* WAREHOUSES                                                             */
    /* ====================================================================== */

    getWarehouses: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/warehouses"
        );
    },


    /* ====================================================================== */
    /* STANDARD CODES                                                         */
    /* ====================================================================== */

    searchStandardCodes: async (search: string, perPage: number = 20): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            `/catalogs/standard-codes?search=${encodeURIComponent(search)}&per_page=${perPage}`
        );
    },

    /* ====================================================================== */
    /* TAX RATES                                                              */
    /* ====================================================================== */

    getTaxRates: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/tax-rates"
        );
    },

    createTaxRate: async (
        payload: unknown
    ): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>(
            "/catalogs/tax-rates",
            payload
        );
    },

    /* ====================================================================== */
    /* TAXES                                                                  */
    /* ====================================================================== */

    getTaxes: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/taxes"
        );
    },

    /* ====================================================================== */
    /* UNIT MEASURES                                                          */
    /* ====================================================================== */

    getUnitMeasures: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/unit-measures?per_page=10000"
        );
    },

    searchUnitMeasures: async (search: string, perPage: number = 20): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            `/catalogs/unit-measures?search=${encodeURIComponent(search)}&per_page=${perPage}`
        );
    },

    /* ====================================================================== */
    /* ATTRIBUTES                                                             */
    /* ====================================================================== */

    getAttributes: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/attributes"
        );
    },

    /* ====================================================================== */
    /* CUSTOM FIELD TYPES                                                     */
    /* ====================================================================== */

    getTypeCustomFields: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-custom-fields"
        );
    },

    /* ====================================================================== */
    /* CUSTOM FIELDS                                                          */
    /* ====================================================================== */

    getCustomFields: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/custom-fields"
        );
    },

    /* ====================================================================== */
    /* PRICE LISTS                                                            */
    /* ====================================================================== */

    getPriceLists: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/price-lists"
        );
    },

    getTypePriceLists: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-price-lists"
        );
    },

    /* ====================================================================== */
    /* ACCOUNTING                                                             */
    /* ====================================================================== */

    getSalesAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/sales-accounts"
        );
    },

    getInventoryAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/inventory-accounts"
        );
    },

    getCostAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/cost-accounts"
        );
    },

    /* ====================================================================== */
    /* PAYMENT METHODS & FORMS                                                */
    /* ====================================================================== */

    getPaymentForms: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/payment-forms"
        );
    },

    getPaymentMethods: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/payment-methods"
        );
    }
};