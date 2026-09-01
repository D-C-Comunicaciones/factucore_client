import { useState, useMemo } from "react";

// Local line-editor form state — distinct from the API's BillLine (types/bill.ts), which is the
// read model returned by the backend. This shape only lives in the "new"/"edit" form until the
// page maps it into the real BillLineInput payload (see NewBillContent.buildPayload()).
export interface BillLineFormState {
    id: string;
    item_id: number | string | null;
    item?: string;
    description?: string;
    referencia?: string;
    cantidad: number | string;
    precio: number | string;
    discountValue?: number | string;
    discountType?: "percentage" | "fixed";
    taxObj?: { id?: number | string; tax_id?: number | string; tax_rate_id?: number | string; name?: string; rate?: number | string; percentage?: number | string; type?: string } | null;
}

export interface BillWithholdingFormState {
    id?: string;
    retention_id?: number | string;
    name?: string;
    percentage?: number;
    base?: number;
    value?: number;
    is_assumed?: boolean;
    accounting_account_id?: string;
}

export interface BillPurchaseOrderFormState {
    id: string;
    purchase_order_id?: number | string;
    items?: any[];
}

export interface BillGlobalAdjustmentFormState {
    id: number;
    type: "discount" | "charge";
    valueType: "percentage" | "fixed";
    value: number;
    reason?: string;
}

