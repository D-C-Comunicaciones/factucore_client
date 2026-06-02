import { useState, useCallback } from "react";
import { ItemResponse, CreateItemPayload } from "@/types/items";

export function useItemForm(initialData?: Partial<ItemResponse>) {
    const [itemType, setItemType] = useState<"producto" | "servicio" | "combo">(
        initialData?.type_item_id === 1 ? "producto" : 
        initialData?.type_item_id === 2 ? "servicio" : 
        initialData?.type_item_id === 3 ? "combo" : "producto"
    );
    const [name, setName] = useState(initialData?.name || "");
    const [reference, setReference] = useState(initialData?.reference || "");
    const [description, setDescription] = useState(initialData?.description || "");
    const [unitMeasureId, setUnitMeasureId] = useState<number | undefined>(initialData?.unit_measure_id);
    const [categoryId, setCategoryId] = useState<number | undefined>(initialData?.basic_info?.category_id ?? undefined);
    const [typeItemIdentificationId, setTypeItemIdentificationId] = useState<number | undefined>(initialData?.basic_info?.type_item_identification_id);
    
    // Pricing
    const [basePrice, setBasePrice] = useState(initialData?.pricing?.base_price?.toString() || "");
    const [taxId, setTaxId] = useState<number | undefined>(initialData?.pricing?.tax_rate_ids?.[0] ?? undefined);
    const [totalPrice, setTotalPrice] = useState(initialData?.pricing?.total_price || 0);
    const [applyToVariants, setApplyToVariants] = useState(initialData?.pricing?.apply_to_variants ?? true);

    // Accounting
    const [salesAccountId, setSalesAccountId] = useState<number | undefined>(initialData?.accounting?.sales_account_id ?? undefined);
    const [inventoryAccountId, setInventoryAccountId] = useState<number | undefined>(initialData?.accounting?.inventory_account_id ?? undefined);
    const [costAccountId, setCostAccountId] = useState<number | undefined>(initialData?.accounting?.cost_account_id ?? undefined);

    // Inventory
    const [hasVariants, setHasVariants] = useState(initialData?.basic_info?.has_variants ?? false);
    const [warehouseId, setWarehouseId] = useState<number | undefined>(initialData?.inventory?.initial_stock?.warehouse_id);
    const [isInventoriable, setIsInventoriable] = useState(initialData?.inventory?.is_inventoriable ?? true);
    const [allowNegativeStock, setAllowNegativeStock] = useState(initialData?.inventory?.allow_negative_stock ?? false);
    const [initialStock, setInitialStockState] = useState(initialData?.inventory?.initial_stock?.quantity?.toString() || "");
    const [minimumStock, setMinimumStock] = useState(initialData?.inventory?.initial_stock?.minimum_stock?.toString() || "");

    const [warehouses, setWarehouses] = useState<any[]>([
        { id: "1", warehouse_id: warehouseId ?? 1, warehouse: "Principal", initialQty: initialData?.inventory?.initial_stock?.quantity?.toString() || "", minQty: minimumStock || "", maxQty: initialData?.inventory?.initial_stock?.maximum_stock?.toString() || "" }
    ]);

    const setInitialStock = useCallback((val: string) => {
        setInitialStockState(val);
        setWarehouses(prev => {
            const newWarehouses = [...prev];
            if (newWarehouses.length > 0) {
                newWarehouses[0] = { ...newWarehouses[0], initialQty: val };
            }
            return newWarehouses;
        });
    }, []);

    // Variants, Combo Settings, Custom Fields...
    const [variants, setVariants] = useState<any[]>(initialData?.variants || []);
    const [comboSettings, setComboSettings] = useState<any>(initialData?.combo_settings || { 
        cost_calculation_mode_id: 1, 
        cost_value: 0, 
        components: [] 
    });
    const [customFields, setCustomFields] = useState<any[]>(initialData?.custom_fields || []);
    const [priceLists, setPriceLists] = useState<any[]>(initialData?.pricing?.price_lists || []);

    /**
     * Transforma el estado actual del formulario al contrato del backend
     */
    const buildPayload = useCallback(() => {
        const typeIdMap: Record<string, 1 | 2 | 3> = { "producto": 1, "servicio": 2, "combo": 3 };
        
        // Determinar listas de precios a enviar
        let payloadPriceLists: any[] = [];
        const validPriceLists = priceLists.filter(pl => pl.price_list_id);

        if (validPriceLists.length > 0) {
            payloadPriceLists = validPriceLists.map((pl, index) => {
                const item: any = { id: parseInt(pl.price_list_id) };
                if (index === 0) {
                    item.value = parseFloat(basePrice) || 0;
                } else if (!pl.isPercentage && pl.value) {
                    item.value = parseFloat(pl.value.toString().replace(/[^0-9.]/g, "")) || 0;
                }
                return item;
            });
        }

        const payload: any = {
            basic_info: {
                type_item_id: typeIdMap[itemType] || 1,
                name,
                reference: reference || undefined,
                description: description || undefined,
                unit_measure_id: unitMeasureId ?? 1,
                has_variants: itemType === "producto" ? hasVariants : false,
                category_id: categoryId,
            },
            pricing: {
                base_price: parseFloat(basePrice) || 0,
                total_price: totalPrice,
                default_cost_price: 0,
                tax_rate_ids: taxId ? [taxId] : [],
                price_lists: payloadPriceLists,
            },
            accounting: {
                sales_account_id: salesAccountId,
                inventory_account_id: inventoryAccountId,
                cost_account_id: costAccountId,
            }
        };

        // Inventory for Simple Product
        if (itemType === "producto" && !hasVariants) {
            const validWarehouses = warehouses.filter(w => w.initialQty || w.minQty || w.maxQty);
            const w = validWarehouses.length > 0 ? validWarehouses[0] : warehouses[0];
            payload.inventory = {
                is_inventoriable: isInventoriable,
                allow_negative_stock: allowNegativeStock,
                initial_stock: {
                    warehouse_id: w?.warehouse_id || warehouseId || 1,
                    quantity: parseFloat(w?.initialQty || initialStock) || 0,
                    minimum_stock: parseFloat(w?.minQty || minimumStock) || 0,
                    maximum_stock: parseFloat(w?.maxQty) || 0,
                }
            };
        }

        // Variants for Product with Variants
        if (itemType === "producto" && hasVariants) {
            payload.variants = variants.map(v => {
                const variantPayload: any = {
                    reference: v.reference || undefined,
                    attributes: (v.attributes || []).map((a: any) => ({
                        attribute_id: a.attribute_id,
                        value_id: a.value_id,
                    })),
                };

                // Build initial_stock from inventory
                const firstInv = v.inventory && v.inventory.length > 0 ? v.inventory[0] : null;
                const warehouseId = firstInv?.warehouse_id || v.warehouse_id || 1;
                const quantity = parseFloat(firstInv?.initialQty || v.initialQty || "0") || 0;
                variantPayload.initial_stock = {
                    warehouse_id: warehouseId,
                    quantity,
                    is_active: v.active ?? true,
                };

                return variantPayload;
            });
        }

        // Combo Settings
        if (itemType === "combo") {
            payload.combo_settings = {
                cost_calculation_mode_id: comboSettings.cost_calculation_mode_id || 1,
                cost_value: comboSettings.cost_value || 0,
                components: (comboSettings.components || []).map((c: any) => ({
                    child_item_id: parseInt(c.product_id || c.id) || 1,
                    child_item_variant_id: c.variant_id ? parseInt(c.variant_id) : null,
                    quantity: parseFloat(c.quantity) || 1
                }))
            };
        }

        // Custom Fields
        if (customFields.length > 0) {
            payload.custom_fields = customFields.map(f => {
                const payloadField: any = { id: f.id ?? f.field_id };
                if (f.value !== "" && f.value !== null && f.value !== undefined) {
                    payloadField.value = f.value;
                }
                return payloadField;
            });
        }

        return payload as CreateItemPayload;
    }, [
        itemType, name, reference, description, unitMeasureId, hasVariants, categoryId, typeItemIdentificationId,
        basePrice, totalPrice, taxId,
        warehouseId, initialStock, minimumStock, warehouses,
        isInventoriable, allowNegativeStock,
        variants, comboSettings, customFields, priceLists,
        salesAccountId, inventoryAccountId, costAccountId
    ]);

    return {
        // State
        itemType, setItemType,
        name, setName,
        reference, setReference,
        description, setDescription,
        unitMeasureId, setUnitMeasureId,
        categoryId, setCategoryId,
        typeItemIdentificationId, setTypeItemIdentificationId,
        basePrice, setBasePrice,
        taxId, setTaxId,
        totalPrice, setTotalPrice,
        applyToVariants, setApplyToVariants,
        hasVariants, setHasVariants,
        warehouseId, setWarehouseId,
        initialStock, setInitialStock,
        minimumStock, setMinimumStock,
        warehouses, setWarehouses,
        isInventoriable, setIsInventoriable,
        allowNegativeStock, setAllowNegativeStock,
        variants, setVariants,
        comboSettings, setComboSettings,
        customFields, setCustomFields,
        priceLists, setPriceLists,
        salesAccountId, setSalesAccountId,
        inventoryAccountId, setInventoryAccountId,
        costAccountId, setCostAccountId,
        // Actions
        buildPayload
    };
}
