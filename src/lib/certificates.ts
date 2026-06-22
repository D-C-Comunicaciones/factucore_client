import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export const certificatesApi = {
    getCertificate: async (): Promise<ApiResponse<any>> => {
        return await apiClient.get<any>("/certificate");
    },

    createCertificate: async (payload: FormData | any): Promise<ApiResponse<any>> => {
        // If it's FormData, it handles the file upload. 
        // If it's a regular object, it handles the base64 submission.
        const config = payload instanceof FormData ? {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        } : undefined;
        return await apiClient.post<any>("/certificate", payload, config);
    }
};
