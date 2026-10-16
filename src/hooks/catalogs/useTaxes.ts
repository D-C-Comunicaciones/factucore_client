import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogsApi } from "@/lib/catalogs";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Tax, UpdateTaxAccountsPayload } from "@/types/catalogs";

export function useTaxesList() {
    return useQuery({
        queryKey: QUERY_KEYS.catalogs.taxes(),
        queryFn: async () => {
            const res = await catalogsApi.getTaxes();
            if (!res || res.status !== "success") throw new Error(res?.message || "Error al obtener los impuestos");
            return res.data?.taxes ?? [];
        },
    });
}

export function useUpdateTax() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateTaxAccountsPayload }) => {
            const res = await catalogsApi.updateTax(id, data);
            if (!res || res.status !== "success") throw new Error(res?.message || "Error al actualizar el impuesto");
            return res.data?.tax as Tax;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.taxes() }),
    });
}
