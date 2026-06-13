import { catalogsApi } from "@/lib/catalogs";
import { QUERY_KEYS } from "@/lib/queryKeys";

import {
    useQuery,
    QueryClient,
} from "@tanstack/react-query";

/* ========================================================================== */
/* PREFETCH                                                                   */
/* ========================================================================== */

export const prefetchAllCatalogs = async (
    queryClient: QueryClient
) => {
    await Promise.all([
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.warehouses(),
            queryFn: catalogsApi.getWarehouses,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.categories(),
            queryFn: catalogsApi.getCategories,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.attributes(),
            queryFn: catalogsApi.getAttributes,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.typeCustomFields(),
            queryFn: catalogsApi.getTypeCustomFields,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.customFields(),
            queryFn: catalogsApi.getCustomFields,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.taxRates(),
            queryFn: catalogsApi.getTaxRates,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.taxes(),
            queryFn: catalogsApi.getTaxes,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.priceLists(),
            queryFn: catalogsApi.getPriceLists,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.typePriceLists(),
            queryFn: catalogsApi.getTypePriceLists,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.unitMeasures(),
            queryFn: catalogsApi.getUnitMeasures,
        }),


        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.salesAccounts(),
            queryFn: catalogsApi.getSalesAccounts,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.inventoryAccounts(),
            queryFn: catalogsApi.getInventoryAccounts,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.costAccounts(),
            queryFn: catalogsApi.getCostAccounts,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.paymentForms(),
            queryFn: catalogsApi.getPaymentForms,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.paymentMethods(),
            queryFn: catalogsApi.getPaymentMethods,
        }),
    ]);
};

/* ========================================================================== */
/* INVALIDATE                                                                 */
/* ========================================================================== */

export const invalidateCatalog = (
    queryClient: QueryClient,
    key: readonly unknown[]
) => {
    queryClient.invalidateQueries({
        queryKey: key,
    });
};

/* ========================================================================== */
/* HOOK                                                                       */
/* ========================================================================== */

export function useCatalogs() {
    /* ====================================================================== */
    /* QUERIES                                                                */
    /* ====================================================================== */

    const warehousesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.warehouses(),
        queryFn: catalogsApi.getWarehouses,
    });

    const categoriesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.categories(),
        queryFn: catalogsApi.getCategories,
    });

    const attributesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.attributes(),
        queryFn: catalogsApi.getAttributes,
    });

    const typeCustomFieldsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.typeCustomFields(),
        queryFn: catalogsApi.getTypeCustomFields,
    });

    const customFieldsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.customFields(),
        queryFn: catalogsApi.getCustomFields,
    });

    const taxRatesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.taxRates(),
        queryFn: catalogsApi.getTaxRates,
    });

    const taxesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.taxes(),
        queryFn: catalogsApi.getTaxes,
    });

    const priceListsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.priceLists(),
        queryFn: catalogsApi.getPriceLists,
    });

    const typePriceListsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.typePriceLists(),
        queryFn: catalogsApi.getTypePriceLists,
    });

    const unitMeasuresQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.unitMeasures(),
        queryFn: catalogsApi.getUnitMeasures,
    });


    const salesAccountsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.salesAccounts(),
        queryFn: catalogsApi.getSalesAccounts,
    });

    const inventoryAccountsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.inventoryAccounts(),
        queryFn: catalogsApi.getInventoryAccounts,
    });

    const costAccountsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.costAccounts(),
        queryFn: catalogsApi.getCostAccounts,
    });

    const paymentFormsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.paymentForms(),
        queryFn: catalogsApi.getPaymentForms,
    });

    const paymentMethodsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.paymentMethods(),
        queryFn: catalogsApi.getPaymentMethods,
    });

    /* ====================================================================== */
    /* HELPERS                                                                */
    /* ====================================================================== */

    const extractArray = <T = any>(
        data: any,
        ...keys: string[]
    ): T[] => {
        if (!data) return [];

        if (Array.isArray(data)) {
            return data as T[];
        }

        for (const key of keys) {
            if (Array.isArray(data[key])) {
                return data[key] as T[];
            }
        }

        return [];
    };

    /* ====================================================================== */
    /* RETURN                                                                 */
    /* ====================================================================== */

    return {
        warehouses: extractArray(
            warehousesQuery.data?.data,
            "warehouses"
        ),

        categories: extractArray(
            categoriesQuery.data?.data,
            "categories",
            "items"
        ),

        attributes: extractArray(
            attributesQuery.data?.data,
            "attributes"
        ),

        typeCustomFields: extractArray(
            typeCustomFieldsQuery.data?.data,
            "type_custom_fields",
            "typeCustomFields"
        ),

        customFields: extractArray(
            customFieldsQuery.data?.data,
            "custom_fields",
            "customFields"
        ),

        taxes: extractArray(
            taxRatesQuery.data?.data,
            "tax_rates",
            "taxRates"
        ),

        taxTypes: extractArray(
            taxesQuery.data?.data,
            "taxes",
            "taxTypes"
        ),

        priceLists: extractArray(
            priceListsQuery.data?.data,
            "price_lists",
            "priceLists"
        ),

        typePriceLists: extractArray(
            typePriceListsQuery.data?.data,
            "type_price_lists",
            "typePriceLists",
            "data"
        ),

        unitMeasures: extractArray(
            unitMeasuresQuery.data?.data,
            "unit_measures",
            "unitMeasures"
        ),


        salesAccounts: extractArray(
            salesAccountsQuery.data?.data,
            "accounts",
            "sales_accounts",
            "salesAccounts",
            "data"
        ),

        inventoryAccounts: extractArray(
            inventoryAccountsQuery.data?.data,
            "accounts",
            "inventory_accounts",
            "inventoryAccounts",
            "data"
        ),

        costAccounts: extractArray(
            costAccountsQuery.data?.data,
            "accounts",
            "cost_accounts",
            "costAccounts",
            "data"
        ),

        paymentForms: extractArray(
            paymentFormsQuery.data?.data,
            "payment_forms",
            "paymentForms",
            "data"
        ),

        paymentMethods: extractArray(
            paymentMethodsQuery.data?.data,
            "payment_methods",
            "paymentMethods",
            "data"
        ),

        isLoading:
            warehousesQuery.isLoading ||
            categoriesQuery.isLoading ||
            attributesQuery.isLoading ||
            typeCustomFieldsQuery.isLoading ||
            customFieldsQuery.isLoading ||
            taxRatesQuery.isLoading ||
            taxesQuery.isLoading ||
            priceListsQuery.isLoading ||
            typePriceListsQuery.isLoading ||
            unitMeasuresQuery.isLoading ||
            salesAccountsQuery.isLoading ||
            inventoryAccountsQuery.isLoading ||
            costAccountsQuery.isLoading ||
            paymentFormsQuery.isLoading ||
            paymentMethodsQuery.isLoading,
    };
}