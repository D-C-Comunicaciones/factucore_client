import { ApiResponse } from "./api";
import { Image } from "@/common/interfaces/images";

/* ========================================================================== */
/* ENUMS & BASE TYPES                                                         */
/* ========================================================================== */

export type ItemTypeId = 1 | 2 | 3;
// 1 = Producto
// 2 = Servicio
// 3 = Combo

export type ItemTypeName = "producto" | "servicio" | "combo";

export type CustomFieldValue =
    | string
    | number
    | boolean
    | null;

export interface ItemImage extends Image {
    item_id: number;
}

/* ========================================================================== */
/* PERMISSIONS                                                                */
/* ========================================================================== */

export interface Permission {
    can_edit: boolean;
    can_delete: boolean;
}

/* ========================================================================== */
/* BASIC INFO                                                                 */
/* ========================================================================== */

export interface BaseItemBasicInfo {
    unit_measure_id: number;
    name: string;
    reference?: string;
    description?: string;
    barcode?: string;
    category_id?: number | null;
    type_item_identification_id?: number;
    standard_code_id?: number;
}

/* -------------------------------- PRODUCT -------------------------------- */

export interface ProductBasicInfo extends BaseItemBasicInfo {
    type_item_id: 1;
    has_variants: boolean;
}

/* -------------------------------- SERVICE -------------------------------- */

export interface ServiceBasicInfo extends BaseItemBasicInfo {
    type_item_id: 2;
    has_variants: false;
}

/* -------------------------------- COMBO -------------------------------- */

export interface ComboBasicInfo extends BaseItemBasicInfo {
    type_item_id: 3;
    has_variants: false;
}

/* ========================================================================== */
/* PRICING                                                                    */
/* ========================================================================== */

export interface CreateItemPriceList {
    id: number;

    /**
     * Obligatorio únicamente
     * para listas tipo valor fijo.
     */
    value?: number;
}

export interface CreateItemPricing {
    base_price: number;
    total_price: number;

    /**
     * Solo aplica a productos
     * con variantes.
     */
    apply_to_variants: boolean;

    /**
     * Obligatorio para productos.
     */
    default_cost_price?: number;

    /**
     * Tarifas/impuestos.
     */
    tax_rate_ids?: number[];

    /**
     * Listas de precios.
     */
    price_lists?: CreateItemPriceList[];
}

/* ========================================================================== */
/* ACCOUNTING                                                                 */
/* ========================================================================== */

export interface CreateItemAccounting {
    sales_account_id?: number;
    inventory_account_id?: number;
    cost_account_id?: number;
}

/* ========================================================================== */
/* INVENTORY                                                                  */
/* ========================================================================== */

export interface CreateItemInitialStock {
    warehouse_id: number;
    quantity: number;

    minimum_stock?: number;
    maximum_stock?: number;
}

export interface CreateItemInventory {
    initial_stock?: CreateItemInitialStock;

    is_inventoriable?: boolean;
    allow_negative_stock?: boolean;
}

/* ========================================================================== */
/* CUSTOM FIELDS                                                              */
/* ========================================================================== */

export interface CreateItemCustomField {
    id: number;
    value?: CustomFieldValue;
}

/* ========================================================================== */
/* VARIANTS                                                                   */
/* ========================================================================== */

export interface CreateItemVariantAttribute {
    attribute_id: number;
    value_id: number;
}

export interface CreateItemVariant {
    /**
     * Solo presente en update sync.
     */
    id?: number;

    reference?: string;

    base_price?: number;
    total_price?: number;
    default_cost_price?: number;

    active?: boolean;

    attributes: CreateItemVariantAttribute[];

    initial_stock?: CreateItemInitialStock;
}

/* ========================================================================== */
/* COMBOS                                                                     */
/* ========================================================================== */

export interface CreateItemComboComponent {
    child_item_id: number;
    quantity: number;

