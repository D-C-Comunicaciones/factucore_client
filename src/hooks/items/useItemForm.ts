import { useState, useCallback } from "react";
import { Item, ItemType } from "@/types/items";

export function useItemForm(initialData?: Partial<Item>) {
    const [itemType, setItemType] = useState<"producto" | "servicio" | "combo">(
        initialData?.type_item_id === 1 ? "producto" : 
        initialData?.type_item_id === 2 ? "servicio" : 
        initialData?.type_item_id === 3 ? "combo" : "producto"
    );
    const [name, setName] = useState(initialData?.name || "");
    const [reference, setReference] = useState(initialData?.reference || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [unitMeasureId, setUnitMeasureId] = useState<number | undefined>(initialData?.unit_measure_id);
    const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.basic_info?.category_id);
    
    // Pricing
    const [basePrice, setBasePrice] = useState(initialData?.pricing?.base_price?.toString() || "");
    const [taxId, setTaxId] = useState<number | undefined>(initialData?.pricing?.tax_id);
    const [totalPrice, setTotalPrice] = useState(initialData?.pricing?.total_price || 0);
    const [applyToVariants, setApplyToVariants] = useState(initialData?.pricing?.apply_to_variants ?? true);

    // Inventory
    const [hasVariants, setHasVariants] = useState(initialData?.basic_info?.has_variants ?? false);
    const [warehouseId, setWarehouseId] = useState<number | undefined>(initialData?.inventory?.warehouse_id);
    const [initialStock, setInitialStock] = useState(initialData?.inventory?.initial_stock?.toString() || "");
    const [minimumStock, setMinimumStock] = useState(initialData?.inventory?.minimum_stock?.toString() || "");

    // Variants, Combo Settings, Custom Fields...
    const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
    const [comboSettings, setComboSettings] = useState<any>(initialData?.combo_settings || { components: [] });
    const [customFields, setCustomFields] = useState<any[]>(initialData?.custom_fields || []);

    /**
     * Transforma el estado actual del formulario al contrato del backend
     */
    const buildPayload = useCallback(() => {
        const typeIdMap: Record<string, number> = { "producto": 1, "servicio": 2, "combo": 3 };
        
        const payload: any = {
            basic_info: {
                type_item_id: typeIdMap[itemType],
                name,
                code: reference,
                unit_measure_id: unitMeasureId,
                has_variants: itemType === "producto" ? hasVariants : false,
                category_id: categoryId,
            },
            pricing: {
                base_price: parseFloat(basePrice) || 0,
                total_price: totalPrice,
                tax_id: taxId,
                apply_to_variants: applyToVariants,
            }
        };

        // Inventory for Simple Product
        if (itemType === "producto" && !hasVariants) {
            payload.inventory = {
                warehouse_id: warehouseId,
                initial_stock: parseFloat(initialStock) || 0,
                minimum_stock: parseFloat(minimumStock) || 0,
            };
        }

        // Variants for Product with Variants
        if (itemType === "producto" && hasVariants) {
            payload.variants = variants.map(v => ({
                id: v.id,
                reference: v.reference,
                base_price: v.base_price,
                total_price: v.total_price,
                attributes: v.attributes,
                initial_stock: v.initial_stock, // Each variant has its own initial_stock object
            }));
        }

        // Combo Settings
        if (itemType === "combo") {
            payload.combo_settings = comboSettings;
        }

        // Custom Fields
        if (customFields.length > 0) {
            payload.custom_fields = customFields.map(f => ({
                field_id: f.field_id,
                value: f.value
            }));
        }

        return payload;
    }, [
        itemType, name, reference, unitMeasureId, hasVariants, categoryId,
        basePrice, totalPrice, taxId, applyToVariants,
        warehouseId, initialStock, minimumStock,
        variants, comboSettings, customFields
    ]);

    return {
        // State
        itemType, setItemType,
        name, setName,
        reference, setReference,
        description, setDescription,
        unitMeasureId, setUnitMeasureId,
        categoryId, setCategoryId,
        basePrice, setBasePrice,
        taxId, setTaxId,
        totalPrice, setTotalPrice,
        applyToVariants, setApplyToVariants,
        hasVariants, setHasVariants,
        warehouseId, setWarehouseId,
        initialStock, setInitialStock,
        minimumStock, setMinimumStock,
        variants, setVariants,
        comboSettings, setComboSettings,
        customFields, setCustomFields,
        // Actions
        buildPayload
    };
}
