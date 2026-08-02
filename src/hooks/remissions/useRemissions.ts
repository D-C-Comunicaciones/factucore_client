import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { RemissionsService } from "@/lib/remissions";

import type {
    Remission,
    RemissionDetailResponse,
    RemissionSummary,
    RemissionListData,
    RemissionFindAllSuccess,
} from "@/types/remission";

import type { ApiResponse } from "@/types/api";

// --- Keys ---
const INVOICES_KEY = ["remissions"] as const;
const INVOICE_KEY = (id: number | string) => ["remission", id] as const;

// =========================
// ðŸ“Œ LIST
// =========================
export function useRemissionsList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {

    const paramsKey = JSON.stringify(options?.params ?? {});
    const page = options?.params?.page ?? options?.params?.current_page ?? 1;
    const perPage = options?.params?.per_page ?? 10;
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<RemissionFindAllSuccess>, Error, RemissionFindAllSuccess>({
        queryKey: ["remissions", paramsKey, page, perPage, fetchKey],

        queryFn: async () => {
            const res = await RemissionsService.list(options?.params);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener remissions");
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
export function usePrefetchRemissionDetail() {
    const queryClient = useQueryClient();

    return (id: number | string) =>
        queryClient.prefetchQuery({
            queryKey: INVOICE_KEY(id),
            queryFn: async () => {
                const res = await RemissionsService.getById(id);

                if (!res || res.status !== "success") {
                    throw new Error(res?.message || "Error al obtener remission");
                }

                return res;
            },
        });
}

// =========================
// ðŸ“Œ DETAIL
// =========================
export function useRemission(id: number | string, enabled = true) {
    return useQuery<RemissionDetailResponse>({
        queryKey: INVOICE_KEY(id),
        queryFn: async () => {
            const res: any = await RemissionsService.getById(id);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener remission");
            }

            // res ya es RemissionDetailResponse porque RemissionsService.getById devuelve apiClient.get(...) que extrae la data de axios
            return res;
        },
        enabled: !!id && enabled,
    });
}

// =========================
// ðŸ“Œ OPTIMISTIC UPDATE HELPERS
// =========================
function optimisticUpdateList(
    queryClient: ReturnType<typeof useQueryClient>,
    updater: (draft: RemissionSummary[]) => RemissionSummary[]
) {
    queryClient.setQueryData<ApiResponse<RemissionListData>>(INVOICES_KEY, (old) => {
        if (!old?.data?.remissions) return old;

        return {
            ...old,
            data: {
                ...old.data,
                remissions: updater(old.data.remissions),
            },
        };
    });
}

// =========================
// ðŸ“Œ CREATE
// =========================
export function useCreateRemission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Remission>) => {
            const res = await RemissionsService.create(data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear remission");
            }

            return res.data;
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<RemissionListData>>(INVOICES_KEY);

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
export function useUpdateRemission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number | string;
            data: Partial<Remission>;
        }) => {
            const res = await RemissionsService.update(id, data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar remission");
            }

            return res.data;
        },

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<RemissionListData>>(INVOICES_KEY);

            queryClient.setQueryData<ApiResponse<RemissionListData>>(INVOICES_KEY, (old) => {
                if (!old?.data?.remissions) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        remissions: old.data.remissions.map((inv) =>
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
export function useSendRemission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await RemissionsService.sendRemission(id);

            if (!res || res.status !== "success") {
                // If there are DIAN errors we can still return res, but maybe the API throws an error
                // In this case, usually we let the component handle it or throw
                if (res?.dian && res.dian.estado_documento === "NO APROBADA") {
                    // Let's attach the response to the error so we can read it
                    const err = new Error(res.dian.mensaje_dian || "La DIAN no aprobÃ³ la remission");
                    (err as any).dian = res.dian;
                    throw err;
                }
                throw new Error(res?.message || "Error al emitir remission");
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

