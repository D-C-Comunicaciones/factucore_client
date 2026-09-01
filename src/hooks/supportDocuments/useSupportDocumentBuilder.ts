import { useState, useMemo } from 'react';

// Local line-editor form state — distinct from the API's SupportDocumentLine (types/supportDocument.ts),
// which is the read model returned by the backend. This shape only ever lives in the "new"/"edit" form
// until NewSupportDocumentContent.handleSaveAction() maps it into the real SupportDocumentLineInput payload.
export interface SupportDocumentLineFormState {
    id: string; // row id
    item_id: number | null;
    standard_code?: string;
    item: string;
    description: string;
    referencia?: string;
    cantidad: number | '';
    unit_measure_code?: string;
    precio: number;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
    taxObj?: any | null;
    taxes?: { tax_id: number; rate: number; name?: string }[];
    allowance_charges?: any[];
}

export interface SupportDocumentWithholdingFormState {
    id?: string;
    retention_id?: number | string;
    name?: string;
    code?: string;
    percentage?: number;
    base: number;
    value: number;
    is_assumed: boolean;
}

export interface SupportDocumentTotals {
    subtotal: number;
    discountsAmount: number;
    taxesAmount: number;
    subtotalAfterDiscount: number;
    withholdingsAmount: number;
    total: number;
    payableAmount: number;
}

export function useSupportDocumentBuilder() {
    const [items, setItems] = useState<SupportDocumentLineFormState[]>([
        {
            id: 'line-1',
            item_id: null,
            standard_code: '',
            item: '',
            description: '',
            referencia: '',
            cantidad: 1,
            unit_measure_code: '94',
            precio: 0,
            discountValue: 0,
            discountType: 'percentage',
            taxObj: null,
            taxes: [],
            allowance_charges: []
        }
    ]);

    const [withholdings, setWithholdings] = useState<SupportDocumentWithholdingFormState[]>([]);
    const [purchaseOrders, setPurchaseOrders] = useState<{ id: string; purchase_order_id: string }[]>([]);

    const addItem = () => {
        setItems(prev => [
            ...prev,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `line-${Date.now()}-${Math.random()}`,
                item_id: null,
                standard_code: '',
                item: '',
                description: '',
                referencia: '',
                cantidad: 1,
                unit_measure_code: '94',
                precio: 0,
                discountValue: 0,
                discountType: 'percentage',
                taxObj: null,
                taxes: [],
                allowance_charges: []
            }
        ]);
    };

    const removeItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof SupportDocumentLineFormState, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const addWithholding = (defaultBase = 0) => {
        setWithholdings(prev => [
            ...prev,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `ret-${Date.now()}-${Math.random()}`,
                retention_id: '',
                name: '',
                code: '',
                percentage: 0,
                base: defaultBase,
                value: 0,
                is_assumed: false
            }
        ]);
    };

    const removeWithholding = (id: string) => {
        setWithholdings(prev => prev.filter(w => w.id !== id));
    };

    const updateWithholding = (id: string, field: keyof SupportDocumentWithholdingFormState, value: any) => {
        setWithholdings(prev => prev.map(w => {
            if (w.id === id) {
                const updated = { ...w, [field]: value };
                if (field === 'percentage' || field === 'base') {
                    const pct = field === 'percentage' ? Number(value) || 0 : Number(w.percentage) || 0;
                    const base = field === 'base' ? Number(value) || 0 : Number(w.base) || 0;
                    updated.value = Math.round((base * pct) / 100);
                }
                return updated;
            }
            return w;
        }));
    };

    const addPurchaseOrder = () => {
        setPurchaseOrders(prev => [
            ...prev,
            {
                id: crypto.randomUUID ? crypto.randomUUID() : `po-${Date.now()}-${Math.random()}`,
                purchase_order_id: ''
            }
        ]);
    };

    const removePurchaseOrder = (id: string) => {
        setPurchaseOrders(prev => prev.filter(po => po.id !== id));
    };

    const updatePurchaseOrder = (id: string, purchase_order_id: string) => {
        setPurchaseOrders(prev => prev.map(po => {
            if (po.id === id) {
                return { ...po, purchase_order_id };
            }
            return po;
        }));
    };

    const reset = () => {
        setItems([
            {
                id: 'line-1',
                item_id: null,
                standard_code: '',
                item: '',
                description: '',
                referencia: '',
                cantidad: 1,
                unit_measure_code: '94',
                precio: 0,
                discountValue: 0,
                discountType: 'percentage',
                taxObj: null,
                taxes: [],
                allowance_charges: []
            }
        ]);
        setWithholdings([]);
        setPurchaseOrders([]);
    };

    const totals: SupportDocumentTotals = useMemo(() => {
        let subtotal = 0;
        let discountsAmount = 0;
        let taxesAmount = 0;

        items.forEach(line => {
            const qty = Number(line.cantidad) || 0;
            const price = Number(line.precio) || 0;
            const lineSubtotal = qty * price;
            subtotal += lineSubtotal;

            let lineDiscount = 0;
            if (line.discountValue && line.discountValue > 0) {
                if (line.discountType === 'percentage') {
                    lineDiscount = (lineSubtotal * Number(line.discountValue)) / 100;
                } else {
                    lineDiscount = Number(line.discountValue);
                }
            }
            discountsAmount += lineDiscount;

            const baseForTax = Math.max(0, lineSubtotal - lineDiscount);
            if (line.taxObj && line.taxObj.rate) {
                const rate = Number(line.taxObj.rate) || 0;
                taxesAmount += (baseForTax * rate) / 100;
            } else if (line.taxes && line.taxes.length > 0) {
                line.taxes.forEach(t => {
                    const rate = Number(t.rate) || 0;
                    taxesAmount += (baseForTax * rate) / 100;
                });
            }
        });

        const subtotalAfterDiscount = Math.max(0, subtotal - discountsAmount);
        
        let withholdingsDeducted = 0;
        let withholdingsTotal = 0;

        withholdings.forEach(w => {
            const val = Number(w.value) || 0;
            withholdingsTotal += val;
            if (!w.is_assumed) {
                withholdingsDeducted += val;
            }
        });

        const total = subtotalAfterDiscount + taxesAmount;
        const payableAmount = Math.max(0, total - withholdingsDeducted);

        return {
            subtotal,
            discountsAmount,
            taxesAmount,
            subtotalAfterDiscount,
            withholdingsAmount: withholdingsTotal,
            total,
            payableAmount
        };
    }, [items, withholdings]);

    return {
        items,
        setItems,
        addItem,
        removeItem,
        updateItem,
        withholdings,
        setWithholdings,
        addWithholding,
        removeWithholding,
        updateWithholding,
        purchaseOrders,
        setPurchaseOrders,
        addPurchaseOrder,
        removePurchaseOrder,
        updatePurchaseOrder,
        totals,
        reset
    };
}
