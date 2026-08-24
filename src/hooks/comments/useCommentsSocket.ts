import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { COMMENTS_KEY } from "./useComments";
import type { CommentableType, Comment, CommentReply, CommentsListResponse } from "@/types/comment";

interface LiveCommentPayload {
    id: number;
    parent_id: number | null;
    comment: string;
    is_internal: boolean;
    commentable_type: string;
    commentable_id: number;
    created_at: string;
    updated_at: string;
    user: { id: number; name: string; email: string };
    mentions: { id: number; name: string; email: string }[];
}

// Suscripción al canal en vivo de un documento (ver comentarios_tiempo_real.md):
// cualquiera con la pantalla de detalle abierta ve los comentarios/respuestas
// nuevos aparecer al instante, sin recargar ni volver a pedir la lista.
export function useCommentsSocket(type: CommentableType, commentableId: number | string | null | undefined) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!commentableId) return;

        const session = getSession() as any;
        const tenantId = session?.tenant_id;
        if (!tenantId) return;

        const echo = getEcho();
        if (!echo) return;

        const channelName = `tenant.${tenantId}.comments.${type}.${commentableId}`;
        const channel = echo.private(channelName);

        // El punto antes de "comment.created" es intencional: el evento se manda
        // con broadcastAs(), así que Echo NO debe anteponerle el namespace PHP.
        channel.listen(".comment.created", (payload: LiveCommentPayload) => {
            queryClient.setQueryData<CommentsListResponse>(COMMENTS_KEY(type, commentableId), (old) => {
                if (!old) return old;

                if (payload.parent_id == null) {
                    // Comentario raíz nuevo. Se descarta si ya está (por si llega dos
                    // veces, ej. el propio si X-Socket-Id no alcanzó a excluirlo).
                    if (old.data.some((c) => c.id === payload.id)) return old;
                    const newComment: Comment = {
                        id: payload.id,
                        user_id: payload.user.id,
                        commentable_type: payload.commentable_type,
                        commentable_id: payload.commentable_id,
                        parent_id: null,
                        comment: payload.comment,
                        is_internal: payload.is_internal,
                        created_at: payload.created_at,
                        user: payload.user,
                        mentions: payload.mentions || [],
                        replies: [],
                    };
                    return { ...old, data: [newComment, ...old.data], total: old.total + 1 };
                }

                // Es una respuesta — se inserta bajo su comentario padre, no al final
                // de la lista raíz.
                let foundParent = false;
                const data = old.data.map((c) => {
                    if (c.id !== payload.parent_id) return c;
                    foundParent = true;
                    if ((c.replies || []).some((r) => r.id === payload.id)) return c;
                    const newReply: CommentReply = {
                        id: payload.id,
                        user_id: payload.user.id,
                        commentable_type: payload.commentable_type,
                        commentable_id: payload.commentable_id,
                        parent_id: payload.parent_id as number,
                        comment: payload.comment,
                        is_internal: payload.is_internal,
                        created_at: payload.created_at,
                        user: payload.user,
                        mentions: payload.mentions || [],
                    };
                    return { ...c, replies: [...(c.replies || []), newReply] };
                });
                if (!foundParent) return old;
                return { ...old, data };
            });
        });

        return () => {
            echo.leave(channelName);
        };
    }, [type, commentableId, queryClient]);
}
