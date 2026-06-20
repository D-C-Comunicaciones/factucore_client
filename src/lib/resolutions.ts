import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";

export interface Resolution {
  id: number;
  type_resolution_id: number;
  type_resolution?: any;
  name: string;
  is_automatic_numbering?: boolean;
  resolution_number: string;
  resolution_date?: string;
  prefix: string;
  from_number: number;
  to_number: number;
  current_number: number;
  valid_from: string;
  valid_to: string;
  technical_key: string;
  is_active: boolean;
  is_main: boolean;
  resolution_text?: string | null;
  available_count?: number;
  is_currently_valid?: boolean;
  days_until_expiry?: number | null;
  is_electronic?: boolean;
  created_at?: string;
  updated_at?: string;
  description?: string; // fallback if needed
  footer_text?: string; // fallback if needed
}

export interface ResolutionsParams {
  page?: number;
  per_page?: number;
  type_resolution?: number | string;
  is_main?: boolean | string;
  is_electronic?: boolean | string;
  is_active?: boolean | string;
  search?: string;
}

export const ResolutionsService = {
  getResolutions: async (params?: ResolutionsParams): Promise<ApiResponse<any>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page !== undefined) queryParams.append("page", String(params.page));
      if (params.per_page !== undefined) queryParams.append("per_page", String(params.per_page));
      if (params.type_resolution !== undefined && params.type_resolution !== "all") queryParams.append("type_resolution", String(params.type_resolution));
      if (params.is_main !== undefined && params.is_main !== "all") queryParams.append("is_main", String(params.is_main));
      if (params.is_electronic !== undefined && params.is_electronic !== "all") queryParams.append("is_electronic", String(params.is_electronic));
      if (params.is_active !== undefined && params.is_active !== "all") queryParams.append("is_active", String(params.is_active));
      if (params.search) queryParams.append("search", params.search);
    }
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
    return await apiClient.get<any>(`/resolutions${queryString}`);
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

  toggleResolutionStatus: async (id: number): Promise<ApiResponse<any>> => {
    return await apiClient.post<any>(`/resolutions/${id}/toggle-status`, {});
  },

  deleteResolution: async (id: number): Promise<ApiResponse<any>> => {
    return await apiClient.delete<any>(`/resolutions/${id}`);
  },
};
