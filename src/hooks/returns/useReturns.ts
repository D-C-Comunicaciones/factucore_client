import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditNotesService } from "@/lib/creditNotes";
import type { ApiResponse } from "@/types/api";

const CREDIT_NOTES_KEY = ["credit_notes"] as const;
const CREDIT_NOTE_KEY = (id: number | string) => ["credit_note", id] as const;

export function useCreditNotesList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const page = options?.params?.page ?? options?.params?.current_page ?? 1;
    const perPage = options?.params?.per_page ?? 10;
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<any>, Error, any>({
        queryKey: ["credit_notes", paramsKey, page, perPage, fetchKey],
        queryFn: async () => {
            const res = await CreditNotesService.index(options?.params);
            if (res && res.status === "success" && res.data) {
                return res;
            }
            return res;
        },
        select: (res) => res?.data || res,
        enabled: enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}

function extractCreditNote(data: any) {
    return data?.data?.credit_note || data?.credit_note || data?.creditNote;
}

export function useCreditNote(id: number | string, options?: { enabled?: boolean; poll?: boolean }) {
    const enabled = options?.enabled ?? true;
    const poll = options?.poll ?? true;

    return useQuery<any>({
        queryKey: CREDIT_NOTE_KEY(id),
        queryFn: async () => {
            const res: any = await CreditNotesService.show(id);
            if (res?.customMessage && res?.customMessage.includes("no existe")) {
                throw new Error(res.customMessage);
            }
            return res;
        },
        enabled: !!id && enabled,
        // El envío a la DIAN es asíncrono: mientras esté QUEUED/PROCESSING, refrescamos
        // cada 3s para recibir el resultado final en cuanto el backend lo procese.
        refetchInterval: (query) => {
            if (!poll) return false;
            const status = extractCreditNote(query.state.data)?.dian_submission_status;
            return status === "QUEUED" || status === "PROCESSING" ? 3000 : false;
        },
    });
}

export function useSendCreditNote() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            const res: any = await CreditNotesService.send({ id });
            return res;
        },
        onSuccess: (_data, id) => {
            queryClient.invalidateQueries({ queryKey: CREDIT_NOTE_KEY(id) });
        },
    });
}
