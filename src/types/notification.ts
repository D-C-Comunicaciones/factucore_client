export interface NotificationData {
    type: "comment_mention" | string;
    comment_id: number;
    commentable_type: string;
    commentable_id: number;
    commentable_label: string;
    excerpt: string;
    mentioned_by: { id: number; name: string };
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
