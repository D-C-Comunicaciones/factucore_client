import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BillsService } from "@/lib/bills";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Bill } from "@/types/bill";

export function useBillsList(params?: Record<string, any>) {
    return useQuery({
        queryKey: ["bills", params],
        queryFn: async () => {
            const res = await BillsService.list(params);
            return (res as any)?.data || res;
        },
    });
}

export function useBillDetail(id: number | string | null | undefined) {
    return useQuery({
        queryKey: ["bills", id],
        queryFn: async () => {
            if (!id) return null;
            const res = await BillsService.getById(id);
            return (res as any)?.data?.bill || (res as any)?.data || res;
        },
        enabled: Boolean(id),
    });
}

export function useCreateBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Partial<Bill>) => {
            return BillsService.store(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            showToast("Factura de compra creada correctamente", "success");
        },
        onError: (err: any) => {
            showToast(err?.response?.data?.message || "Error al crear la factura de compra", "error");
        },
    });
}

export function useUpdateBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number | string; data: Partial<Bill> }) => {
            return BillsService.update(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            showToast("Factura de compra actualizada correctamente", "success");
        },
        onError: (err: any) => {
            showToast(err?.response?.data?.message || "Error al actualizar la factura de compra", "error");
        },
    });
}

export function useDeleteBill() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number | string) => {
            return BillsService.delete(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bills"] });
            showToast("Factura de compra eliminada correctamente", "success");
        },
        onError: (err: any) => {
            showToast(err?.response?.data?.message || "Error al eliminar la factura de compra", "error");
        },
    });
}
