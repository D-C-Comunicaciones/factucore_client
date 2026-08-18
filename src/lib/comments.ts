import { apiClient } from "@/lib/api-client";
import type {
    CommentableType,
    CommentsListResponse,
    Comment,
    CreateCommentPayload,
    UpdateCommentPayload,
    MentionableUser,
} from "@/types/comment";

// comments-notifications.md documenta estos endpoints devolviendo la data
// "cruda" (paginación estándar de Laravel, o el recurso mismo) sin el
// envelope {status,code,message,data} que usa el resto de la API — pero en
// la práctica el backend a veces sí envuelve. Normalizamos ambos casos acá
// para no depender de cuál termine siendo el contrato real.

function unwrapPaginated(raw: any): CommentsListResponse {
    // El array de comentarios puede venir como body.data o body.comments (Laravel
    // paginator con appends), y el body puede ser `raw` directo o `raw.data` si
    // viene envuelto en el envelope estándar {status,...,data:{...}}.
    for (const body of [raw, raw?.data]) {
        if (!body) continue;
        const list = Array.isArray(body.data) ? body.data
            : Array.isArray(body.comments) ? body.comments
                : null;
        if (list) {
            return {
                current_page: body.current_page ?? 1,
                data: list,
                per_page: body.per_page ?? 20,
                total: body.total ?? list.length,
            };
        }
    }
    return { current_page: 1, data: [], per_page: 20, total: 0 };
}

function unwrapArray<T>(raw: any): T[] {
    // El array puede venir como body, body.data o body.users (envuelto en el
    // envelope estándar {status,...,data:{users:[...]}}).
    for (const body of [raw, raw?.data]) {
        if (!body) continue;
        if (Array.isArray(body)) return body;
        if (Array.isArray(body.data)) return body.data;
        if (Array.isArray(body.users)) return body.users;
    }
    return [];
}

function unwrapComment(raw: any): Comment {
    if (raw?.id != null) return raw as Comment;
    if (raw?.data?.id != null) return raw.data as Comment;
    return raw;
}

export class CommentsService {
    /**
     * GET /comments?type=...&commentable_id=...&per_page=20
     */
    static async list(
        type: CommentableType,
        commentableId: number | string,
        params?: Record<string, any>
    ): Promise<CommentsListResponse> {
        const qs = new URLSearchParams({
            type,
            commentable_id: String(commentableId),
            ...(params || {}),
        }).toString();
        const raw = await apiClient.get(`/comments?${qs}`);
        return unwrapPaginated(raw);
    }

    /**
     * POST /comments — comentario nuevo, o respuesta si viene `parent_id`.
     */
    static async create(payload: CreateCommentPayload): Promise<Comment> {
        const raw = await apiClient.post("/comments", payload);
        return unwrapComment(raw);
    }

    /**
     * PUT /comments/{id} — solo el autor puede editar.
     */
    static async update(id: number, payload: UpdateCommentPayload): Promise<Comment> {
        const raw = await apiClient.put(`/comments/${id}`, payload);
        return unwrapComment(raw);
    }

    /**
     * DELETE /comments/{id} — borrado lógico (deja de listarse).
     */
    static async remove(id: number): Promise<void> {
        await apiClient.delete(`/comments/${id}`);
    }

    /**
     * GET /comments/mentionable-users?search=...
     */
    static async mentionableUsers(search?: string): Promise<{ data: MentionableUser[] }> {
        const raw = await apiClient.get(
            `/comments/mentionable-users${search ? `?search=${encodeURIComponent(search)}` : ""}`
        );
        return { data: unwrapArray<MentionableUser>(raw) };
    }
}
