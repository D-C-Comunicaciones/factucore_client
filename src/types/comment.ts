// Tipos habilitados hoy en el backend (Comment::commentableTypeMap()) — ver comments-notifications.md
export type CommentableType = "invoice" | "credit_note" | "quotation" | "remission" | "payment" | "purchase_order" | "contact";

export interface CommentUser {
    id: number;
    name: string;
    email: string;
}

export interface CommentMention extends CommentUser { }

export interface CommentReply {
    id: number;
    user_id: number;
    commentable_type: string;
    commentable_id: number;
    parent_id: number;
    comment: string;
    is_internal: boolean;
    created_at: string;
    user: CommentUser;
    mentions: CommentMention[];
    // Client-only, nunca viene de la API: useCommentsSocket.ts lo marca por 3s tras un
    // comment.deleted en vivo (de OTRO usuario) antes de quitarlo de la lista, para mostrar
    // "este comentario ha sido eliminado por el autor" en vez de que desaparezca de golpe.
    _justDeleted?: boolean;
}

// Comentario de primer nivel: trae sus respuestas ya resueltas en `replies`
// (un solo nivel de anidación — no se puede responder a una respuesta).
export interface Comment {
    id: number;
    user_id: number;
    commentable_type: string;
    commentable_id: number;
    parent_id: null;
    comment: string;
    is_internal: boolean;
    created_at: string;
    user: CommentUser;
    mentions: CommentMention[];
    replies: CommentReply[];
    _justDeleted?: boolean;
}

export interface CommentsListResponse {
    current_page: number;
    data: Comment[];
    per_page: number;
    total: number;
}

export interface CreateCommentPayload {
    type: CommentableType;
    commentable_id: number | string;
    parent_id?: number;
    comment: string;
    is_internal?: boolean;
    mentions?: number[];
}

export interface UpdateCommentPayload {
    comment: string;
    mentions?: number[];
}

export interface MentionableUser {
    id: number;
    name: string;
    email: string;
}
