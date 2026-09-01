import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdjustmentNotesService } from "@/lib/adjustmentNotes";
import type {
    AdjustmentNotePayload,
    AdjustmentNoteFindAllSuccess,
    AdjustmentNoteDetailData,
} from "@/types/adjustmentNote";
import type { ApiResponse } from "@/types/api";

const ADJUSTMENT_NOTES_KEY = ["adjustment-notes"] as const;
const ADJUSTMENT_NOTE_KEY = (id: number | string) => ["adjustment-note", id] as const;

export function useAdjustmentNotesList(options?: {
    params?: Record<string, any>;
    enabled?: boolean;
    fetchKey?: number;
}) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const fetchKey = options?.fetchKey ?? 0;

    return useQuery<ApiResponse<AdjustmentNoteFindAllSuccess>, Error, AdjustmentNoteFindAllSuccess>({
        queryKey: [...ADJUSTMENT_NOTES_KEY, paramsKey, fetchKey],
        queryFn: async () => {
            const res = await AdjustmentNotesService.list(options?.params);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener notas de ajuste");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: options?.enabled ?? true,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });
}

export function useAdjustmentNote(id: number | string, options?: { enabled?: boolean }) {
    return useQuery<ApiResponse<AdjustmentNoteDetailData>, Error, AdjustmentNoteDetailData>({
        queryKey: ADJUSTMENT_NOTE_KEY(id),
        queryFn: async () => {
            const res = await AdjustmentNotesService.getById(id);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener la nota de ajuste");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: Boolean(id) && (options?.enabled ?? true),
        refetchOnMount: true,
    });
}

export function useCreateAdjustmentNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AdjustmentNotePayload) => {
            const res = await AdjustmentNotesService.store(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear la nota de ajuste");
            }
            return res.data.adjustment_note;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ADJUSTMENT_NOTES_KEY });
            queryClient.invalidateQueries({ queryKey: ["support-documents"] });
        },
    });
}

export function useSendTestAdjustmentNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: AdjustmentNotePayload) => {
            const res: any = await AdjustmentNotesService.sendTest(data);
            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al enviar la nota de ajuste a la DIAN");
            }
            return { ...res.data, message: res.message } as import("@/types/adjustmentNote").AdjustmentNoteSendTestResult;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ADJUSTMENT_NOTES_KEY });
            queryClient.invalidateQueries({ queryKey: ["support-documents"] });
        },
    });
}
