import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { catalogsApi } from "@/lib/catalogs";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { Withholding, UpdateWithholdingAccountsPayload } from "@/types/catalogs";

export function useWithholdingsList() {
    return useQuery({
        queryKey: QUERY_KEYS.catalogs.withholdings(),
        queryFn: async () => {
            const res = await catalogsApi.getWithholdings();
            if (!res || res.status !== "success") throw new Error(res?.message || "Error al obtener las retenciones");
            return res.data?.withholdings ?? [];
        },
    });
}

export function useUpdateWithholding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: UpdateWithholdingAccountsPayload }) => {
            const res = await catalogsApi.updateWithholding(id, data);
            if (!res || res.status !== "success") throw new Error(res?.message || "Error al actualizar la retención");
            return res.data?.withholding as Withholding;
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.catalogs.withholdings() }),
    });
}
