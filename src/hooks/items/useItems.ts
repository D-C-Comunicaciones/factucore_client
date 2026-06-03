import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";

export function useItems(params: Record<string, any> = {}) {
    return useQuery({
        queryKey: ["items", params],
        queryFn: () => itemsApi.getItems(params),
    });
}
