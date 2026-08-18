import { apiClient } from "@/lib/api-client";
import type { PurchaseOrder, PurchaseOrderListData } from "@/types/purchaseOrder";

// purchase-orders-endpoints.md documenta este módulo con SU PROPIO envelope
// (customMessage + purchase_orders/purchase_order), distinto del
// {status,code,message,data} que usa el resto de la API. Normalizamos
// aceptando también el envelope estándar por si el backend lo envuelve.

function unwrapList(raw: any): PurchaseOrderListData {
    for (const body of [raw, raw?.data]) {
        if (Array.isArray(body?.purchase_orders)) {
            return {
                purchase_orders: body.purchase_orders,
                pagination: body.pagination ?? { current_page: 1, per_page: 20, total: body.purchase_orders.length, last_page: 1, from: 0, to: 0 },
            };
        }
    }
    return { purchase_orders: [], pagination: { current_page: 1, per_page: 20, total: 0, last_page: 1, from: 0, to: 0 } };
}

function unwrapOne(raw: any): PurchaseOrder | null {
    if (raw?.purchase_order) return raw.purchase_order as PurchaseOrder;
    if (raw?.data?.purchase_order) return raw.data.purchase_order as PurchaseOrder;
    // Por si el backend devuelve el objeto plano sin envolver
    if (raw?.id != null && raw?.type) return raw as PurchaseOrder;
    if (raw?.data?.id != null && raw?.data?.type) return raw.data as PurchaseOrder;
    return null;
}

export class PurchaseOrdersService {
    /**
     * GET /purchase-orders
     * ?contact_id=123 -> solo externas de ese contacto (selector de factura)
     * ?type=external|internal -> todas las de ese tipo
     */
    static async list(params?: Record<string, any>): Promise<PurchaseOrderListData> {
        const raw = await apiClient.get(
            "/purchase-orders" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
        return unwrapList(raw);
    }

    /**
     * GET /purchase-orders/{id}
     */
    static async getById(id: number | string): Promise<PurchaseOrder> {
        const raw = await apiClient.get(`/purchase-orders/${id}`);
        const po = unwrapOne(raw);
        if (!po) throw new Error("No se encontró la orden de compra");
        return po;
    }

    /**
     * POST /purchase-orders
     */
    static async create(data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
        const raw = await apiClient.post("/purchase-orders", data);
        const po = unwrapOne(raw);
        if (!po) throw new Error("Error al crear la orden de compra");
        return po;
    }

    /**
     * PATCH /purchase-orders/{id}
     * No permite cambiar type, resolution_id, prefix ni number.
     */
    static async update(id: number | string, data: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
        const raw = await apiClient.patch(`/purchase-orders/${id}`, data);
        const po = unwrapOne(raw);
        if (!po) throw new Error("Error al actualizar la orden de compra");
        return po;
    }

    /**
     * DELETE /purchase-orders/{id}
     * Borrado lógico. 422 si ya está asociada a una factura (invoice_id no nulo).
     */
    static async delete(id: number | string): Promise<void> {
        await apiClient.delete(`/purchase-orders/${id}`);
    }
}
