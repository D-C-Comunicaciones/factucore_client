import { apiClient } from "@/lib/api-client";
import type { NotificationsListResponse } from "@/types/notification";

// comments-notifications.md documenta estos endpoints devolviendo la data
// "cruda" (paginación estándar de Laravel) sin el envelope
// {status,code,message,data} que usa el resto de la API — pero en la
// práctica el backend a veces sí envuelve. Normalizamos ambos casos.

function unwrapPaginated(raw: any): NotificationsListResponse {
    if (Array.isArray(raw?.data)) {
        // Ya viene "plano": { current_page, data: [...] }
        return raw as NotificationsListResponse;
    }
    if (Array.isArray(raw?.data?.data)) {
        // Envuelto en el envelope estándar: { status, ..., data: { current_page, data: [...] } }
        return raw.data as NotificationsListResponse;
    }
    return { current_page: 1, data: [] };
}

function unwrapCount(raw: any): { count: number } {
    if (typeof raw?.count === "number") return raw as { count: number };
    if (typeof raw?.data?.count === "number") return raw.data as { count: number };
    return { count: 0 };
}

export class NotificationsService {
    /**
     * GET /notifications?filter=unread|read|all&per_page=20
     */
    static async list(params?: Record<string, any>): Promise<NotificationsListResponse> {
        const raw = await apiClient.get(
            "/notifications" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        );
        return unwrapPaginated(raw);
    }

    /**
     * GET /notifications/unread-count
     */
    static async unreadCount(): Promise<{ count: number }> {
        const raw = await apiClient.get("/notifications/unread-count");
        return unwrapCount(raw);
    }

    /**
     * PATCH /notifications/{id}/read
     */
    static async markAsRead(id: string): Promise<void> {
        await apiClient.patch(`/notifications/${id}/read`);
    }

    /**
     * PATCH /notifications/read-all
     */
    static async markAllAsRead(): Promise<void> {
        await apiClient.patch("/notifications/read-all");
    }
}
