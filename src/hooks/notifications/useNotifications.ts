import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService, DOCUMENT_ROUTES } from "@/lib/notifications";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { showMentionNotificationToast, showReminderToast, showToast } from "@/components/sonner/CustomToaster";
import { playNotificationSound } from "@/lib/notificationSound";
import type { AppNotification, NotificationData } from "@/types/notification";

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
            // Único punto por el que pasan TODAS las notificaciones en tiempo real (menciones,
            // recordatorios asignados/actualizados/vencidos...) — el sonido va acá para que
            // cubra cualquier tipo sin tener que tocarlo de nuevo cuando se agregue uno nuevo.
            playNotificationSound();

            queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (old) => ({
                count: (old?.count ?? 0) + 1,
            }));

            // El evento del socket trae los mismos campos que GET /notifications PERO sin el
            // `id` (uuid) de la notificación — solo el endpoint REST lo trae (ver
            // App\Notifications\*::broadcastWith() en el backend, que a propósito no lo incluye).
            // En vez de invalidar la lista completa (lo que forzaba un nuevo GET cada vez que se
            // abría la campana, aunque nada hubiera cambiado desde la última mención), se trae
            // SOLO la fila nueva y se antepone directo al cache ya cargado — la lista queda al
            // día sin volver a pedir /notifications completo. Este GET puntual (per_page:1) es
            // el único disparado por el socket; el resto de la sesión, cero llamadas nuevas.
            NotificationsService.list({ filter: "all", per_page: 1 })
                .then((res) => {
                    const fresh = res.data?.[0];
                    if (fresh) {
                        const prepend = (old: AppNotification[] | undefined) =>
                            old ? [fresh, ...old.filter((n) => n.id !== fresh.id)] : old;
                        queryClient.setQueryData<AppNotification[]>(LIST_KEY("all"), prepend);
                        queryClient.setQueryData<AppNotification[]>(LIST_KEY("unread"), prepend);
                    }

                    const notificationId = fresh?.id;

                    if (notification.type === "comment_mention") {
                        const basePath = DOCUMENT_ROUTES[notification.commentable_type];
                        const navigateToDocument = () => {
                            if (basePath) router.push(`${basePath}/${notification.commentable_id}`);
                        };

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
                    }
                })
                .catch(() => {
                    // Si falla la consulta puntual, se muestra igual el toast (sin poder marcar
                    // como leída desde ahí) — la fila real llegará en el próximo evento o recarga.
                    if (notification.type === "comment_mention") {
                        const basePath = DOCUMENT_ROUTES[notification.commentable_type];
                        showMentionNotificationToast({
                            mentionedByName: notification.mentioned_by.name,
                            commentableLabel: notification.commentable_label,
                            excerptHtml: notification.excerpt,
                            onView: () => {
                                if (basePath) router.push(`${basePath}/${notification.commentable_id}`);
                            },
                            onMarkRead: () => {},
                        });
                    }
                });

            if (notification.type === "comment_mention") {
                // Si el hilo mencionado está abierto en pantalla, refréscalo también.
                queryClient.invalidateQueries({
                    queryKey: ["comments", notification.commentable_type, String(notification.commentable_id)],
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

// staleTime: Infinity + refetchOnMount: false — el conteo se pide UNA vez al montar
// (inicio de sesión); de ahí en más solo lo tocan el socket (useNotificationsSocket) y las
// mutaciones de abajo, nunca un refetch a la API. Recargar la página sí vuelve a pedirlo
// (el cache de React Query no sobrevive un refresh completo).
export function useUnreadNotificationsCount() {
    return useQuery({
        queryKey: UNREAD_COUNT_KEY,
        queryFn: async () => NotificationsService.unreadCount(),
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}

// Mismo criterio: un solo GET al montar (ya no depende de "enabled"/abrir la campana), y de
// ahí en más el socket antepone las filas nuevas directo al cache (ver useNotificationsSocket)
// y las mutaciones de abajo lo actualizan localmente — abrir/cerrar la campana nunca dispara
// una petición nueva.
export function useNotificationsList(filter: "unread" | "read" | "all") {
    return useQuery({
        queryKey: LIST_KEY(filter),
        queryFn: async () => NotificationsService.list({ filter, per_page: 10 }),
        select: (res) => res.data,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
}

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => NotificationsService.markAsRead(id),
        onSuccess: (_data, id) => {
            queryClient.setQueryData<{ count: number }>(UNREAD_COUNT_KEY, (old) => ({
                count: Math.max(0, (old?.count ?? 1) - 1),
            }));
            queryClient.setQueryData<AppNotification[]>(LIST_KEY("all"), (old) =>
                old?.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
            );
            queryClient.setQueryData<AppNotification[]>(LIST_KEY("unread"), (old) =>
                old?.filter((n) => n.id !== id)
            );
        },
    });
}

export function useMarkAllNotificationsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => NotificationsService.markAllAsRead(),
        onSuccess: () => {
            const now = new Date().toISOString();
            queryClient.setQueryData(UNREAD_COUNT_KEY, { count: 0 });
            queryClient.setQueryData<AppNotification[]>(LIST_KEY("all"), (old) =>
                old?.map((n) => (n.read_at ? n : { ...n, read_at: now }))
            );
            queryClient.setQueryData<AppNotification[]>(LIST_KEY("unread"), []);
        },
    });
}
