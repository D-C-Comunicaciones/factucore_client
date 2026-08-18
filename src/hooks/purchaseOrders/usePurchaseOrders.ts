import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PurchaseOrdersService } from "@/lib/purchaseOrders";
import type { PurchaseOrder } from "@/types/purchaseOrder";

const PURCHASE_ORDERS_KEY = ["purchase-orders"] as const;
const PURCHASE_ORDER_KEY = (id: number | string) => ["purchase-order", id] as const;

// =========================
// LIST
// =========================
export function usePurchaseOrdersList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery({
        queryKey: [...PURCHASE_ORDERS_KEY, "list", paramsKey, fetchKey],

        queryFn: async () => {
            const res = await PurchaseOrdersService.list(options?.params);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener órdenes de compra");
            }

            return res;
        },

        select: (res: any) => res.data,

        enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });
}

// =========================
// DETAIL
// =========================
export function usePurchaseOrder(id: number | string, enabled = true) {
    return useQuery({
        queryKey: PURCHASE_ORDER_KEY(id),
        queryFn: async () => {
            const res: any = await PurchaseOrdersService.getById(id);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al obtener la orden de compra");
            }

            return res;
        },
        enabled: !!id && enabled,
    });
}

// =========================
// CREATE
// =========================
export function useCreatePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<PurchaseOrder>) => {
            const res = await PurchaseOrdersService.create(data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al crear la orden de compra");
            }

            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY });
        },
    });
}

// =========================
// UPDATE
// =========================
export function useUpdatePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: Partial<PurchaseOrder> }) => {
            const res = await PurchaseOrdersService.update(id, data);

            if (!res || res.status !== "success") {
                throw new Error(res?.message || "Error al actualizar la orden de compra");
            }

            return res.data;
        },

        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY });
            queryClient.invalidateQueries({ queryKey: PURCHASE_ORDER_KEY(vars.id) });
        },
    });
}

// =========================
// DELETE
// =========================
export function useDeletePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number | string) => PurchaseOrdersService.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY });
        },
    });
}