    child_item_variant_id?: number | null;
}

export interface CreateItemComboSettings {
    cost_calculation_mode_id: number;
    cost_value?: number;

    components: CreateItemComboComponent[];
}

/* ========================================================================== */
/* BASE PAYLOAD                                                               */
/* ========================================================================== */

export interface BaseItemPayload {
    pricing: CreateItemPricing;

    accounting?: CreateItemAccounting;

    custom_fields?: CreateItemCustomField[];
}

/* ========================================================================== */
/* PRODUCT PAYLOAD                                                            */
/* ========================================================================== */

export interface ProductItemPayload extends BaseItemPayload {
    basic_info: ProductBasicInfo;

    /**
     * Producto simple.
     */
    inventory?: CreateItemInventory;

    /**
     * Producto con variantes.
     */
    variants?: CreateItemVariant[];
}

/* ========================================================================== */
/* SERVICE PAYLOAD                                                            */
/* ========================================================================== */

export interface ServiceItemPayload extends BaseItemPayload {
    basic_info: ServiceBasicInfo;
}

/* ========================================================================== */
/* COMBO PAYLOAD                                                              */
/* ========================================================================== */

export interface ComboItemPayload extends BaseItemPayload {
    basic_info: ComboBasicInfo;

    combo_settings: CreateItemComboSettings;
}

/* ========================================================================== */
/* CREATE PAYLOAD                                                             */
/* ========================================================================== */

export type CreateItemPayload =
    | ProductItemPayload
    | ServiceItemPayload
    | ComboItemPayload;

/* ========================================================================== */
/* UPDATE ITEM PAYLOAD (SYNC INTELIGENTE)                                     */
/* ========================================================================== */

export interface UpdateItemPayload {
    basic_info?: Partial<
        ProductBasicInfo |
        ServiceBasicInfo |
        ComboBasicInfo
    >;

    pricing?: Partial<CreateItemPricing>;

    accounting?: Partial<CreateItemAccounting>;

    inventory?: Partial<CreateItemInventory>;

    custom_fields?: CreateItemCustomField[];

    /**
     * Sync inteligente:
     * - crea
     * - actualiza
     * - desactiva
     * - elimina
     */
    variants?: CreateItemVariant[];

    combo_settings?: CreateItemComboSettings;
}

/* ========================================================================== */
/* UPDATE VARIANT PAYLOAD                                                     */
/* ========================================================================== */

export interface UpdateVariantPayload {
    reference?: string;

    base_price?: number;
    total_price?: number;
    default_cost_price?: number;

    active?: boolean;

    attributes?: CreateItemVariantAttribute[];

    initial_stock?: CreateItemInitialStock;
}

/* ========================================================================== */
/* RESPONSE MODELS                                                            */
/* ========================================================================== */

export interface ItemVariantAttributeResponse {
    attribute_id: number;
    value_id: number;
}

export interface ItemVariantResponse {
    id: number;

    reference: string;

    base_price?: number;
    total_price?: number;
    default_cost_price?: number;

    active: boolean;

    attributes: ItemVariantAttributeResponse[];

    initial_stock?: CreateItemInitialStock;

    created_at?: string;
    updated_at?: string;
}

/* ========================================================================== */
/* ITEM RESPONSE                                                              */
/* ========================================================================== */

