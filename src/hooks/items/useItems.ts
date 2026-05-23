import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";

export function useItems(params: Record<string, any> = {}) {
    const { search, page, per_page } = params;
    return useQuery({
        queryKey: ["items", { search, page, per_page }],
        queryFn: () => itemsApi.getItems(params),
    });
}