export function useBillBuilder(initialData?: any) {
    const [items, setItems] = useState<BillLineFormState[]>(() => {
        if (initialData?.items && initialData.items.length > 0) {
            return initialData.items.map((it: any, index: number) => ({
                id: String(it.id || `line-${index}-${Date.now()}`),
                item_id: it.item_id || null,
                item: it.item || it.name || "",
                description: it.description || "",
                referencia: it.reference_code || it.referencia || "",
                cantidad: it.quantity ?? it.cantidad ?? 1,
                precio: it.price ?? it.cost ?? it.precio ?? 0,
                discountValue: it.discount ?? it.discountValue ?? 0,
                discountType: it.discount_type || it.discountType || "percentage",
                taxObj: it.tax || it.taxObj || null,
            }));
        }
        return [
            {
                id: `line-0-${Date.now()}`,
                item_id: null,
                item: "",
                description: "",
                referencia: "",
                cantidad: 1,
                precio: 0,
                discountValue: 0,
                discountType: "percentage",
                taxObj: null,
            },
        ];
    });

    const [withholdings, setWithholdings] = useState<BillWithholdingFormState[]>(() => {
        if (initialData?.withholdings && initialData.withholdings.length > 0) {
            return initialData.withholdings.map((w: any, index: number) => ({
                id: String(w.id || `withholding-${index}-${Date.now()}`),
                retention_id: w.retention_id || "2",
                name: w.name || "ReteFuente (3.5%)",
                percentage: Number(w.percentage || 3.5),
                base: Number(w.base || 0),
                value: Number(w.value || 0),
                is_assumed: Boolean(w.is_assumed),
                accounting_account_id: w.accounting_account_id || "",
            }));
        }
        return [];
    });

    const [purchaseOrders, setPurchaseOrders] = useState<BillPurchaseOrderFormState[]>(() => {
        if (initialData?.purchase_orders && initialData.purchase_orders.length > 0) {
            return initialData.purchase_orders.map((po: any, index: number) => ({
                id: String(po.id || `po-${index}-${Date.now()}`),
                purchase_order_id: po.purchase_order_id || "",
                items: po.items || [],
            }));
        }
        return [];
    });

    const [globalAdjustments, setGlobalAdjustments] = useState<BillGlobalAdjustmentFormState[]>(() => {
        if (initialData?.global_adjustments && initialData.global_adjustments.length > 0) {
            return initialData.global_adjustments;
        }
        return [];
    });

    // Item methods
    const addItem = () => {
        const newLine: BillLineFormState = {
            id: `line-${items.length}-${Date.now()}`,
            item_id: null,
            item: "",
            description: "",
            referencia: "",
            cantidad: 1,
            precio: 0,
            discountValue: 0,
            discountType: "percentage",
            taxObj: null,
        };
        setItems((prev) => [...prev, newLine]);
    };

    const updateItem = (id: string, field: keyof BillLineFormState, value: any) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.id === id) {
                    return { ...item, [field]: value };
                }
                return item;
            })
        );
    };

    const removeItem = (id: string) => {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    // Withholding methods
    const addWithholding = (baseAmount: number = 0) => {
        const percentage = 3.5;
        const value = (baseAmount * percentage) / 100;
        const newWithholding: BillWithholdingFormState = {
            id: `withholding-${withholdings.length}-${Date.now()}`,
            retention_id: "2",
            name: "ReteFuente (3.5%)",
            percentage,
            base: baseAmount,
            value,
            is_assumed: false,
            accounting_account_id: "",
        };
        setWithholdings((prev) => [...prev, newWithholding]);
    };

    const updateWithholding = (id: string, field: keyof BillWithholdingFormState, value: any) => {
        setWithholdings((prev) =>
            prev.map((w) => {
                if (w.id === id) {
                    const updated = { ...w, [field]: value };
                    if (field === "percentage" || field === "base") {
                        const p = field === "percentage" ? Number(value) : Number(updated.percentage || 0);
                        const b = field === "base" ? Number(value) : Number(updated.base || 0);
                        updated.value = (b * p) / 100;
                    }
                    return updated;
                }
                return w;
            })
        );
    };

    const removeWithholding = (id: string) => {
        setWithholdings((prev) => prev.filter((w) => w.id !== id));
    };

    // Purchase Order methods
    const addPurchaseOrder = () => {
        const newPo: BillPurchaseOrderFormState = {
            id: `po-${purchaseOrders.length}-${Date.now()}`,
            purchase_order_id: "",
            items: [],
        };
        setPurchaseOrders((prev) => [...prev, newPo]);
    };

    const updatePurchaseOrder = (id: string, purchaseOrderId: string | number) => {
        setPurchaseOrders((prev) =>
            prev.map((po) => {
                if (po.id === id) {
                    return { ...po, purchase_order_id: purchaseOrderId };
                }
                return po;
            })
        );
    };

    const removePurchaseOrder = (id: string) => {
        setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
    };

    // Totals calculations
    const totals = useMemo(() => {
        let subtotal = 0;
        let discountsAmount = 0;
        let taxesAmount = 0;

        items.forEach((item) => {
            const qty = Number(item.cantidad) || 0;
            const price = Number(item.precio) || 0;
            const lineSubtotal = qty * price;
            subtotal += lineSubtotal;

            let lineDiscount = 0;
            if (item.discountValue) {
                lineDiscount = item.discountType === "percentage"
                    ? (lineSubtotal * Number(item.discountValue)) / 100
                    : Number(item.discountValue);
            }
            discountsAmount += lineDiscount;

            const baseTaxable = Math.max(0, lineSubtotal - lineDiscount);
            if (item.taxObj) {
                const rate = Number(item.taxObj.rate ?? item.taxObj.percentage ?? 0);
                taxesAmount += (baseTaxable * rate) / 100;
            }
        });

        const subtotalAfterDiscount = Math.max(0, subtotal - discountsAmount);

        let withholdingsAmount = 0;
        withholdings.forEach((w) => {
            if (!w.is_assumed) {
                withholdingsAmount += Number(w.value) || 0;
            }
        });

        const payableAmount = Math.max(0, subtotalAfterDiscount + taxesAmount - withholdingsAmount);

        return {
            subtotal,
            discountsAmount,
            subtotalAfterDiscount,
            taxesAmount,
            withholdingsAmount,
            payableAmount,
        };
    }, [items, withholdings]);

    return {
        items,
        setItems,
        addItem,
        updateItem,
        removeItem,
        withholdings,
        setWithholdings,
        addWithholding,
        updateWithholding,
        removeWithholding,
        purchaseOrders,
        setPurchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrder,
        removePurchaseOrder,
        globalAdjustments,
        setGlobalAdjustments,
        totals,
    };
}
