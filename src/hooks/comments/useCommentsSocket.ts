import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { COMMENTS_KEY } from "./useComments";
import type { CommentableType, Comment, CommentReply, CommentsListResponse } from "@/types/comment";

// App\Events\CommentPosted::broadcastWith() manda los campos envueltos bajo 'comment' — igual
// convención que App\Events\ReminderBroadcastEvent (ver useRemindersSocket.ts, que ya lee
// payload.reminder.*). Antes este archivo leía los campos sueltos en el payload (payload.id,
// payload.user.id...), que nunca existieron ahí — payload.user era undefined y tronaba con un
// TypeError apenas llegaba un comentario nuevo, dejando el evento sin aplicar (silencioso desde
// afuera: el listener no vuelve a intentarlo, así que solo se veía el comentario tras refrescar).
interface LiveCommentPayload {
    comment: {
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
    };
}

// App\Events\CommentDeleted manda un payload minimo (solo id/parent_id) — alcanza para
// quitarlo de la cache sin pedir nada mas al backend.
interface LiveCommentDeletedPayload {
    comment: {
        id: number;
        parent_id: number | null;
    };
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

        // channelName lleva type+commentableId: dos documentos distintos (ej. invoice/2 vs
        // invoice/3, o invoice/2 vs remission/2) nunca comparten canal, así que un evento de
        // uno no puede aparecer en la vista del otro — ver también useRemindersSocket.ts.
        channel.subscribed(() => console.log(`[comments-socket] suscrito: "${channelName}"`));
        channel.error((err: unknown) => console.error(`[comments-socket] error suscribiendo "${channelName}"`, err));

        // El punto antes de "comment.created" es intencional: el evento se manda
        // con broadcastAs(), así que Echo NO debe anteponerle el namespace PHP.
        channel.listen(".comment.created", (payload: LiveCommentPayload) => {
            const incoming = payload.comment;
            console.log(`[comments-socket] comment.created en "${channelName}"`, { id: incoming.id, parent_id: incoming.parent_id });

            queryClient.setQueryData<CommentsListResponse>(COMMENTS_KEY(type, commentableId), (old) => {
                if (!old) return old;

                if (incoming.parent_id == null) {
                    // Comentario raíz nuevo. Se descarta si ya está (por si llega dos
                    // veces, ej. el propio si X-Socket-Id no alcanzó a excluirlo).
                    if (old.data.some((c) => c.id === incoming.id)) return old;
                    const newComment: Comment = {
                        id: incoming.id,
                        user_id: incoming.user.id,
                        commentable_type: incoming.commentable_type,
                        commentable_id: incoming.commentable_id,
                        parent_id: null,
                        comment: incoming.comment,
                        is_internal: incoming.is_internal,
                        created_at: incoming.created_at,
                        user: incoming.user,
                        mentions: incoming.mentions || [],
                        replies: [],
                    };
                    return { ...old, data: [newComment, ...old.data], total: old.total + 1 };
                }

                // Es una respuesta — se inserta bajo su comentario padre, no al final
                // de la lista raíz.
                let foundParent = false;
                const data = old.data.map((c) => {
                    if (c.id !== incoming.parent_id) return c;
                    foundParent = true;
                    if ((c.replies || []).some((r) => r.id === incoming.id)) return c;
                    const newReply: CommentReply = {
                        id: incoming.id,
                        user_id: incoming.user.id,
                        commentable_type: incoming.commentable_type,
                        commentable_id: incoming.commentable_id,
                        parent_id: incoming.parent_id as number,
                        comment: incoming.comment,
                        is_internal: incoming.is_internal,
                        created_at: incoming.created_at,
                        user: incoming.user,
                        mentions: incoming.mentions || [],
                    };
                    return { ...c, replies: [...(c.replies || []), newReply] };
                });
                if (!foundParent) return old;
                return { ...old, data };
            });
        });

        channel.listen(".comment.deleted", (payload: LiveCommentDeletedPayload) => {
            const { id, parent_id } = payload.comment;
            console.log(`[comments-socket] comment.deleted en "${channelName}"`, { id, parent_id });

            queryClient.setQueryData<CommentsListResponse>(COMMENTS_KEY(type, commentableId), (old) => {
                if (!old) return old;

                if (parent_id == null) {
                    // Comentario raíz: se quita de la lista (junto con sus respuestas).
                    if (!old.data.some((c) => c.id === id)) return old;
                    return { ...old, data: old.data.filter((c) => c.id !== id), total: Math.max(0, old.total - 1) };
                }

                // Respuesta: se quita solo del array de replies de su padre.
                const data = old.data.map((c) => {
                    if (c.id !== parent_id || !c.replies) return c;
                    return { ...c, replies: c.replies.filter((r) => r.id !== id) };
                });
                return { ...old, data };
            });
        });

        return () => {
            echo.leave(channelName);
        };
    }, [type, commentableId, queryClient]);
}
