import { apiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api";
import type { PurchaseOrder } from "@/types/purchaseOrder";

export class PurchaseOrdersService {
    /**
     * GET /purchase-orders
     * ?contact_id=123 -> solo externas de ese contacto (selector de factura)
     * ?type=external|internal -> todas las de ese tipo
     */
    static async list(params?: Record<string, any>): Promise<ApiResponse<any>> {
        return apiClient.get(
            "/purchase-orders" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
    }

    /**
     * GET /purchase-orders/{id}
     */
    static async getById(id: number | string): Promise<ApiResponse<any>> {
        return apiClient.get(`/purchase-orders/${id}`);
    }

    /**
     * POST /purchase-orders
     */
    static async create(data: Partial<PurchaseOrder>): Promise<ApiResponse<any>> {
        return apiClient.post("/purchase-orders", data);
    }

    /**
     * PATCH /purchase-orders/{id}
     * No permite cambiar type, resolution_id, prefix ni number.
     */
    static async update(id: number | string, data: Partial<PurchaseOrder>): Promise<ApiResponse<any>> {
        return apiClient.patch(`/purchase-orders/${id}`, data);
    }

    /**
     * DELETE /purchase-orders/{id}
     * 422 si ya está asociada a una factura (invoice_id no nulo).
     */
    static async delete(id: number | string): Promise<ApiResponse<any>> {
        return apiClient.delete(`/purchase-orders/${id}`);
    }
}
