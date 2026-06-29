import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export interface Software {
  id: number;
  name: string;
  software_identifier: string;
  software_pin: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SoftwareResponse {
  software: Software | null;
}

export interface CreateSoftwarePayload {
  software_identifier: string;
  software_pin: string;
}

export const softwaresApi = {
  getSoftware: async (): Promise<ApiResponse<SoftwareResponse>> => {
    return await apiClient.get<SoftwareResponse>("/software");
  },

  createSoftware: async (payload: CreateSoftwarePayload): Promise<ApiResponse<SoftwareResponse>> => {
    return await apiClient.put<SoftwareResponse>("/software", payload);
  }
};
