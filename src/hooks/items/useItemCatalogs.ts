import { useQuery } from "@tanstack/react-query";
import { catalogsApi } from "@/lib/catalogs";

export function useItemCatalogs() {
    const warehousesQuery = useQuery({
        queryKey: ["catalogs", "warehouses"],
        queryFn: () => catalogsApi.getWarehouses(),
    });

    const categoriesQuery = useQuery({
        queryKey: ["catalogs", "categories"],
        queryFn: () => catalogsApi.getCategories(),
    });

    const attributesQuery = useQuery({
        queryKey: ["catalogs", "attributes"],
        queryFn: () => catalogsApi.getAttributes(),
    });

    const customFieldsQuery = useQuery({
        queryKey: ["catalogs", "custom-fields", "items"],
        queryFn: () => catalogsApi.getCustomFields("items"),
    });

    const taxRatesQuery = useQuery({
        queryKey: ["catalogs", "tax-rates"],
        queryFn: () => catalogsApi.getTaxRates(),
    });

    const priceListsQuery = useQuery({
        queryKey: ["catalogs", "price-lists"],
        queryFn: () => catalogsApi.getPriceLists(),
        enabled: false, // ⚠️ Endpoint aún no implementado en backend
    });

    const unitMeasuresQuery = useQuery({
        queryKey: ["catalogs", "unit-measures"],
        queryFn: () => catalogsApi.getUnitMeasures(),
    });

    const standardCodesQuery = useQuery({
        queryKey: ["catalogs", "standard-codes"],
        queryFn: () => catalogsApi.getStandardCodes(),
    });

    return {
        warehouses: warehousesQuery.data?.data || [],
        categories: categoriesQuery.data?.data || [],
        attributes: attributesQuery.data?.data || [],
        customFields: customFieldsQuery.data?.data || [],
        taxes: taxRatesQuery.data?.data || [],
        priceLists: priceListsQuery.data?.data || [],
        unitMeasures: unitMeasuresQuery.data?.data || [],
        standardCodes: standardCodesQuery.data?.data || [],
        isLoading:
            warehousesQuery.isLoading ||
            categoriesQuery.isLoading ||
            attributesQuery.isLoading ||
            customFieldsQuery.isLoading ||
            taxRatesQuery.isLoading ||
            unitMeasuresQuery.isLoading ||
            standardCodesQuery.isLoading,
    };
}
