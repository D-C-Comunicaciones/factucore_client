import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface Resolution {
  id: number;
  resolution_number: string;
  resolution_date: string;
  prefix: string;
  from_number: number;
  to_number: number;
  valid_from: string;
  valid_to: string;
  technical_key: string;
  document_types: string[];
  is_active: boolean;
  description: string;
  footer_text?: string;
  current_number?: number; // Depending on how the API returns it
  is_valid?: boolean;
}

export const ResolutionsService = {
  getResolutions: async (): Promise<ApiResponse<Resolution[]>> => {
    return await apiClient.get<Resolution[]>("/resolutions");
  },

  getResolution: async (id: number): Promise<ApiResponse<Resolution>> => {
    return await apiClient.get<Resolution>(`/resolutions/${id}`);
  },

  createResolution: async (data: Partial<Resolution>): Promise<ApiResponse<Resolution>> => {
    return await apiClient.post<Resolution>("/resolutions", data);
  },

  updateResolution: async (id: number, data: Partial<Resolution>): Promise<ApiResponse<Resolution>> => {
    return await apiClient.patch<Resolution>(`/resolutions/${id}`, data);
  },
};
