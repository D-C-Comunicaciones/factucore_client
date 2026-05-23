import { ApiResponse } from "./api";

export interface Permission {
    can_edit: boolean;
    can_delete: boolean;
}

export interface ItemBasicInfo {
    type_item_id: number;
    unit_measure_id: number;
    code: string;
    name: string;
    has_variants: boolean;
    category_id?: number;
    brand_id?: number;
    standard_code_id?: number;
}

export interface ItemPricing {
    base_price: number;
    total_price: number;
    tax_id?: number;
    apply_to_variants: boolean;
    price_lists?: Array<{
        price_list_id: number;
        price: number;
    }>;
}

export interface ItemInventory {
    warehouse_id: number;
    initial_stock: number;
    minimum_stock: number;
    maximum_stock?: number;
}

export interface ItemVariantAttribute {
    attribute_id: number;
    value_id: number;
}

export interface ItemVariant {
    id?: number;
    reference: string;
    base_price?: number;
    total_price?: number;
    active?: boolean;
    attributes: ItemVariantAttribute[];
    initial_stock?: ItemInventory;
}

export interface ComboComponent {
    child_item_id: number;
    child_item_variant_id?: number;
    quantity: number;
}

export interface ComboSettings {
    cost_calculation_mode_id: number;
    components: ComboComponent[];
}

export interface CustomFieldValue {
    field_id: number;
    value: string | number | boolean;
}

export interface Item {
    id: number;
    name: string;
    reference: string;
    price: number;
    description: string;
    active: boolean;
    type_item_id: number;
    unit_measure_id: number;
    permissions: Permission;
    basic_info?: ItemBasicInfo;
    pricing?: ItemPricing;
    inventory?: ItemInventory;
    variants?: ItemVariant[];
    combo_settings?: ComboSettings;
    custom_fields?: CustomFieldValue[];
    created_at: string;
    updated_at: string;
}

export type ItemType = 1 | 2 | 3; // 1: Producto, 2: Servicio, 3: Combo

