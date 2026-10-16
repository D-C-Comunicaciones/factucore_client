import { apiClient } from "@/lib/api-client";

import type { ApiResponse } from "@/types/api";
import type { Tax, Withholding, UpdateTaxAccountsPayload, UpdateWithholdingAccountsPayload } from "@/types/catalogs";

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
    /* DOCUMENT TYPES                                                         */
    /* ====================================================================== */

    getTypeDocumentIdentifications: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-document-identifications"
        );
    },

    getTypeOrganizations: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-organizations"
        );
    },

    getTypeLiabilities: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-liabilities"
        );
    },

    getTypeRegimes: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-regimes"
        );
    },

    getTypeResolutions: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/type-resolutions"
        );
    },

    /* ====================================================================== */
    /* COUNTRIES                                                              */
    /* ====================================================================== */

    getCountries: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/countries"
        );
    },

    /* ====================================================================== */
    /* CURRENCIES                                                             */
    /* ====================================================================== */

    getCurrencies: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/currencies"
        );
    },

    // type_currencies — el catálogo que realmente referencian bills.currency_id /
    // support_documents.currency_id / invoices.type_currency_id (distinto de /catalogs/currencies).
    getTypeCurrencies: async (params?: { query?: string }): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/catalogs/type-currencies", { params });
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

    getTaxes: async (): Promise<ApiResponse<{ taxes: Tax[] }>> => {
        return await apiClient.get<{ taxes: Tax[] }>(
            "/catalogs/taxes"
        );
    },

    updateTax: async (id: number, payload: UpdateTaxAccountsPayload): Promise<ApiResponse<{ tax: Tax }>> => {
        return await apiClient.patch<{ tax: Tax }>(`/catalogs/taxes/${id}`, payload);
    },

    /* ====================================================================== */
    /* WITHHOLDINGS                                                           */
    /* ====================================================================== */

    getWithholdings: async (): Promise<ApiResponse<{ withholdings: Withholding[] }>> => {
        return await apiClient.get<{ withholdings: Withholding[] }>(
            "/catalogs/withholdings"
        );
    },

    updateWithholding: async (id: number, payload: UpdateWithholdingAccountsPayload): Promise<ApiResponse<{ withholding: Withholding }>> => {
        return await apiClient.patch<{ withholding: Withholding }>(`/catalogs/withholdings/${id}`, payload);
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

    getBankAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/bank-accounts"
        );
    },

    getPaymentMethods: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/payment-methods"
        );
    },

    getPaymentTerms: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/payment-terms"
        );
    },

    /* ====================================================================== */
    /* MUNICIPALITIES                                                         */
    /* ====================================================================== */

    getMunicipalities: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>(
            "/catalogs/municipalities?per_page=10000"
        );
    },
    /* ====================================================================== */
    /* ACCOUNTS                                                               */
    /* ====================================================================== */

    getReceivableAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/catalogs/receivable-accounts");
    },

    getPayableAccounts: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/catalogs/payable-accounts");
    },

    getWithholdingRates: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/catalogs/withholding-rates");
    },
};