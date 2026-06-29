import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export interface AttributePayload {
  name: string;
  values: { value: string }[];
}

export const attributesApi = {
  createAttribute: async (data: AttributePayload): Promise<ApiResponse<any>> => {
    return await apiClient.post<any>("/attributes", data);
  },

  getAttribute: async (attributeId: string | number): Promise<ApiResponse<any>> => {
    return await apiClient.get<any>(`/attributes/${attributeId}`);
  },

  updateAttribute: async (attributeId: string | number, data: AttributePayload): Promise<ApiResponse<any>> => {
    return await apiClient.patch<any>(`/attributes/${attributeId}`, data);
  },

  deleteAttribute: async (attributeId: string | number): Promise<ApiResponse<any>> => {
    return await apiClient.delete<any>(`/attributes/${attributeId}`);
  },
};
