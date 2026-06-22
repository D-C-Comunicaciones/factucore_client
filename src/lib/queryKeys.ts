export const QUERY_KEYS = {
    /* ====================================================================== */
    /* AUTH                                                                   */
    /* ====================================================================== */

    auth: {
        all: ["auth"] as const,

        me: () =>
            ["auth", "me"] as const,
    },

    /* ====================================================================== */
    /* CATALOGS                                                               */
    /* ====================================================================== */

    catalogs: {
        all: ["catalogs"] as const,

        countries: () => ["catalogs", "countries"] as const,

        warehouses: () =>
            [
                "catalogs",
                "warehouses",
            ] as const,

        categories: () =>
            [
                "catalogs",
                "categories",
            ] as const,

        attributes: () =>
            [
                "catalogs",
                "attributes",
            ] as const,

        customFields: () =>
            [
                "catalogs",
                "custom-fields",
            ] as const,

        customFieldsItems: () =>
            [
                "catalogs",
                "custom-fields",
                "items",
            ] as const,

        typeCustomFields: () =>
            [
                "catalogs",
                "type-custom-fields",
            ] as const,

        taxRates: () =>
            [
                "catalogs",
                "tax-rates",
            ] as const,

        taxes: () =>
            [
                "catalogs",
                "taxes",
            ] as const,

        unitMeasures: () =>
            [
                "catalogs",
                "unit-measures",
            ] as const,

        standardCodes: () =>
            [
                "catalogs",
                "standard-codes",
            ] as const,

        priceLists: () =>
            [
                "catalogs",
                "price-lists",
            ] as const,

        typePriceLists: () =>
            [
                "catalogs",
                "type-price-lists",
            ] as const,

        salesAccounts: () =>
            [
                "catalogs",
                "sales-accounts",
            ] as const,

        inventoryAccounts: () =>
            [
                "catalogs",
                "inventory-accounts",
            ] as const,

        costAccounts: () =>
            [
                "catalogs",
                "cost-accounts",
            ] as const,

        paymentForms: () =>
            [
                "catalogs",
                "payment-forms",
            ] as const,

        paymentMethods: () =>
            [
                "catalogs",
                "payment-methods",
            ] as const,

        bankAccounts: () =>
            [
                "catalogs",
                "bank-accounts",
            ] as const,

        paymentTerms: () => ["catalogs", "payment-terms"] as const,

        receivableAccounts: () => ["catalogs", "receivable-accounts"] as const,

        payableAccounts: () => ["catalogs", "payable-accounts"] as const,

        typeDocumentIdentifications: () =>
            [
                "catalogs",
                "type-document-identifications",
            ] as const,

        municipalities: () =>
            [
                "catalogs",
                "municipalities",
            ] as const,

        typeResolutions: () =>
            [
                "catalogs",
                "type-resolutions",
            ] as const,
    },

    /* ====================================================================== */
    /* ITEMS                                                                  */
    /* ====================================================================== */

    items: {
        all: ["items"] as const,

        lists: () =>
            ["items", "lists"] as const,

        list: (
            params?: Record<
                string,
                unknown
            >
        ) =>
            [
                "items",
                "lists",
                params ?? {},
            ] as const,

        details: () =>
            [
                "items",
                "details",
            ] as const,

        detail: (
            id: number | string
        ) =>
            [
                "items",
                "details",
                id,
            ] as const,

        variants: () =>
            [
                "items",
                "variants",
            ] as const,

        variant: (
            id: number | string
        ) =>
            [
                "items",
                "variants",
                id,
            ] as const,
    },
} as const;