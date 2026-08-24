import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService, DOCUMENT_ROUTES } from "@/lib/notifications";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { showMentionNotificationToast, showReminderToast, showToast } from "@/components/sonner/CustomToaster";
import type { NotificationData } from "@/types/notification";

const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;
const LIST_KEY = (filter: string) => ["notifications", "list", filter] as const;

// Polling de respaldo solo mientras el socket esté caído (ver comments-notifications.md)
const FALLBACK_POLL_INTERVAL = 45_000;

// Igual que parseApiDate/formatDateTime en NotificationBell.tsx y RemindersPanel.tsx
// (due_at sí es ISO, pero el formato de salida debe verse igual en los 3 lugares).
function formatDueAt(iso: string): string {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    const day = d.getDate();
    const month = d.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");
    const time = d.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit", hour12: true });
    return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${time}`;
}

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
    const router = useRouter();
    const markAsRead = useMarkNotificationRead();
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

            if (notification.type === "comment_mention") {
                // Si el hilo mencionado está abierto en pantalla, refréscalo también.
                queryClient.invalidateQueries({
                    queryKey: ["comments", notification.commentable_type, String(notification.commentable_id)],
                });

                const basePath = DOCUMENT_ROUTES[notification.commentable_type];
                const navigateToDocument = () => {
                    if (basePath) router.push(`${basePath}/${notification.commentable_id}`);
                };

                // El evento del socket trae los mismos campos que GET /notifications
                // PERO sin el `id` (uuid) de la notificación — solo el endpoint REST
                // lo trae — así que se resuelve pidiendo la más reciente (ésta) justo
                // antes de armar las acciones "Ver"/"Marcar como leída" del toast.
                NotificationsService.list({ filter: "all", per_page: 1 })
                    .then((res) => {
                        const notificationId = res.data?.[0]?.id;

                        showMentionNotificationToast({
                            mentionedByName: notification.mentioned_by.name,
                            commentableLabel: notification.commentable_label,
                            excerptHtml: notification.excerpt,
                            onView: () => {
                                if (notificationId) markAsRead.mutate(notificationId);
                                navigateToDocument();
                            },
                            onMarkRead: () => {
                                if (notificationId) markAsRead.mutate(notificationId);
                            },
                        });
                    })
                    .catch(() => {
                        // Si falla la consulta, se muestra igual el toast pero sin poder
                        // resolver el id real — "Ver" sigue navegando al documento.
                        showMentionNotificationToast({
                            mentionedByName: notification.mentioned_by.name,
                            commentableLabel: notification.commentable_label,
                            excerptHtml: notification.excerpt,
                            onView: navigateToDocument,
                            onMarkRead: () => {},
                        });
                    });
                return;
            }

            // Recordatorios (ver recordatorios.md §3): reminder_due es el aviso "de
            // verdad" — el que dispara el popup en el momento exacto de vencimiento.
            // Las otras 3 variantes (assigned/unassigned/deleted) solo se avisan con
            // un toast simple, reusando el `message` que ya viene armado del backend.
            const basePath = DOCUMENT_ROUTES[notification.remindable_type];
            const navigateToReminder = () => {
                if (basePath) router.push(`${basePath}/${notification.remindable_id}`);
            };

            if (notification.type === "reminder_due") {
                showReminderToast({
                    title: notification.title,
                    dateTimeLabel: notification.due_at ? formatDueAt(notification.due_at) : "",
                    onViewDetails: navigateToReminder,
                });
            } else {
                showToast(notification.message, "info");
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
