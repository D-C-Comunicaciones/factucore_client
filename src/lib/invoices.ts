import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import type { Invoice, InvoiceDetailResponse, InvoiceFindAllSuccess } from "@/types/invoice";

export class InvoicesService {
    static async list(params?: Record<string, any>) {
        return apiClient.get<InvoiceFindAllSuccess>(
            "/invoices" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
    }

    static async getById(id: number | string) {
        // La respuesta ya es InvoiceDetailResponse, no ApiResponse<...>
        return apiClient.get<InvoiceDetailResponse>(`/invoices/${id}`);
    }

    /**
     * Construye el payload de la factura según los datos del formulario,
     * agregando impuestos, recargos, descuentos, etc. según corresponda.
     */
    static buildInvoicePayload(form: any): Partial<Invoice> {
        // Aquí se debe mapear el formulario real a la estructura del backend
        // Ejemplo base:
        const {
            resolution_id,
            contact_id,
            payment_form_id,
            payment_method_id,
            type_operation_invoice,
            payment_due_date,
            municipality_id,
            send_email,
            observation,
            invoice_lines,
            allowance_charges,
            withholding_taxes,
            ...rest
        } = form;

        // Procesar líneas para incluir impuestos, recargos, descuentos, etc.
        const lines = (invoice_lines || []).map((line: any) => {
            const l: any = {
                id: line.id,
                quantity: line.cantidad || line.quantity,
                price_amount: line.precio || line.price_amount,
                description: line.descripcion || line.description,
            };
            // Impuestos por línea
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
            // Recargos/descuentos por línea
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
            type_operation_invoice: type_operation_invoice ?? 1,
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
     * Guardar factura (borrador o sin emitir)
     */
    static async saveDraft(data: Partial<Invoice>) {
        return apiClient.post<Invoice>("/invoices", data);
    }

    /**
     * Emitir factura a la DIAN directamente (POST /invoices/send)
     */
    static async sendDirect(data: Partial<Invoice>) {
        return apiClient.post<Invoice>("/invoices/send", data);
    }

    /**
     * Emitir factura ya guardada (enviar a la DIAN)
     */
    static async sendInvoice(id: number | string) {
        return apiClient.post<Invoice>(`/invoices/send/${id}`);
    }

    static async create(data: Partial<Invoice>) {
        // Por compatibilidad, crea como borrador
        return this.saveDraft(data);
    }

    /**
     * Vista previa (Preflight) que devuelve el PDF en crudo sin guardar en BD
     */
    static async preflight(data: Partial<Invoice>) {
        return apiClient.postBlob("/invoices/preflight", data);
    }

    static async update(id: number | string, data: Partial<Invoice>) {
        return apiClient.patch<Invoice>(`/invoices/${id}`, data);
    }

    static async cancel(id: number | string) {
        return apiClient.post(`/invoices/${id}/cancel`);
    }

    static getPdfUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/invoices/${id}/downloads/pdf?template=${template}`;
    }

    static getPrintUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/invoices/${id}/pdf/preview?template=${template}`;
    }

    static async downloadPdfBlob(id: number | string, template = 1) {
        return apiClient.getBlob(`/invoices/${id}/downloads/pdf?template=${template}`);
    }

    static async downloadXmlBlob(id: number | string) {
        return apiClient.getBlob(`/invoices/${id}/downloads/xml`);
    }

    static async printPdfBlob(id: number | string, template = 1) {
        return apiClient.getBlob(`/invoices/${id}/pdf/preview?template=${template}`);
    }

    static getZipUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/invoices/${id}/downloads/zip?template=${template}`;
    }
}
