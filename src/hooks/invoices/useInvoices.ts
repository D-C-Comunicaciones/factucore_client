import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InvoicesService } from "@/lib/invoices";

import type {
    Invoice,
    InvoiceDetailResponse,
    InvoiceSummary,
    InvoiceListData,
    InvoiceFindAllSuccess,
} from "@/types/invoice";

import type { ApiResponse } from "@/types/api";

// --- Keys ---
const INVOICES_KEY = ["invoices"] as const;
const INVOICE_KEY = (id: number | string) => ["invoice", id] as const;

// =========================
// 📌 LIST
// =========================
export function useInvoicesList(options?: { params?: Record<string, any>; enabled?: boolean }) {

    const paramsKey = JSON.stringify(options?.params ?? {});
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<InvoiceFindAllSuccess>, Error, InvoiceFindAllSuccess>({
        queryKey: ["invoices", paramsKey],

        queryFn: async () => {
            const res = await InvoicesService.list(options?.params);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener facturas");
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
export function usePrefetchInvoiceDetail() {
    const queryClient = useQueryClient();

    return (id: number | string) =>
        queryClient.prefetchQuery({
            queryKey: INVOICE_KEY(id),
            queryFn: async () => {
                const res = await InvoicesService.getById(id);

                if (!res || res.status !== "success") {
                    throw new Error(res?.message || "Error al obtener factura");
                }

                return res.data;
            },
        });
}

// =========================
// 📌 DETAIL
// =========================
export function useInvoice(id: number | string, enabled = true) {
    return useQuery<InvoiceDetailResponse>({
        queryKey: INVOICE_KEY(id),
        queryFn: async () => {
            const res = await InvoicesService.getById(id);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener factura");
            }

            return res.data;
        },
        enabled: !!id && enabled,
    });
}

// =========================
// 📌 OPTIMISTIC UPDATE HELPERS
// =========================
function optimisticUpdateList(
    queryClient: ReturnType<typeof useQueryClient>,
    updater: (draft: InvoiceSummary[]) => InvoiceSummary[]
) {
    queryClient.setQueryData<ApiResponse<InvoiceListData>>(INVOICES_KEY, (old) => {
        if (!old?.data?.invoices) return old;

        return {
            ...old,
            data: {
                ...old.data,
                invoices: updater(old.data.invoices),
            },
        };
    });
}

// =========================
// 📌 CREATE
// =========================
export function useCreateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<Invoice>) => {
            const res = await InvoicesService.create(data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear factura");
            }

            return res.data;
        },

        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<InvoiceListData>>(INVOICES_KEY);

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
// 📌 UPDATE
// =========================
export function useUpdateInvoice() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number | string;
            data: Partial<Invoice>;
        }) => {
            const res = await InvoicesService.update(id, data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar factura");
            }

            return res.data;
        },

        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: INVOICES_KEY });

            const previous =
                queryClient.getQueryData<ApiResponse<InvoiceListData>>(INVOICES_KEY);

            queryClient.setQueryData<ApiResponse<InvoiceListData>>(INVOICES_KEY, (old) => {
                if (!old?.data?.invoices) return old;

                return {
                    ...old,
                    data: {
                        ...old.data,
                        invoices: old.data.invoices.map((inv) =>
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
