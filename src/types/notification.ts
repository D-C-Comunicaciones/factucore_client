export interface MentionNotificationData {
    type: "comment_mention";
    comment_id: number;
    commentable_type: string;
    commentable_id: number;
    commentable_label: string;
    excerpt: string;
    mentioned_by: { id: number; name: string };
    created_at: string;
}

// Ver recordatorios.md §3 — "type" indica cuál de las 5 variantes es, "message"
// ya viene armado en español desde el backend, listo para mostrar tal cual.
// 'reminder_updated': se edita título/fecha sin reasignar (ver App\Notifications\ReminderNotification::UPDATED).
export interface ReminderNotificationData {
    type: "reminder_assigned" | "reminder_unassigned" | "reminder_updated" | "reminder_deleted" | "reminder_due";
    reminder_id: number;
    title: string;
    due_at: string | null;
    remindable_type: string;
    remindable_id: number;
    message: string;
}

export type NotificationData = MentionNotificationData | ReminderNotificationData;

export function isReminderNotification(data: NotificationData): data is ReminderNotificationData {
    return data.type.startsWith("reminder_");
}

export interface AppNotification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

export interface NotificationsListResponse {
    current_page: number;
    data: AppNotification[];
}
