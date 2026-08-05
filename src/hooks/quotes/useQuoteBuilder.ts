import { useState, useMemo } from 'react';
import { showToast } from "@/components/sonner/CustomToaster";

export interface InvoiceLine {
    id: string; // internal row id
    item_id: number | null; // ID from the API
    standard_code: string;
    item: string;
    description: string;
    referencia: string;
    cantidad: number | '';
    unit_measure_code: string;
    precio: number;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
    taxObj: any | null; // e.g. { tax_id: 1, type: "percentage", rate: 19, name: "IVA 19%" }
    allowance_charges: any[];
    taxes: any[];
    stock_quantity: number | null;
    is_inventoriable: boolean;
    allow_negative_stock: boolean;
    selected_warehouse_id?: number | null;
}

export interface GlobalAdjustment {
    id: string;
    type: 'discount' | 'charge';
    valueType: 'percentage' | 'fixed';
    value: number;
    reason: string;
}

export interface SimulationTotals {
    subtotal: number;
    lineDiscountsAmount: number;
    globalDiscountsAmount: number;
    globalChargesAmount: number;
    taxesAmount: number;
    total: number;
    payableAmount: number;
}

/** Returns true if the tax object represents an IVA tax */
export function isIvaTax(taxObj: any): boolean {
    if (!taxObj) return false;
    const name: string = taxObj.name || '';
    return name.toUpperCase().includes('IVA');
}



