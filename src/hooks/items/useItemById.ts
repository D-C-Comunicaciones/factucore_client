import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";
import { QUERY_KEYS } from "@/lib/queryKeys";
import type { ItemResponse } from "@/types/items";

export function useItemById(id: number | string) {
    return useQuery<ItemResponse>({
        queryKey: QUERY_KEYS.items.detail(id),
        queryFn: async () => {
            const response = await itemsApi.getItemById(id);
            return response.data.item;
        },
        enabled: !!id,
    });
}