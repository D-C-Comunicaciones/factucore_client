import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const adquirerApi = {
    getAcquirer: async (params?: Record<string, any>): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/acquirer", { params });
    },
};
