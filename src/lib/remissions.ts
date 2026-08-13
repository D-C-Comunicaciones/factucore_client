import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import { exportByDateRange } from "@/lib/dateRangeExport";
import type { Remission, RemissionDetailResponse, RemissionFindAllSuccess } from "@/types/remission";
import type { ApiResponse } from "@/types/api";

export class RemissionsService {
    /**
     * GET /remissions
     */
    static async list(params?: Record<string, any>): Promise<ApiResponse<RemissionFindAllSuccess>> {
        return apiClient.get<RemissionFindAllSuccess>(
            "/remissions" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
    }

    /**
     * GET /remissions/{remissionId}
     */
    static async getById(id: number | string) {
        return apiClient.get<RemissionDetailResponse>(`/remissions/${id}`);
    }

    /**
     * POST /remissions
     */
    static async create(data: Partial<Remission>) {
        return apiClient.post<Remission>("/remissions", data);
    }

    /**
     * PATCH /remissions/{remissionId}
     */
    static async update(id: number | string, data: Partial<Remission>) {
        return apiClient.patch<Remission>(`/remissions/${id}`, data);
    }

    /**
     * DELETE /remissions/{remissionId}
     */
    static async delete(id: number | string) {
        return apiClient.delete(`/remissions/${id}`);
    }

    /**
     * GET /remissions/{remissionId}/pdf/preview
     */
    static getPrintUrl(id: number | string, template?: number) {
        return `${envs.apiUrl}/remissions/${id}/pdf/preview${template ? `?template=${template}` : ""}`;
    }

    /**
     * GET /remissions/{remissionId}/pdf/preview
     */
    static async printPdfBlob(id: number | string, template?: number) {
        return apiClient.getBlob(`/remissions/${id}/pdf/preview${template ? `?template=${template}` : ""}`);
    }

    /**
     * GET /remissions/{remissionId}/downloads/pdf
     */
    static async downloadPdfBlob(id: number | string, template?: number) {
        return apiClient.getBlob(`/remissions/${id}/downloads/pdf${template ? `?template=${template}` : ""}`);
    }

    /**
     * Preflight / Vista previa borrador
     * POST /remissions/preflight
     */
    static async preflight(data: Partial<Remission>) {
        return apiClient.postBlob("/remissions/preflight", data);
    }

    /**
     * POST /remissions/export
     * Exporta a Excel las remisiones creadas entre las fechas `from` y `to` (YYYY-MM-DD).
     * Descarga el archivo automáticamente si hay resultados; si no, devuelve el mensaje del backend.
     */
    static async exportByDateRange(from: string, to: string) {
        return exportByDateRange("/remissions/export", from, to, `Remisiones_${from}_a_${to}.xlsx`);
    }
}
