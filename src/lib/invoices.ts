import { envs } from "@/config/env";
import { apiClient } from "@/lib/api-client";
import { ApiResponse } from "@/types/api";
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
            numbering_range_id,
            customer_id,
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
            numbering_range_id,
            customer_id,
            payment_form_id,
            payment_method_id,
            type_operation_invoice,
            payment_due_date,
            municipality_id,
            send_email,
            observation,
            invoice_lines: lines,
            allowance_charges: globalAllowanceCharges,
            withholding_taxes,
            ...rest,
        };
    }

    /**
     * Guardar factura (borrador o sin emitir)
     */
    static async saveDraft(data: Partial<Invoice>) {
        // El backend debe soportar guardar en estado editable
        return apiClient.post<Invoice>("/invoices", { ...data, status: "draft" });
    }

    /**
     * Emitir factura (enviar a la DIAN)
     */
    static async sendInvoice(id: number | string) {
        // Llama al endpoint /send para emitir
        return apiClient.post<Invoice>(`/invoices/${id}/send`);
    }

    static async create(data: Partial<Invoice>) {
        // Por compatibilidad, crea como borrador
        return this.saveDraft(data);
    }

    static async update(id: number | string, data: Partial<Invoice>) {
        return apiClient.patch<Invoice>(`/invoices/${id}`, data);
    }

    static getPdfUrl(id: number | string, template = 1) {
        // Cambia aquí la URL base si tu backend cambia de host o puerto
        return `${envs.apiUrl}/invoices/${id}/downloads/pdf?template=${template}`;
    }

    static getZipUrl(id: number | string, template = 1) {
        return `${envs.apiUrl}/invoices/${id}/downloads/zip?template=${template}`;
    }
}
