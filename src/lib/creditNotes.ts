import { apiClient } from "@/lib/api-client";

export interface CreditNoteType {
    id: number;
    name: string;
    code?: string;
    description?: string;
}

export class CreditNotesService {
    /**
     * GET /type-credit-notes
     * Devuelve los tipos de nota crédito disponibles para el select.
     */
    static async listTypes(): Promise<CreditNoteType[]> {
        const res = await apiClient.get<any>("/type-credit-notes");
        const data = res?.data || res;
        
        if (data?.type_credit_notes && Array.isArray(data.type_credit_notes)) {
            return data.type_credit_notes;
        } else if (data?.data?.type_credit_notes && Array.isArray(data.data.type_credit_notes)) {
            return data.data.type_credit_notes;
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
     * GET /credit-notes
     * Obtiene la lista de notas de crédito.
     */
    static async index(params?: Record<string, any>): Promise<any> {
        const res = await apiClient.get<any>("/credit-notes", { params });
        return res?.data || res;
    }

    /**
     * POST /credit-notes
     * Crea una nota de crédito sin enviarla a la DIAN.
     */
    static async store(data: any): Promise<any> {
        const res = await apiClient.post<any>("/credit-notes", data);
        return res?.data || res;
    }

    /**
     * PATCH /credit-notes/{id}
     * Edición mínima (cliente, nota, observación) — solo mientras no esté aprobada por la DIAN.
     */
    static async update(id: number | string, data: any): Promise<any> {
        const res = await apiClient.patch<any>(`/credit-notes/${id}`, data);
        return res?.data || res;
    }

    /**
     * GET /credit-notes/{id}
     * Muestra los detalles de una nota de crédito.
     */
    static async show(id: number | string): Promise<any> {
        const res = await apiClient.get<any>(`/credit-notes/${id}`);
        return res?.data || res;
    }

    /**
     * POST /credit-notes/send
     * Crea y envía una nota de crédito a la DIAN.
     */
    static async send(data: any): Promise<any> {
        const res = await apiClient.post<any>("/credit-notes/send", data);
        return res?.data || res;
    }

    /**
     * GET /credit-notes/{id}/xml
     * Descarga el XML de la nota de crédito.
     */
    static async downloadXml(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/credit-notes/${id}/xml`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /credit-notes/{id}/pdf
     * Descarga el PDF de la nota de crédito.
     */
    static async downloadPdf(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/credit-notes/${id}/pdf`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /credit-notes/{id}/zip
     * Descarga el ZIP de la nota de crédito.
     */
    static async downloadZip(id: number | string): Promise<Blob> {
        const res = await apiClient.get<Blob>(`/credit-notes/${id}/zip`, {
            responseType: "blob"
        });
        return (res as any)?.data || res;
    }

    /**
     * GET /credit-notes/{id}/pdf/preview
     * Obtiene el PDF para imprimir (blob).
     */
    static async printPdfBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/credit-notes/${id}/pdf/preview`);
    }

    /**
     * GET /credit-notes/{id}/pdf
     * Descarga el PDF de la nota de crédito (blob).
     */
    static async downloadPdfBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/credit-notes/${id}/pdf`);
    }

    /**
     * GET /credit-notes/{id}/xml
     * Descarga el XML de la nota de crédito (blob).
     */
    static async downloadXmlBlob(id: number | string): Promise<Blob> {
        return apiClient.getBlob(`/credit-notes/${id}/xml`);
    }
}
