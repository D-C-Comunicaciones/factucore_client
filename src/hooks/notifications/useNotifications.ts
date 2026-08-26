import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NotificationsService, DOCUMENT_ROUTES } from "@/lib/notifications";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { showMentionNotificationToast, showReplyNotificationToast, showToast } from "@/components/sonner/CustomToaster";
import { playNotificationSound } from "@/lib/notificationSound";
import { emitDueReminder } from "@/lib/dueReminderBus";
import type { NotificationData, NotificationsListResponse } from "@/types/notification";

const UNREAD_COUNT_KEY = ["notifications", "unread-count"] as const;
const LIST_KEY = (filter: string) => ["notifications", "list", filter] as const;

// Polling de respaldo solo mientras el socket esté caído (ver comments-notifications.md)
const FALLBACK_POLL_INTERVAL = 45_000;

// El backend manda fechas como "DD/MM/YYYY HH:mm" (no ISO, ver
// App\Traits\FormatsDates::formatSingleDate()) — new Date() nativo las interpreta como
// MM/DD y devuelve "Invalid Date". Mismo parseApiDate que ya usan NotificationBell.tsx,
// CommentsAndReminders.tsx y RemindersPanel.tsx (el formato de salida debe verse igual
// en los 4 lugares).
function parseApiDate(dateString?: string): Date | null {
    if (!dateString) return null;
    const match = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})[ T](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
        const [, day, month, year, hour, minute, second] = match;
        return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second || 0));
    }
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? null : d;
}

function formatDueAt(iso: string): string {
    const d = parseApiDate(iso);
    if (!d) return "";
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
        // channelName lleva tenantId+userId (ver getChannelName arriba): es el canal
        // PERSONAL del usuario logueado, nunca el de un documento — no se mezcla con
        // useCommentsSocket.ts/useRemindersSocket.ts (esos son por tenant+tipo+id de
        // documento). Un usuario nunca recibe acá las menciones/recordatorios de otro.
        channel.subscribed(() => console.log(`[notifications-socket] suscrito: "${channelName}"`));
        channel.error((err: unknown) => console.error(`[notifications-socket] error suscribiendo "${channelName}"`, err));

        channel.notification((notification: NotificationData) => {
            console.log(`[notifications-socket] notificación recibida en "${channelName}"`, { type: notification.type });

            // Único punto por el que pasan TODAS las notificaciones en tiempo real (menciones,
            // recordatorios asignados/actualizados/vencidos, respuestas...) — el sonido va acá
            // para que cubra cualquier tipo sin tener que tocarlo de nuevo cuando se agregue uno
            // nuevo. reminder_due es la excepción: DueReminderPopup (ver más abajo) ya reproduce
            // su propio sonido dedicado (reminder-sound.mp3) al montarse — sonarían los dos a la
            // vez si este también sonara acá.
            if (notification.type !== "reminder_due") {
                playNotificationSound();
            }

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
                        // BUG: esto operaba como si el cache guardado en LIST_KEY fuera
                        // directamente AppNotification[], pero lo que React Query tiene
                        // cacheado (antes de que useNotificationsList le aplique su `select`)
                        // es el NotificationsListResponse completo ({current_page, data: [...]})
                        // — la forma real que devuelve NotificationsService.list(). Llamar
                        // old.filter(...) sobre ese objeto tiraba un TypeError silencioso
                        // (atrapado por el .catch() de esta misma promesa), así que la fila
                        // nueva NUNCA se insertaba: el toast y el contador de la campana sí
                        // funcionaban (ambos corren fuera de este .then), pero la lista de la
                        // campanita se quedaba congelada en lo que tenía desde el último GET
                        // real — para CUALQUIER tipo (mención, respuesta o recordatorio).
                        const prepend = (old: NotificationsListResponse | undefined) => {
                            if (!old) return old;
                            if (old.data.some((n) => n.id === fresh.id)) return old;
                            return { ...old, data: [fresh, ...old.data] };
                        };
                        queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("all"), prepend);
                        queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("unread"), prepend);
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
                    } else if (notification.type === "comment_reply") {
                        const basePath = DOCUMENT_ROUTES[notification.commentable_type];
                        const navigateToDocument = () => {
                            if (basePath) router.push(`${basePath}/${notification.commentable_id}`);
                        };

                        showReplyNotificationToast({
                            repliedByName: notification.replied_by.name,
                            commentableLabel: notification.commentable_label,
                            originalExcerptHtml: notification.original_excerpt,
                            replyExcerptHtml: notification.reply_excerpt,
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
                    } else if (notification.type === "comment_reply") {
                        const basePath = DOCUMENT_ROUTES[notification.commentable_type];
                        showReplyNotificationToast({
                            repliedByName: notification.replied_by.name,
                            commentableLabel: notification.commentable_label,
                            originalExcerptHtml: notification.original_excerpt,
                            replyExcerptHtml: notification.reply_excerpt,
                            onView: () => {
                                if (basePath) router.push(`${basePath}/${notification.commentable_id}`);
                            },
                            onMarkRead: () => {},
                        });
                    }
                });

            if (notification.type === "comment_mention" || notification.type === "comment_reply") {
                // Si el hilo está abierto en pantalla, refréscalo también.
                queryClient.invalidateQueries({
                    queryKey: ["comments", notification.commentable_type, String(notification.commentable_id)],
                });
                return;
            }

            // Recordatorios (ver recordatorios.md §3): reminder_due es el aviso "de verdad" —
            // el que dispara el POPUP a pantalla completa (DueReminderPopup, vía dueReminderBus)
            // en el momento exacto de vencimiento, no un toast que se puede perder de vista.
            // Las otras 3 variantes (assigned/unassigned/updated/deleted) solo se avisan con
            // un toast simple, reusando el `message` que ya viene armado del backend.
            if (notification.type === "reminder_due") {
                emitDueReminder({
                    reminderId: notification.reminder_id,
                    title: notification.title,
                    dueAtLabel: notification.due_at ? formatDueAt(notification.due_at) : "",
                    remindableType: notification.remindable_type,
                    remindableId: notification.remindable_id,
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
            // Mismo bug que en useNotificationsSocket: old es NotificationsListResponse
            // ({current_page, data: [...]}), no AppNotification[] directo — old?.map/.filter
            // tronaba en silencio y la campanita nunca reflejaba "marcado como leído" ni
            // quitaba la fila de la pestaña "no leídas" hasta el siguiente refresh completo.
            queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("all"), (old) =>
                old ? { ...old, data: old.data.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)) } : old
            );
            queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("unread"), (old) =>
                old ? { ...old, data: old.data.filter((n) => n.id !== id) } : old
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
            queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("all"), (old) =>
                old ? { ...old, data: old.data.map((n) => (n.read_at ? n : { ...n, read_at: now })) } : old
            );
            queryClient.setQueryData<NotificationsListResponse>(LIST_KEY("unread"), (old) =>
                old ? { ...old, data: [] } : old
            );
        },
    });
}
