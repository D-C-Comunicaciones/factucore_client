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
const REMISSIONS_KEY = ["remissions"] as const;
const REMISSION_KEY = (id: number | string) => ["remission", id] as const;

// =========================
// 📌 LIST
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
                throw new Error(res?.message || "Error al obtener remisiones");
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
// 📌 PREFETCH DETAIL
// =========================
export function usePrefetchRemissionDetail() {
    const queryClient = useQueryClient();

    return (id: number | string) =>
        queryClient.prefetchQuery({
            queryKey: REMISSION_KEY(id),
            queryFn: async () => {
                const res = await RemissionsService.getById(id);

                if (!res || res.status !== "success") {
                    throw new Error(res?.message || "Error al obtener remisión");
                }

                return res;
            },
        });
}

// =========================
// 📌 DETAIL
// =========================
export function useRemission(id: number | string, enabled = true) {
    return useQuery<RemissionDetailResponse>({
        queryKey: REMISSION_KEY(id),
        queryFn: async () => {
            const res: any = await RemissionsService.getById(id);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener remisión");
            }

            // res ya es RemissionDetailResponse porque RemissionsService.getById devuelve apiClient.get(...) que extrae la data de axios
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
// 📌 CREATE
// =========================
export function useCreateRemission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Remission>) => {
            const res = await RemissionsService.create(data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear remisión");
            }

            return res.data;
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: REMISSIONS_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<RemissionListData>>(REMISSIONS_KEY);

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(REMISSIONS_KEY, context.previous);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: REMISSIONS_KEY });
        },
    });
}

// =========================
// 📌 UPDATE
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
                throw new Error(res?.message || "Error al actualizar remisión");
            }

            return res.data;
        },

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: REMISSIONS_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<RemissionListData>>(REMISSIONS_KEY);

            queryClient.setQueryData<ApiResponse<RemissionListData>>(REMISSIONS_KEY, (old) => {
                if (!old?.data?.remissions) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        remissions: old.data.remissions.map((rem) =>
                            rem.id === id ? { ...rem, ...data } : rem
                        ),
                    },
                };
            });

            return { previous };
        },

        onError: (_err, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(REMISSIONS_KEY, context.previous);
            }
        },

        onSettled: (_data, _error, vars) => {
            queryClient.invalidateQueries({ queryKey: REMISSIONS_KEY });

            if (vars?.id) {
                queryClient.invalidateQueries({
                    queryKey: REMISSION_KEY(vars.id),
                });
            }
        },
    });
}

// =========================
// 📌 DELETE
// =========================
export function useDeleteRemission() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => {
            const res = await RemissionsService.delete(id);
            return res;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: REMISSIONS_KEY });
        },
    });
}
