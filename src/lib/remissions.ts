import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import type { Remission, RemissionDetailResponse, RemissionFindAllSuccess } from "@/types/remission";

export class RemissionsService {
    static async list(params?: Record<string, any>) {
        return apiClient.get<RemissionFindAllSuccess>(
            "/Remissions" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
    }

    static async getById(id: number | string) {
        // La respuesta ya es RemissionDetailResponse, no ApiResponse<...>
        return apiClient.get<RemissionDetailResponse>(`/Remissions/${id}`);
    }

    /**
     * Construye el payload de la RemisiÃ³n segÃºn los datos del formulario,
     * agregando impuestos, recargos, descuentos, etc. segÃºn corresponda.
     */
    static buildRemissionPayload(form: any): Partial<Remission> {
        // AquÃ­ se debe mapear el formulario real a la estructura del backend
        // Ejemplo base:
        const {
            resolution_id,
            contact_id,
            payment_form_id,
            payment_method_id,
            type_operation_Remission,
            payment_due_date,
            municipality_id,
            send_email,
            observation,
            Remission_lines,
            allowance_charges,
            withholding_taxes,
            ...rest
        } = form;

        // Procesar lÃ­neas para incluir impuestos, recargos, descuentos, etc.
        const lines = (Remission_lines || []).map((line: any) => {
            const l: any = {
                id: line.id,
                quantity: line.cantidad || line.quantity,
                price_amount: line.precio || line.price_amount,
                description: line.descripcion || line.description,
            };
            // Impuestos por lÃ­nea
            if (line.taxes && line.taxes.length > 0) {
                l.taxes = line.taxes.map((t: any) => ({
                    tax_id: t.tax_id,
                    tax_rate_id: t.tax_rate_id,
                    tax_code: t.tax_code || t.code || (t.tax_id ? String(t.tax_id) : undefined),
                    tax_name: t.tax_name || t.name,
                    name: t.name,
                    type: t.type,
                    rate: t.rate,
                }));
            }
            // Recargos/descuentos por lÃ­nea
            if (line.allowance_charges && line.allowance_charges.length > 0) {
                l.allowance_charges = line.allowance_charges;
            }
            return l;
        });

        // Recargos/descuentos globales
        const globalAllowanceCharges = (allowance_charges || []).filter((a: any) => a.scope === "global");

        return {
            resolution_id,
            contact_id,
            payment_form_id,
            payment_method_id,
            type_operation_Remission: type_operation_Remission ?? 1,
            payment_due_date,
            municipality_id,
            send_email,
            observation,
            items: lines,
            allowance_charges: globalAllowanceCharges,
            withholding_taxes,
            ...rest,
        };
    }

    /**
     * Guardar RemisiÃ³n (borrador o sin emitir)
     */
    static async saveDraft(data: Partial<Remission>) {
        return apiClient.post<Remission>("/Remissions", data);
    }

    /**
     * Emitir RemisiÃ³n a la DIAN directamente (POST /Remissions/send)
     */
    static async sendDirect(data: Partial<Remission>) {
        return apiClient.post<Remission>("/Remissions/send", data);
    }

    /**
     * Emitir RemisiÃ³n ya guardada (enviar a la DIAN)
     */
    static async sendRemission(id: number | string) {
        return apiClient.post<Remission>(`/Remissions/send/${id}`);
    }

    static async create(data: Partial<Remission>) {
        // Por compatibilidad, crea como borrador
        return this.saveDraft(data);
    }

    /**
     * Vista previa (Preflight) que devuelve el PDF en crudo sin guardar en BD
     */
    static async preflight(data: Partial<Remission>) {
        return apiClient.postBlob("/Remissions/preflight", data);
    }

    static async update(id: number | string, data: Partial<Remission>) {
        return apiClient.patch<Remission>(`/Remissions/${id}`, data);
    }

    static async cancel(id: number | string) {
        return apiClient.post(`/Remissions/${id}/cancel`);
    }

    static getPdfUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/Remissions/${id}/downloads/pdf?template=${template}`;
    }

    static getPrintUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/Remissions/${id}/pdf/preview?template=${template}`;
    }

    static async downloadPdfBlob(id: number | string, template = 1) {
        return apiClient.getBlob(`/Remissions/${id}/downloads/pdf?template=${template}`);
    }

    static async downloadXmlBlob(id: number | string) {
        return apiClient.getBlob(`/Remissions/${id}/downloads/xml`);
    }

    static async printPdfBlob(id: number | string, template = 1) {
        return apiClient.getBlob(`/Remissions/${id}/pdf/preview?template=${template}`);
    }

    static getZipUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/Remissions/${id}/downloads/zip?template=${template}`;
    }
}

