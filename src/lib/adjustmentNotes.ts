import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import type {
    AdjustmentNotePayload,
    AdjustmentNoteDetailData,
    AdjustmentNoteFindAllSuccess,
    AdjustmentNoteSendTestResult,
} from "@/types/adjustmentNote";

// Same fixed habilitación TestSetId as Documento Soporte — see SUPPORT_DOCUMENT_TEST_SET_ID in
// lib/supportDocuments.ts for why this is a constant rather than a per-request value.
export const ADJUSTMENT_NOTE_TEST_SET_ID = "0b96ead9-eb82-48f1-a25d-83d0d3ec3755";

export class AdjustmentNotesService {
    static async list(params?: Record<string, any>) {
        const query = params ? `?${new URLSearchParams(params).toString()}` : "";
        return apiClient.get<AdjustmentNoteFindAllSuccess>(`/adjustment-notes${query}`);
    }

    static async getById(id: number | string) {
        return apiClient.get<AdjustmentNoteDetailData>(`/adjustment-notes/${id}`);
    }

    static async store(data: AdjustmentNotePayload) {
        return apiClient.post<AdjustmentNoteDetailData>("/adjustment-notes", data);
    }

    /** Creates the Adjustment Note AND sends it to DIAN's habilitación environment in one call. */
    static async sendTest(data: AdjustmentNotePayload, testSetId: string = ADJUSTMENT_NOTE_TEST_SET_ID) {
        return apiClient.post<AdjustmentNoteSendTestResult>(`/adjustment-notes/sendTest/${testSetId}`, data);
    }

    static getPrintUrl(id: number | string) {
        return `${envs.apiUrl}/adjustment-notes/${id}/pdf/preview`;
    }

    static getPdfUrl(id: number | string) {
        return `${envs.apiUrl}/adjustment-notes/${id}/downloads/pdf`;
    }

    static async printPdfBlob(id: number | string) {
        return apiClient.getBlob(`/adjustment-notes/${id}/pdf/preview`);
    }

    static async downloadPdfBlob(id: number | string) {
        return apiClient.getBlob(`/adjustment-notes/${id}/downloads/pdf`);
    }

    static async downloadXmlBlob(id: number | string) {
        return apiClient.getBlob(`/adjustment-notes/${id}/downloads/xml`);
    }

    static async downloadZipBlob(id: number | string) {
        return apiClient.getBlob(`/adjustment-notes/${id}/downloads/zip`);
    }
}
