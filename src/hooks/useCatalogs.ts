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

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.paymentTerms(),
            queryFn: catalogsApi.getPaymentTerms,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.receivableAccounts(),
            queryFn: catalogsApi.getReceivableAccounts,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.payableAccounts(),
            queryFn: catalogsApi.getPayableAccounts,
        }),

        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.typeDocumentIdentifications(),
            queryFn: catalogsApi.getTypeDocumentIdentifications,
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.countries(),
            queryFn: catalogsApi.getCountries,
        }),
        queryClient.prefetchQuery({
            queryKey: QUERY_KEYS.catalogs.typeResolutions(),
            queryFn: catalogsApi.getTypeResolutions,
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

const EMPTY_ARRAY: any[] = [];

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

    const paymentTermsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.paymentTerms(),
        queryFn: catalogsApi.getPaymentTerms,
    });

    const receivableAccountsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.receivableAccounts(),
        queryFn: catalogsApi.getReceivableAccounts,
    });

    const payableAccountsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.payableAccounts(),
        queryFn: catalogsApi.getPayableAccounts,
    });

    const typeDocumentIdentificationsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.typeDocumentIdentifications(),
        queryFn: catalogsApi.getTypeDocumentIdentifications,
    });

    const countriesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.countries(),
        queryFn: catalogsApi.getCountries,
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    const typeResolutionsQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.typeResolutions(),
        queryFn: catalogsApi.getTypeResolutions,
    });

    const municipalitiesQuery = useQuery({
        queryKey: QUERY_KEYS.catalogs.municipalities(),
        queryFn: catalogsApi.getMunicipalities,
        staleTime: 1000 * 60 * 60, // 1 hour — this data rarely changes
    });

    /* ====================================================================== */
    /* HELPERS                                                                */
    /* ====================================================================== */

    const extractArray = <T = any>(
        data: any,
        ...keys: string[]
    ): T[] => {
        if (!data) return EMPTY_ARRAY as T[];

        if (Array.isArray(data)) {
            return data as T[];
        }

        for (const key of keys) {
            if (Array.isArray(data[key])) {
                return data[key] as T[];
            }
        }

        return EMPTY_ARRAY as T[];
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

        paymentTerms: extractArray(
            paymentTermsQuery.data?.data,
            "payment_terms",
            "paymentTerms",
            "data"
        ),

        receivableAccounts: extractArray(
            receivableAccountsQuery.data?.data,
            "accounts",
            "receivable_accounts",
            "receivableAccounts",
            "data"
        ),

        payableAccounts: extractArray(
            payableAccountsQuery.data?.data,
            "accounts",
            "payable_accounts",
            "payableAccounts",
            "data"
        ),

        typeDocumentIdentifications: extractArray(
            typeDocumentIdentificationsQuery.data?.data,
            "type_document_identifications",
            "typeDocumentIdentifications",
            "data"
        ),

        municipalities: extractArray(
            municipalitiesQuery.data?.data,
            "municipalities",
            "data"
        ),

        countries: extractArray(
            countriesQuery.data?.data,
            "countries",
            "data"
        ),

        typeResolutions: extractArray(
            typeResolutionsQuery.data?.data,
            "type_resolutions",
            "typeResolutions",
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
            paymentMethodsQuery.isLoading ||
            paymentTermsQuery.isLoading ||
            receivableAccountsQuery.isLoading ||
            payableAccountsQuery.isLoading ||
            typeDocumentIdentificationsQuery.isLoading ||
            municipalitiesQuery.isLoading ||
            countriesQuery.isLoading ||
            typeResolutionsQuery.isLoading,
    };
}