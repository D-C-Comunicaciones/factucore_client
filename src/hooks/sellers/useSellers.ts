import { useQuery } from "@tanstack/react-query";
import { SellersService } from "@/lib/sellers";
import type { ApiResponse } from "@/types/api";

export function useSellersList(options?: { params?: Record<string, any>; enabled?: boolean; fetchKey?: number }) {
    const paramsKey = JSON.stringify(options?.params ?? {});
    const page = options?.params?.current_page ?? 1;
    const perPage = options?.params?.per_page ?? 10;
    const fetchKey = options?.fetchKey ?? 0;
    const enabled = options?.enabled ?? true;

    return useQuery<ApiResponse<any>, Error, any>({
        queryKey: ["sellers", paramsKey, page, perPage, fetchKey],
        queryFn: async () => {
            const res = await SellersService.list(options?.params);
            if (!res) {
                throw new Error("Error al obtener vendedores");
            }
            if (res.status && res.status !== "success") {
                throw new Error(res.message || "Error al obtener vendedores");
            }
            return res;
        },
        select: (res) => res.data,
        enabled: enabled,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}
