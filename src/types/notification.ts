export interface NotificationData {
    type: "comment_mention" | "reminder_assigned" | "reminder_unassigned" | "reminder_updated" | "reminder_deleted" | "reminder_due" | string;

    // Menciones en comentarios (App\Notifications\UserMentionedInComment)
    comment_id?: number;
    commentable_type?: string;
    commentable_id?: number;
    commentable_label?: string;
    excerpt?: string;
    mentioned_by?: { id: number; name: string };

    // Recordatorios (App\Notifications\ReminderNotification) — todas las variantes traen
    // 'message' ya armado en el backend, así que la UI no necesita rearmar el texto por tipo.
    reminder_id?: number;
    title?: string;
    due_at?: string | null;
    remindable_type?: string;
    remindable_id?: number;
    message?: string;

    created_at: string;
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
