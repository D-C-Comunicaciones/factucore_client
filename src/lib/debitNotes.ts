import { apiClient } from "@/lib/api-client";

export interface DebitNoteType {
    id: number;
    name: string;
    code?: string;
    description?: string;
}

export class DebitNotesService {
    /**
     * GET /type-debit-notes
     * Devuelve los tipos de nota débito disponibles para el select.
     */
    static async listTypes(): Promise<DebitNoteType[]> {
        const res = await apiClient.get<any>("/type-debit-notes");
        const data = res?.data || res;

        if (data?.type_debit_notes && Array.isArray(data.type_debit_notes)) {
            return data.type_debit_notes;
        } else if (data?.data?.type_debit_notes && Array.isArray(data.data.type_debit_notes)) {
            return data.data.type_debit_notes;
        } else if (Array.isArray(data)) {
            return data;
        }

        return [];
    }

    /**
     * GET /invoices?contact_id=:customerId&per_page=500
     * Trae las facturas del cliente seleccionado para el select "Factura de venta asociada".
     */
    static async listInvoicesByCustomer(customerId: string): Promise<{ id: number; number: string; prefix?: string }[]> {
        const res = await apiClient.get<any>(`/invoices?contact_id=${customerId}&per_page=500`);
        const payload = (res as any)?.data ?? res;
        // Intentar distintas estructuras de respuesta
        const items: any[] =
            Array.isArray(payload) ? payload :
            Array.isArray(payload?.invoices) ? payload.invoices :
            Array.isArray(payload?.data) ? payload.data :
            [];
        return items;
    }

    /**
     * GET /debit-notes
     * Obtiene la lista de notas de débito.
     */
    static async index(params?: Record<string, any>): Promise<any> {
        const res = await apiClient.get<any>("/debit-notes", { params });
        return res?.data || res;
    }

    /**
     * POST /debit-notes
     * Crea una nota de débito sin enviarla a la DIAN.
     */
    static async store(data: any): Promise<any> {
        const res = await apiClient.post<any>("/debit-notes", data);
        return res?.data || res;
    }

    /**
     * GET /debit-notes/{id}
     * Muestra los detalles de una nota de débito.
     */
    static async show(id: number | string): Promise<any> {
        const res = await apiClient.get<any>(`/debit-notes/${id}`);
        return res?.data || res;
    }

    /**
     * POST /debit-notes/send
     * Crea y envía una nota de débito a la DIAN.
     */
    static async send(data: any): Promise<any> {
        const res = await apiClient.post<any>("/debit-notes/send", data);
        return res?.data || res;
    }

    /**
     * GET /debit-notes/{id}/xml
     * Descarga el XML de la nota de débito.
     */
    static async downloadXml(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/debit-notes/${id}/xml`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /debit-notes/{id}/pdf
     * Descarga el PDF de la nota de débito.
     */
    static async downloadPdf(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/debit-notes/${id}/pdf`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /debit-notes/{id}/zip
     * Descarga el ZIP de la nota de débito.
     */
    static async downloadZip(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/debit-notes/${id}/zip`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /debit-notes/{id}/pdf/preview
     * Obtiene el PDF para imprimir (blob).
     */
    static async printPdfBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/debit-notes/${id}/pdf/preview`);
    }

    /**
     * GET /debit-notes/{id}/pdf
     * Descarga el PDF de la nota de débito (blob).
     */
    static async downloadPdfBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/debit-notes/${id}/pdf`);
    }

    /**
     * GET /debit-notes/{id}/xml
     * Descarga el XML de la nota de débito (blob).
     */
    static async downloadXmlBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/debit-notes/${id}/xml`);
    }
}