export interface ItemResponse {
    id: number;
    permissions: Permission;
    basic_info: {
        name: string;
        reference: string;
        barcode: string | null;
        type_item_id: ItemTypeId;
        type_item: {
            id: number;
            code: string;
            name: string;
            description: string;
            created_at: string;
            updated_at: string;
        };
        category_id: number | null;
        category: any; // Define category type if available
        unit_measure_id: number;
        unit_measure: {
            id: number;
            code: string;
            name: string;
            created_at: string;
            updated_at: string;
        };
        type_item_identification_id: number | null;
        type_item_identification: any; // Define type if available
        standard_code_id: number | null;
        standard_code: any; // Define type if available
        description: string;
        has_variants: boolean;
        is_active: boolean;
        image_path: string | null;
    };
    pricing: {
        base_price: string;
        total_price: string;
        default_cost_price: string;
        tax_rate_ids: number[];
        tax_rates: any[]; // Define tax rate type if available
        price_lists: {
            id: number;
            price_list_id: number;
            price_list: {
                id: number;
                type_price_list_id: number;
                name: string;
                description: string;
                is_system_default: boolean;
                is_active: boolean;
                created_at: string;
                updated_at: string;
                percentage: number | null;
            };
            value: string;
        }[];
    };
    accounting: {
        sales_account_id: number;
        sales_account: any; // Define account type
        inventory_account_id: number;
        inventory_account: any; // Define account type
        cost_account_id: number;
        cost_account: any; // Define account type
    };
    inventory: {
        is_inventoriable: boolean;
        allow_negative_stock: boolean;
        inventory_stocks: {
            id: number;
            warehouse_id: number;
            warehouse: {
                id: number;
                name: string;
                code: string;
                address: string | null;
                observations: string;
                is_default: boolean;
                is_active: boolean;
                created_at: string;
                updated_at: string;
            };
            initial_stock: string;
            stock_quantity: string;
            minimum_stock: string | null;
            maximum_stock: string | null;
            is_active: boolean;
            in_remission: number;
        }[];
    };
    custom_fields: {
        id: number;
        name: string;
        value: string;
    }[];
    combo_settings: any; // Define combo settings type
    variants: {
        id: number;
        name: string;
        sku: string | null;
        barcode: string | null;
        base_price: string;
        total_price: string;
        default_cost_price: string;
        image_path: string | null;
        is_active: boolean;
        attributes: {
            attribute_id: number;
            attribute: {
                id: number;
                name: string;
                is_active: boolean;
                created_at: string;
                updated_at: string;
            };
            value: string;
        }[];
        inventory_stocks: {
            id: number;
            warehouse_id: number;
            warehouse: any; // Define warehouse type
            initial_stock: string;
            stock_quantity: string;
            minimum_stock: string | null;
            maximum_stock: string | null;
            is_active: boolean;
            in_remission: number;
        }[];
        permissions: Permission;
    }[];
    transactions: {
        invoices: any[];
        purchaseOrders: any[];
        deliveryNotes: any[];
        creditNotes: any[];
        debitNotes: any[];
        inventoryTransfers: any[];
    };
    images?: ItemImage[];
    created_at: string;
    updated_at: string;
}

/* ========================================================================== */
/* API RESPONSES                                                              */
/* ========================================================================== */

export type ItemApiResponse = ApiResponse<ItemResponse>;

export type ItemsApiResponse = ApiResponse<ItemListResponse[]>;

/* ========================================================================== */
/* FORM STATE (UI ONLY)                                                       */
/* ========================================================================== */

export interface ItemFormState {
    itemType: ItemTypeName;

    name: string;
    reference: string;

    categoryId: string;

    bodega: string;

    unit: string;

    comboCode: string;

    initialQuantity: string;

    initialCost: string;

    basePrice: string;

    totalPrice: string;

    tax: string;
}

/* ========================================================================== */
/* ITEM LIST RESPONSE                                                         */
/* ========================================================================== */

export interface ItemListResponse {
    id: number;

    name: string;

    reference?: string;

    description?: string;

    active: boolean;

    is_active?: boolean;

    type_item_id: ItemTypeId;

    price: number;

    permissions: Permission;

    /**
     * Indica si el registro es un ítem padre o una variante.
     * Viene del endpoint de listado aplanado.
     */
    entity_type?: "item" | "variant";

    parent_id?: number | null;

    created_at?: string;

    updated_at?: string;
}

export interface GetItemByIdResponse {
    item: ItemResponse;
}