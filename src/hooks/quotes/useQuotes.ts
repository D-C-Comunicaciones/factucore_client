import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QuotesService } from "@/lib/quotes";

import type {
    Quote,
    QuoteDetailResponse,
    QuoteSummary,
    QuoteListData,
    QuoteFindAllSuccess,
} from "@/types/quote";

import type { ApiResponse } from "@/types/api";

// --- Keys ---
const INVOICES_KEY = ["quotes"] as const;
const INVOICE_KEY = (id: number | string) => ["quote", id] as const;

// =========================
// ðŸ“Œ LIST
// =========================
export function useQuotesList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {

    const paramsKey = JSON.stringify(options?.params ?? {});
    const page = options?.params?.page ?? options?.params?.current_page ?? 1;
    const perPage = options?.params?.per_page ?? 10;
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<QuoteFindAllSuccess>, Error, QuoteFindAllSuccess>({
        queryKey: ["quotes", paramsKey, page, perPage, fetchKey],

        queryFn: async () => {
            const res = await QuotesService.list(options?.params);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener quotes");
            }

            return res;
        },

        select: (res) => res.data,

        enabled: enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}
// =========================
// ðŸ“Œ PREFETCH DETAIL
// =========================
export function usePrefetchQuoteDetail() {
    const queryClient = useQueryClient();

    return (id: number | string) =>
        queryClient.prefetchQuery({
            queryKey: INVOICE_KEY(id),
            queryFn: async () => {
                const res = await QuotesService.getById(id);

                if (!res || res.status !== "success") {
                    throw new Error(res?.message || "Error al obtener quote");
                }

                return res;
            },
        });
}

// =========================
// ðŸ“Œ DETAIL
// =========================
export function useQuote(id: number | string, enabled = true) {
    return useQuery<QuoteDetailResponse>({
        queryKey: INVOICE_KEY(id),
        queryFn: async () => {
            const res: any = await QuotesService.getById(id);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener quote");
            }

            // res ya es QuoteDetailResponse porque QuotesService.getById devuelve apiClient.get(...) que extrae la data de axios
            return res;
        },
        enabled: !!id && enabled,
        // Reutiliza los datos ya cargados en la vista detalle (misma queryKey) al navegar a
        // editar/clonar/convertir, evitando un GET redundante. Las mutaciones (update) invalidan
        // este cache explícitamente, así que la ventana de "frescura" es segura.
        staleTime: 60 * 1000,
    });
}

// =========================
// ðŸ“Œ OPTIMISTIC UPDATE HELPERS
// =========================
function optimisticUpdateList(
    queryClient: ReturnType<typeof useQueryClient>,
    updater: (draft: QuoteSummary[]) => QuoteSummary[]
) {
    queryClient.setQueryData<ApiResponse<QuoteListData>>(INVOICES_KEY, (old) => {
        if (!old?.data?.quotes) return old;

        return {
            ...old,
            data: {
                ...old.data,
                quotes: updater(old.data.quotes),
            },
        };
    });
}

// =========================
// ðŸ“Œ CREATE
// =========================
export function useCreateQuote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Quote>) => {
            const res = await QuotesService.create(data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear quote");
            }

            return res.data;
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<QuoteListData>>(INVOICES_KEY);

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(INVOICES_KEY, context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
        },
    });
}

// =========================
// ðŸ“Œ UPDATE
// =========================
export function useUpdateQuote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number | string;
            data: Partial<Quote>;
        }) => {
            const res = await QuotesService.update(id, data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar quote");
            }

            return res.data;
        },

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<QuoteListData>>(INVOICES_KEY);

            queryClient.setQueryData<ApiResponse<QuoteListData>>(INVOICES_KEY, (old) => {
                if (!old?.data?.quotes) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        quotes: old.data.quotes.map((inv) =>
                            inv.id === id ? { ...inv, ...data } : inv
                        ),
                    },
                };
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(INVOICES_KEY, context.previous);
            }
        },

        onSettled: (_data, _error, vars) => {
            queryClient.invalidateQueries({ queryKey: INVOICES_KEY });

            if (vars?.id) {
                queryClient.invalidateQueries({
                    queryKey: INVOICE_KEY(vars.id),
                });
            }
        },
    });
}

// =========================
// ðŸ“Œ SEND TO DIAN
// =========================
export function useSendQuote() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res: any = await QuotesService.sendQuote(id);

            if (!res || res.status !== "success") {
                // If there are DIAN errors we can still return res, but maybe the API throws an error
                // In this case, usually we let the component handle it or throw
                if (res?.dian && res.dian.estado_documento === "NO APROBADA") {
                    // Let's attach the response to the error so we can read it
                    const err = new Error(res.dian.mensaje_dian || "La DIAN no aprobÃ³ la quote");
                    (err as any).dian = res.dian;
                    throw err;
                }
                throw new Error(res?.message || "Error al emitir quote");
            }

            return res;
        },
        onSettled: (_data, _error, id) => {
            queryClient.invalidateQueries({ queryKey: INVOICES_KEY });
            if (id) {
                queryClient.invalidateQueries({ queryKey: INVOICE_KEY(id) });
            }
        },
    });
}

