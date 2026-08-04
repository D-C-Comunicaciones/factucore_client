import { useState, useMemo } from 'react';

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

    const updateItemDiscount = (id: string, value: number, type: 'percentage' | 'fixed') => {
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

    const addGlobalAdjustment = (type: 'discount' | 'charge', valueType: 'percentage' | 'fixed', value: number, reason: string) => {
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

    const updateGlobalAdjustment = (id: string, field: keyof GlobalAdjustment, value: any) => {
        setGlobalAdjustments(prev => prev.map(adj => {
            if (adj.id === id) {
                return { ...adj, [field]: value };
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
            const qty = Number(item.cantidad) || 0;
            const price = Number(item.precio) || 0;
            const discValue = Number(item.discountValue) || 0;

            const lineBase = qty * price;
            const lineDiscount = item.discountType === 'percentage'
                ? lineBase * (discValue / 100)
                : discValue;

            const lineNet = lineBase - lineDiscount;

            // Safeguard taxRate parsing
            let taxRate = 0;
            if (item.taxObj && item.taxObj.rate !== undefined && item.taxObj.rate !== null) {
                taxRate = Number(item.taxObj.rate);
                if (isNaN(taxRate)) taxRate = 0;
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
            const val = Number(adj.value) || 0;
            const amount = adj.valueType === 'percentage' ? netSubtotal * (val / 100) : val;
            const safeAmount = isNaN(amount) ? 0 : amount;

            if (adj.type === 'discount') {
                globalDiscountsAmount += safeAmount;
            } else {
                globalChargesAmount += safeAmount;
            }
        });

        const total = netSubtotal + taxesAmount - globalDiscountsAmount + globalChargesAmount;
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

    // --- Final Payload Builder ---
    const buildPayload = (baseData: any) => {
        const payload_lines = items.map(item => {
            const linePayload: any = {
                item_id: item.item_id,
                name: item.item,
                code_reference: item.referencia,
                quantity: item.cantidad,
                price_amount: item.precio,
                description: item.description,
                unit_measure_code: item.unit_measure_code,
                allowance_charges: item.allowance_charges,
                taxes: item.taxes?.map((t: any) => ({
                    ...t,
                    tax_code: t.tax_code || t.code || (t.tax_id ? String(t.tax_id) : undefined),
                    tax_name: t.tax_name || t.name,
                })),
                warehouse_id: item.selected_warehouse_id
            };
            if (item.standard_code && item.standard_code.trim() !== '') {
                linePayload.standard_code = item.standard_code;
            }
            return linePayload;
        });

        const global_allowance_charges = globalAdjustments
            .map(adj => ({
                scope: 'global',
                value_type: adj.valueType,
                reason: adj.reason,
                reason_code: adj.type === 'charge' ? "01" : "00",
                charge_indicator: adj.type === 'charge',
                value: adj.value
            }));

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

        return {
            ...baseData,
            type_operation_Quote: 1,
            send_mail: true,
            items: payload_lines,
            allowance_charges: global_allowance_charges,
            billing_period: {
                start_date: todayStr,
                start_time: timeStr,
                end_date: baseData.payment_form_id === 1 ? todayStr : (baseData.payment_due_date || todayStr),
                end_time: timeStr
            }
        };
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
