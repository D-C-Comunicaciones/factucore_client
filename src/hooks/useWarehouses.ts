import { useMutation, useQueryClient } from "@tanstack/react-query";
import { warehousesApi } from "@/lib/warehouses";
import { QUERY_KEYS } from "@/lib/queryKeys";

export function useCreateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: warehousesApi.createWarehouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });
        },
    });
}

export function useUpdateWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: any }) => warehousesApi.updateWarehouse(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });
        },
    });
}

export function useDeleteWarehouse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: warehousesApi.deleteWarehouse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });
        },
    });
}

export function useToggleWarehouseStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: warehousesApi.toggleStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.warehouses() });
        },
    });
}