export function useQuoteBuilder() {
    const [items, setItems] = useState<InvoiceLine[]>([]);
    const [globalAdjustments, setGlobalAdjustments] = useState<GlobalAdjustment[]>([]);

    const addItem = () => {
        setItems(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                item_id: null,
                standard_code: '',
                item: '',
                description: '',
                referencia: '',
                cantidad: '',
                unit_measure_code: '94', // default to piece/unit if needed
                precio: 0,
                discountValue: 0,
                discountType: 'percentage',
                taxObj: null,
                allowance_charges: [],
                taxes: [],
                stock_quantity: null,
                is_inventoriable: true,
                allow_negative_stock: false
            }
        ]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof InvoiceLine, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const updateItemDiscount = (id: string, rawValue: number, type: 'percentage' | 'fixed') => {
        let value = Number(rawValue) || 0;
        if (value < 0) value = 0;

        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const allowance_charges = value > 0 ? [{
                    scope: 'line',
                    value_type: type,
                    reason: 'Descuento comercial',
                    charge_indicator: false,
                    value: value,
                    reason_code: "00" // as requested
                }] : [];
                return { ...item, discountValue: value, discountType: type, allowance_charges };
            }
            return item;
        }));
    };

    const updateItemTax = (id: string, taxObj: any | null) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const taxes = taxObj ? [taxObj] : [];
                return { ...item, taxObj, taxes };
            }
            return item;
        }));
    };

    const addGlobalAdjustment = (type: 'discount' | 'charge', valueType: 'percentage' | 'fixed', rawValue: number, reason: string) => {
        let value = Number(rawValue) || 0;
        if (value < 0) value = 0;

        if (valueType === 'percentage' && value > 100) {
            showToast("El porcentaje de ajuste no puede superar el 100%", "warning");
            value = 100;
        } else if (type === 'discount' && valueType === 'fixed' && value > totals.subtotal) {
            showToast("El valor digitado excede el valor total del documento", "warning");
            value = totals.subtotal > 0 ? totals.subtotal : 0;
        }

        setGlobalAdjustments(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                valueType,
                value,
                reason: reason || (type === 'discount' ? 'Descuento global' : 'Cargo global')
            }
        ]);
    };

    const removeGlobalAdjustment = (id: string) => {
        setGlobalAdjustments(prev => prev.filter(adj => adj.id !== id));
    };

    const updateGlobalAdjustment = (id: string, field: keyof GlobalAdjustment, rawValue: any) => {
        setGlobalAdjustments(prev => prev.map(adj => {
            if (adj.id === id) {
                let updated = { ...adj, [field]: rawValue };
                if (field === 'value' || field === 'valueType') {
                    let val = Number(updated.value) || 0;
                    if (val < 0) val = 0;
                    if (updated.valueType === 'percentage' && val > 100) {
                        showToast("El porcentaje de ajuste no puede superar el 100%", "warning");
                        val = 100;
                    } else if (updated.type === 'discount' && updated.valueType === 'fixed' && val > totals.subtotal) {
                        showToast("El valor digitado excede el valor total del documento", "warning");
                        val = totals.subtotal > 0 ? totals.subtotal : 0;
                    }
                    updated.value = val;
                }
                return updated;
            }
            return adj;
        }));
    };

    // --- Totals Simulation ---
    const totals = useMemo(() => {
        let grossSubtotal = 0;
        let netSubtotal = 0;
        let lineDiscountsAmount = 0;
        let taxesAmount = 0;
        let totalIvaAmount = 0;
        // Key: tax_id (string), Value: { name, amount }
        let taxBreakdown: Record<string, { name: string; amount: number }> = {};

        items.forEach(item => {
            const qty = Math.max(0, Number(item.cantidad) || 0);
            const price = Math.max(0, Number(item.precio) || 0);
            const rawDiscValue = Math.max(0, Number(item.discountValue) || 0);
            const discValue = item.discountType === 'percentage' ? Math.min(100, rawDiscValue) : rawDiscValue;

            const lineBase = qty * price;
            const lineDiscount = item.discountType === 'percentage'
                ? lineBase * (discValue / 100)
                : Math.min(lineBase, discValue);

            const lineNet = Math.max(0, lineBase - lineDiscount);

            // Safeguard taxRate parsing
            let taxRate = 0;
            if (item.taxObj && item.taxObj.rate !== undefined && item.taxObj.rate !== null) {
                taxRate = Number(item.taxObj.rate);
                if (isNaN(taxRate) || taxRate < 0) taxRate = 0;
            }

            const lineTax = lineNet * (taxRate / 100);

            grossSubtotal += (isNaN(lineBase) ? 0 : lineBase);
            netSubtotal += (isNaN(lineNet) ? 0 : lineNet);
            lineDiscountsAmount += (isNaN(lineDiscount) ? 0 : lineDiscount);

            const safeTax = isNaN(lineTax) ? 0 : lineTax;
            taxesAmount += safeTax;

            if (isIvaTax(item.taxObj)) {
                totalIvaAmount += safeTax;
            }

            if (taxRate > 0 && safeTax > 0 && item.taxObj) {
                // Use tax_id as the grouping key for reliability
                const taxKey = String(item.taxObj.tax_id || taxRate);
                const taxName = item.taxObj?.name || `IVA (${taxRate.toFixed(2)}%)`;
                if (!taxBreakdown[taxKey]) {
                    taxBreakdown[taxKey] = { name: taxName, amount: 0 };
                }
                taxBreakdown[taxKey].amount += safeTax;
            }
        });

        let globalDiscountsAmount = 0;
        let globalChargesAmount = 0;

        globalAdjustments.forEach(adj => {
            const val = Math.max(0, Number(adj.value) || 0);
            const safeVal = adj.valueType === 'percentage' ? Math.min(100, val) : val;
            const amount = adj.valueType === 'percentage' ? netSubtotal * (safeVal / 100) : safeVal;
            const safeAmount = isNaN(amount) ? 0 : amount;

            if (adj.type === 'discount') {
                globalDiscountsAmount += safeAmount;
            } else {
                globalChargesAmount += safeAmount;
            }
        });

        const rawTotal = netSubtotal + taxesAmount - globalDiscountsAmount + globalChargesAmount;
        const total = Math.max(0, rawTotal);
        const payableAmount = total;

        return {
            subtotal: isNaN(grossSubtotal) ? 0 : grossSubtotal,
            lineDiscountsAmount: isNaN(lineDiscountsAmount) ? 0 : lineDiscountsAmount,
            globalDiscountsAmount: isNaN(globalDiscountsAmount) ? 0 : globalDiscountsAmount,
            globalChargesAmount: isNaN(globalChargesAmount) ? 0 : globalChargesAmount,
            taxesAmount: isNaN(taxesAmount) ? 0 : taxesAmount,
            taxBreakdown,
            total: isNaN(total) ? 0 : total,
            payableAmount: isNaN(payableAmount) ? 0 : payableAmount
        };
    }, [items, globalAdjustments]);

    // --- Final Payload Builder matching cotización.json ---
    const buildPayload = (data: any) => {
        // 1. Settings object
        const settings: Record<string, any> = {
            currency_id: 35
        };

        const whId = data.warehouse_id || data.selectedWarehouseId;
        if (whId) settings.warehouse_id = Number(whId);

        const selId = data.seller_id;
        if (selId) settings.seller_id = Number(selId);

        const plId = data.price_list_id || data.selectedPriceListId;
        if (plId) settings.price_list_id = Number(plId);

        const ccId = data.cost_center_id;
        if (ccId) settings.cost_center_id = Number(ccId);

        if (data.currency_id) {
            const parsedCurrency = Number(data.currency_id);
            settings.currency_id = isNaN(parsedCurrency) ? 35 : parsedCurrency;
        }

        // 2. Quote Information object
        const todayStr = new Date().toISOString().split("T")[0];
        const contactId = data.contact_id || data.customer?.id || (typeof data.customer === 'number' || typeof data.customer === 'string' ? Number(data.customer) : null);

        const quote_information = {
            contact_id: Number(contactId || 0),
            issue_date: data.issue_date || todayStr,
            expiratop_date: data.expiratop_date || data.expiration_date || data.payment_due_date || todayStr
        };

        // 3. Items array
        const payloadItems = items.map(item => {
            const itemObj: any = {
                item_id: Number(item.item_id),
                name: item.item || item.name || "",
                reference: item.referencia || "",
                description: item.description || "",
                quantity: Number(item.cantidad),
                price_amount: Number(item.precio),
                unit_measure_code: item.unit_measure_code || "94"
            };

            // Allowance charges for item
            const itemDiscVal = Number(item.discountValue) || 0;
            if (itemDiscVal > 0) {
                itemObj.allowance_charges = [{
                    scope: "line",
                    value_type: item.discountType === "percentage" ? "percentage" : "fixed",
                    reason: "Descuento comercial",
                    charge_indicator: false,
                    value: itemDiscVal,
                    reason_code: "00"
                }];
            } else if (item.allowance_charges && item.allowance_charges.length > 0) {
                itemObj.allowance_charges = item.allowance_charges;
            }

            // Taxes for item
            if (item.taxObj) {
                const taxRate = Number(item.taxObj.rate || item.taxObj.percentage || 0);
                itemObj.taxes = [{
                    tax_rate_id: Number(item.taxObj.tax_rate_id || item.taxObj.id || item.taxObj.tax_id || 0),
                    tax_id: Number(item.taxObj.tax_id || item.taxObj.id || 0),
                    name: item.taxObj.name || `IVA (${taxRate}%)`,
                    rate: taxRate,
                    type: item.taxObj.type || "percentage",
                    description: item.taxObj.description || "Tarifa general",
                    tax_code: String(item.taxObj.tax_code || item.taxObj.code || item.taxObj.tax_id || "1"),
                    tax_name: item.taxObj.tax_name || item.taxObj.name || `IVA (${taxRate}%)`
                }];
            } else if (item.taxes && item.taxes.length > 0) {
                itemObj.taxes = item.taxes;
            }

            return itemObj;
        });

        // 4. Global Allowance Charges
        const global_allowance_charges = globalAdjustments.map(adj => ({
            scope: "global",
            value_type: adj.valueType,
            reason: adj.reason || (adj.type === "charge" ? "Cargo global" : "Descuento global"),
            reason_code: adj.type === "charge" ? "01" : "00",
            charge_indicator: adj.type === "charge",
            value: Number(adj.value)
        }));

        // Construct payload strictly matching cotización.json
        const payload: any = {
            resolution_id: Number(data.resolution_id),
            settings,
            quote_information,
            items: payloadItems
        };

        if (data.notes && data.notes.trim()) {
            payload.notes = data.notes;
        }
        if (data.terms_and_conditions && data.terms_and_conditions.trim()) {
            payload.terms_and_conditions = data.terms_and_conditions;
        }
        if (global_allowance_charges.length > 0) {
            payload.allowance_charges = global_allowance_charges;
        }

        return payload;
    };

    const reset = () => {
        setItems([]);
        setGlobalAdjustments([]);
    };

    const reorderItems = (oldIndex: number, newIndex: number) => {
        setItems(prev => {
            const result = [...prev];
            const [removed] = result.splice(oldIndex, 1);
            result.splice(newIndex, 0, removed);
            return result;
        });
    };

    return {
        items,
        globalAdjustments,
        addItem,
        removeItem,
        updateItem,
        updateItemDiscount,
        updateItemTax,
        addGlobalAdjustment,
        removeGlobalAdjustment,
        updateGlobalAdjustment,
        reorderItems,
        totals,
        buildPayload,
        reset
    };
}
