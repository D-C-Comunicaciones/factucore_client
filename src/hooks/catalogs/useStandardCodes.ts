import { useQuery } from "@tanstack/react-query";
import { catalogsApi } from "@/lib/catalogs";
import { QUERY_KEYS } from "@/lib/queryKeys";

export interface StandardCodeOption {
    value: string;
    label: string;
}

/**
 * Busca códigos estándar (UNSPSC / Colombia Compra Eficiente) desde GET /catalogs/standard-codes.
 * Los resultados se cachean por término de búsqueda para no repetir la misma petición.
 */
export function useStandardCodes(search: string) {
    const trimmed = search.trim();

    const query = useQuery({
        queryKey: [...QUERY_KEYS.catalogs.standardCodes(), trimmed],
        queryFn: async (): Promise<StandardCodeOption[]> => {
            const res = await catalogsApi.searchStandardCodes(trimmed);
            let data: any = res?.data?.data;
            if (data && !Array.isArray(data) && Array.isArray(data.data)) {
                data = data.data;
            } else if (!Array.isArray(data)) {
                data = res?.data?.standard_codes || [];
            }

            return Array.isArray(data)
                ? data.map((c: any) => ({
                    value: c.id.toString(),
                    label: `${c.code} - ${c.name}`,
                }))
                : [];
        },
        enabled: trimmed.length >= 2,
        staleTime: 5 * 60 * 1000,
        placeholderData: (prev) => prev,
    });

    return {
        options: query.data ?? [],
        isLoading: query.isFetching,
    };
}
