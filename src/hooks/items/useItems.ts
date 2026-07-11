import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";

export function useItems(options?: { params?: Record<string, any>; fetchKey?: number }) {
    const params = options?.params ?? {};
    const fetchKey = options?.fetchKey ?? 0;

    return useQuery({
        queryKey: ["items", params, fetchKey],
        queryFn: () => itemsApi.getItems(params),
    });
}
