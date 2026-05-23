import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/lib/items";

export function useItem(id: number | string | undefined) {
    return useQuery({
        queryKey: ["items", id],
        queryFn: () => itemsApi.getItemById(id!),
        enabled: !!id,
    });
}
