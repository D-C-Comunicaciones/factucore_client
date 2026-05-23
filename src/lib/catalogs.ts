import { apiClient } from "./api-client";

export const catalogsApi = {
    getCategories: async (search: string = "") => {
        return apiClient.get("/catalogs/categories", { params: { search } });
    },
    getWarehouses: async (search: string = "") => {
        return apiClient.get("/catalogs/warehouses", { params: { search } });
    },
    getStandardCodes: async (search: string = "") => {
        return apiClient.get("/catalogs/standard-codes", { params: { search } });
    },
    getTaxRates: async (search: string = "") => {
        return apiClient.get("/catalogs/tax-rates", { params: { search } });
    },
    getUnitMeasures: async (search: string = "") => {
        return apiClient.get("/catalogs/unit-measures", { params: { search } });
    },
    getAttributes: async () => {
        return apiClient.get<any[]>("/attributes");
    },
    getCustomFields: async (module: string = "items") => {
        return apiClient.get<any[]>(`/custom-fields`, { params: { module } });
    },
    getPriceLists: async () => {
        return apiClient.get<any[]>("/price-lists");
    }
};
