import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import type { Quote, QuoteDetailResponse, QuoteFindAllSuccess, QuoteFindAllApiData } from "@/types/quote";
import type { ApiResponse } from "@/types/api";

export class QuotesService {
    /**
     * GET /quotations
     */
    static async list(params?: Record<string, any>): Promise<ApiResponse<QuoteFindAllSuccess>> {
        const response = await apiClient.get<QuoteFindAllApiData>(
            "/quotations" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );

        return {
            ...response,
            data: {
                quotes: response.data?.quotations ?? [],
                pagination: response.data?.pagination ?? {
                    current_page: 1,
                    per_page: 10,
                    total: 0,
                    last_page: 1,
                    from: 0,
                    to: 0,
                },
                meta: response.data?.meta,
            },
        };
    }

    /**
     * GET /quotations/{quotationId}
     */
    static async getById(id: number | string) {
        return apiClient.get<QuoteDetailResponse>(`/quotations/${id}`);
    }

    /**
     * POST /quotations
     */
    static async create(data: Partial<Quote>) {
        return apiClient.post<Quote>("/quotations", data);
    }

    /**
     * PATCH /quotations/{quotationId}
     */
    static async update(id: number | string, data: Partial<Quote>) {
        return apiClient.patch<Quote>(`/quotations/${id}`, data);
    }

    /**
     * DELETE /quotations/{quotationId}
     */
    static async delete(id: number | string) {
        return apiClient.delete(`/quotations/${id}`);
    }

    /**
     * GET /quotations/{quotationId}/pdf/preview
     */
    static getPrintUrl(id: number | string, template?: number) {
        return `${envs.apiUrl}/quotations/${id}/pdf/preview${template ? `?template=${template}` : ""}`;
    }

    /**
     * GET /quotations/{quotationId}/pdf/preview
     */
    static async printPdfBlob(id: number | string, template?: number) {
        return apiClient.getBlob(`/quotations/${id}/pdf/preview${template ? `?template=${template}` : ""}`);
    }

    /**
     * GET /quotations/{quotationId}/downloads/pdf
     */
    static async downloadPdfBlob(id: number | string, template?: number) {
        return apiClient.getBlob(`/quotations/${id}/downloads/pdf${template ? `?template=${template}` : ""}`);
    }

    /**
     * Preflight / Vista previa borrador
     */
    static async preflight(data: Partial<Quote>) {
        return apiClient.postBlob("/quotations/preflight", data);
    }
}

