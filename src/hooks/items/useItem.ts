import { useQuery } from "@tanstack/react-query";

import { itemsApi } from "@/lib/items";

import type {
    ItemListResponse,
} from "@/types/items";

import type {
    PaginatedData,
} from "@/types/api";

interface UseItemsParams {
    search?: string;
    page?: number;
    per_page?: number;
}

export function useItems(
    params?: UseItemsParams
) {
    return useQuery<
        PaginatedData<ItemListResponse>
    >({
        queryKey: ["items", params],

        queryFn: () =>
            itemsApi.getItems(params),
    });
}