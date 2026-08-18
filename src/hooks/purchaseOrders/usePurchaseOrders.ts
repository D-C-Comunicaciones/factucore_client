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
        queryFn: () => PurchaseOrdersService.list(options?.params),
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
        queryFn: () => PurchaseOrdersService.getById(id),
        enabled: !!id && enabled,
    });
}

// =========================
// CREATE
// =========================
export function useCreatePurchaseOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<PurchaseOrder>) => PurchaseOrdersService.create(data),

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
        mutationFn: ({ id, data }: { id: number | string; data: Partial<PurchaseOrder> }) =>
            PurchaseOrdersService.update(id, data),

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
        mutationFn: (id: number | string) => PurchaseOrdersService.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PURCHASE_ORDERS_KEY });
        },
    });
}
