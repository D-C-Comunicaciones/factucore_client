import { apiClient } from "@/lib/api-client";
import type { NotificationsListResponse } from "@/types/notification";

// Los endpoints de notificaciones devuelven paginación estándar de Laravel
// (current_page/data/...), sin el envelope {status,code,message,data} que
// usa el resto de la API — ver comments-notifications.md.
export class NotificationsService {
    /**
     * GET /notifications?filter=unread|read|all&per_page=20
     */
    static async list(params?: Record<string, any>): Promise<NotificationsListResponse> {
        return apiClient.get(
            "/notifications" + (params ? `?${new URLSearchParams(params).toString()}` : "")
        ) as unknown as Promise<NotificationsListResponse>;
    }

    /**
     * GET /notifications/unread-count
     */
    static async unreadCount(): Promise<{ count: number }> {
        return apiClient.get("/notifications/unread-count") as unknown as Promise<{ count: number }>;
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
