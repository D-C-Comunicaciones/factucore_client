import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CommentsService } from "@/lib/comments";
import { showToast } from "@/components/sonner/CustomToaster";
import { extractErrorMessage } from "@/lib/errors";
import type { CommentableType, UpdateCommentPayload } from "@/types/comment";

export const COMMENTS_KEY = (type: CommentableType, commentableId: number | string) =>
    ["comments", type, String(commentableId)] as const;

export function useCommentsList(type: CommentableType, commentableId: number | string | null | undefined) {
    return useQuery({
        queryKey: COMMENTS_KEY(type, commentableId ?? "none"),
        queryFn: () => CommentsService.list(type, commentableId as number | string),
        select: (res) => res.data,
        enabled: !!commentableId,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}

export function useCreateComment(type: CommentableType, commentableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: { comment: string; mentions?: number[]; parent_id?: number }) =>
            CommentsService.create({
                type,
                commentable_id: commentableId,
                comment: payload.comment,
                mentions: payload.mentions,
                is_internal: false,
                ...(payload.parent_id ? { parent_id: payload.parent_id } : {}),
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY(type, commentableId) });
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al publicar el comentario", "error");
        },
    });
}

export function useUpdateComment(type: CommentableType, commentableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateCommentPayload }) =>
            CommentsService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY(type, commentableId) });
            showToast("Comentario editado correctamente", "success", "Éxito");
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al editar el comentario", "error");
        },
    });
}

export function useDeleteComment(type: CommentableType, commentableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => CommentsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: COMMENTS_KEY(type, commentableId) });
            showToast("Comentario eliminado", "success", "Éxito");
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al eliminar el comentario", "error");
        },
    });
}

export function useMentionableUsers(search: string, enabled: boolean) {
    return useQuery({
        queryKey: ["comments", "mentionable-users", search],
        queryFn: () => CommentsService.mentionableUsers(search),
        select: (res) => res.data,
        enabled,
        staleTime: 30_000,
        refetchOnWindowFocus: false,
    });
}
