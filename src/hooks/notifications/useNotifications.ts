import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService } from "@/lib/notifications";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { showToast } from "@/components/sonner/CustomToaster";
import type { NotificationData } from "@/types/notification";

const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;
const LIST_KEY = (filter: string) => ["notifications", "list", filter] as const;

// Polling de respaldo solo mientras el socket esté caído (ver comments-notifications.md)
const FALLBACK_POLL_INTERVAL = 45_000;

function getChannelName(): string | null {
    const session = getSession() as any;
    const tenantId = session?.tenant_id;
    const userId = session?.user?.id;
    if (!tenantId || !userId) return null;
    return `tenant.${tenantId}.users.${userId}`;
}

// Suscripción al canal privado del usuario: incrementa el badge en cuanto llega
// el evento por WebSocket, sin volver a pedir /unread-count.
export function useNotificationsSocket() {
    const queryClient = useQueryClient();
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {
        const channelName = getChannelName();
        if (!channelName) return;

        const echo = getEcho();
        if (!echo) return;

        const channel = echo.private(channelName);
        channel.notification((notification: NotificationData) => {
            queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (old) => ({
                count: (old?.count ?? 0) + 1,
            }));
            queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });

            // Si el hilo mencionado está abierto en pantalla, refréscalo también.
            if (notification?.commentable_type && notification?.commentable_id) {
                queryClient.invalidateQueries({
                    queryKey: ["comments", notification.commentable_type, String(notification.commentable_id)],
                });
            }

            if (notification?.mentioned_by?.name) {
                showToast(
                    notification.excerpt || "Tienes una nueva mención",
                    "info",
                    `${notification.mentioned_by.name} te mencionó en ${notification.commentable_label}`
                );
            }
        });

        const unsubscribeStatus = echo.connector.onConnectionChange?.((status) => {
            setSocketConnected(status === "connected");
        });

        return () => {
            unsubscribeStatus?.();
            echo.leave(channelName);
        };
    }, [queryClient]);

    // Respaldo: si el socket está caído, pollear unread-count cada 45s.
    // En cuanto reconecta, se deja de pollear.
    useEffect(() => {
        if (socketConnected) return;

        const interval = setInterval(() => {
            queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_KEY });
        }, FALLBACK_POLL_INTERVAL);

        return () => clearInterval(interval);
    }, [socketConnected, queryClient]);
}

export function useUnreadNotificationsCount() {
    return useQuery({
        queryKey: UNREAD_COUNT_KEY,
        queryFn: async () => NotificationsService.unreadCount(),
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}

export function useNotificationsList(filter: "unread" | "read" | "all", enabled: boolean) {
    return useQuery({
        queryKey: LIST_KEY(filter),
        queryFn: async () => NotificationsService.list({ filter, per_page: 10 }),
        select: (res) => res.data,
        enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => NotificationsService.markAsRead(id),
        onSuccess: () => {
            queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (old) => ({
                count: Math.max(0, (old?.count ?? 1) - 1),
            }));
            queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => NotificationsService.markAllAsRead(),
        onSuccess: () => {
            queryClient.setQueryData(UNREAD_COUNT_KEY, { count: 0 });
            queryClient.invalidateQueries({ queryKey: ["notifications", "list"] });
        },
    });
}
