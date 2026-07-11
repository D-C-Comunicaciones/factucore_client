import { apiClient } from "@/lib/api-client";

export class PaymentsService {
    /**
     * Listar pagos registrados
     */
    static async list(params?: Record<string, any>) {
        return apiClient.get<any>(
            "/payments" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
    }

    /**
     * Obtener detalle de un pago (endpoint listo, falta lógica avanzada)
     */
    static async getById(id: number | string) {
        return apiClient.get<any>(`/payments/${id}`);
    }

    /**
     * Crear un nuevo pago (endpoint listo, falta lógica avanzada)
     */
    static async create(payload: any) {
        return apiClient.post<any>("/payments", payload);
    }
}
