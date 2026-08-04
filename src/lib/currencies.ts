import type { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const currenciesApi = {
    createCurrency: async (payload: { name: string; code: string; exchange_rate?: string }): Promise<ApiResponse<any>> => {
        return await apiClient.post<any>("/currencies", payload);
    },
};
