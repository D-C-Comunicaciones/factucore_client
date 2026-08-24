"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, AtSign, CalendarClock, CheckCheck } from "lucide-react";
import {
    useNotificationsSocket,
    useUnreadNotificationsCount,
    useNotificationsList,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
} from "@/hooks/notifications/useNotifications";
import { DOCUMENT_ROUTES } from "@/lib/notifications";
import type { AppNotification } from "@/types/notification";

// El backend manda fechas como "DD/MM/YYYY HH:mm" (no ISO) — new Date() nativo
// las interpreta como MM/DD y devuelve "Invalid Date" (de ahí el "Hace NaN d").
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

function timeAgo(dateStr: string): string {
    const parsed = parseApiDate(dateStr);
    if (!parsed) return "";
    const diffMs = Date.now() - parsed.getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "Ahora";
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
}

export function NotificationBell() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useNotificationsSocket();
    const { data: unreadData } = useUnreadNotificationsCount();
    const { data: notifications, isLoading } = useNotificationsList("all", open);
    const markAsRead = useMarkNotificationRead();
    const markAllAsRead = useMarkAllNotificationsRead();

    const unreadCount = unreadData?.count ?? 0;

    useEffect(() => {
        if (!open) return;
        const handleClickOutside = () => setOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [open]);

    const handleNotificationClick = (notification: AppNotification) => {
        if (!notification.read_at) {
            markAsRead.mutate(notification.id);
        }
        const data = notification.data;
        const [type, id] = data.type === "comment_mention"
            ? [data.commentable_type, data.commentable_id]
            : [data.remindable_type, data.remindable_id];
        const basePath = DOCUMENT_ROUTES[type];
        if (basePath) {
            router.push(`${basePath}/${id}`);
        }
        setOpen(false);
    };

    return (
        <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="relative p-1 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
            >
                <Bell className="w-4 h-4 text-gray-700" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute top-full right-0 mt-2 w-[360px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900">Notificaciones</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead.mutate()}
                                className="flex items-center gap-1 text-[12px] text-primary hover:underline"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Marcar todo como leído
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-6 text-center text-sm text-gray-400">Cargando...</div>
                        ) : !notifications || notifications.length === 0 ? (
                            <div className="p-6 text-center text-sm text-gray-400">No tienes notificaciones</div>
                        ) : (
                            notifications.map((notification) => {
                                const data = notification.data;
                                const isReminder = data.type !== "comment_mention";

                                return (
                                    <button
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 ${!notification.read_at ? "bg-primary/5" : ""
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                            {isReminder ? (
                                                <CalendarClock className="w-4 h-4 text-primary" />
                                            ) : (
                                                <AtSign className="w-4 h-4 text-primary" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            {isReminder ? (
                                                <p className="text-[13px] text-gray-900 leading-snug">{data.message}</p>
                                            ) : (
                                                <>
                                                    <p className="text-[13px] text-gray-900 leading-snug">
                                                        <span className="font-semibold">{data.mentioned_by?.name}</span>{" "}
                                                        te mencionó en{" "}
                                                        <span className="font-medium">{data.commentable_label}</span>
                                                    </p>
                                                    {data.excerpt && (
                                                        <p
                                                            className="text-[12px] text-gray-500 truncate mt-0.5 [&_*]:inline [&_*]:m-0"
                                                            dangerouslySetInnerHTML={{ __html: data.excerpt }}
                                                        />
                                                    )}
                                                </>
                                            )}
                                            <p className="text-[11px] text-gray-400 mt-1">{timeAgo(notification.created_at)}</p>
                                        </div>
                                        {!notification.read_at && (
                                            <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
