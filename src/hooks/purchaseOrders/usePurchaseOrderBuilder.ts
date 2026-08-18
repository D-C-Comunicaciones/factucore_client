import { useState, useMemo } from "react";
import { showToast } from "@/components/sonner/CustomToaster";

export interface PurchaseOrderBuilderLine {
    id: string; // internal row id
    item_id: number | null;
    item: string;
    referencia: string;
    description: string;
    cantidad: number | "";
    precio: number;
    discountValue: number;
    discountType: "percentage" | "fixed";
    taxObj: any | null;
}

export interface PurchaseOrderGlobalAdjustment {
    id: string;
    type: "discount" | "charge";
    valueType: "percentage" | "fixed";
    value: number;
    reason: string;
}

// Motor de cálculo compartido por órdenes de compra internal/external — mismo
// formato de payload y reglas que Cotizaciones/Remisiones (ver prompt.md).
export function usePurchaseOrderBuilder() {
    const [items, setItems] = useState<PurchaseOrderBuilderLine[]>([]);
    const [globalAdjustments, setGlobalAdjustments] = useState<PurchaseOrderGlobalAdjustment[]>([]);

    const addItem = () => {
        setItems((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                item_id: null,
                item: "",
                referencia: "",
                description: "",
                cantidad: "",
                precio: 0,
                discountValue: 0,
                discountType: "percentage",
                taxObj: null,
            },
        ]);
    };

    const removeItem = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const updateItem = (id: string, field: keyof PurchaseOrderBuilderLine, value: any) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    };

    const updateItemDiscount = (id: string, rawValue: number, type: "percentage" | "fixed") => {
        let value = Number(rawValue) || 0;
        if (value < 0) value = 0;
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, discountValue: value, discountType: type } : item)));
    };

    const updateItemTax = (id: string, taxObj: any | null) => {
        setItems((prev) => prev.map((item) => (item.id === id ? { ...item, taxObj } : item)));
    };

    const addGlobalAdjustment = (type: "discount" | "charge", valueType: "percentage" | "fixed", rawValue: number, reason: string) => {
        let value = Number(rawValue) || 0;
        if (value < 0) value = 0;

        if (valueType === "percentage" && value > 100) {
            showToast("El porcentaje de ajuste no puede superar el 100%", "warning");
            value = 100;
        } else if (type === "discount" && valueType === "fixed" && value > totals.subtotal) {
            showToast("El valor digitado excede el valor total del documento", "warning");
            value = totals.subtotal > 0 ? totals.subtotal : 0;
        }

        setGlobalAdjustments((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                type,
                valueType,
                value,
                reason: reason || (type === "discount" ? "Descuento global" : "Cargo global"),
            },
        ]);
    };

    const removeGlobalAdjustment = (id: string) => {
        setGlobalAdjustments((prev) => prev.filter((adj) => adj.id !== id));
    };

    // --- Totals: estimación local para feedback inmediato en el formulario.
    // Los totales autoritativos (con redondeos y orden descuento→impuesto→cargo
    // global) los calcula el backend y se muestran tal cual en el detalle.
    const totals = useMemo(() => {
        let grossSubtotal = 0;
        let netSubtotal = 0;
        let lineDiscountsAmount = 0;
        let taxesAmount = 0;

        items.forEach((item) => {
            const qty = Math.max(0, Number(item.cantidad) || 0);
            const price = Math.max(0, Number(item.precio) || 0);
            const rawDiscValue = Math.max(0, Number(item.discountValue) || 0);
            const discValue = item.discountType === "percentage" ? Math.min(100, rawDiscValue) : rawDiscValue;

            const lineBase = qty * price;
            const lineDiscount = item.discountType === "percentage" ? lineBase * (discValue / 100) : Math.min(lineBase, discValue);
            const lineNet = Math.max(0, lineBase - lineDiscount);

            let taxRate = 0;
            if (item.taxObj && item.taxObj.rate !== undefined && item.taxObj.rate !== null) {
                taxRate = Number(item.taxObj.rate);
                if (isNaN(taxRate) || taxRate < 0) taxRate = 0;
            }
            const lineTax = item.taxObj?.type === "fixed" ? taxRate * qty : lineNet * (taxRate / 100);

            grossSubtotal += isNaN(lineBase) ? 0 : lineBase;
            netSubtotal += isNaN(lineNet) ? 0 : lineNet;
            lineDiscountsAmount += isNaN(lineDiscount) ? 0 : lineDiscount;
            taxesAmount += isNaN(lineTax) ? 0 : lineTax;
        });

        let globalDiscountsAmount = 0;
        let globalChargesAmount = 0;

        globalAdjustments.forEach((adj) => {
            const val = Math.max(0, Number(adj.value) || 0);
            const safeVal = adj.valueType === "percentage" ? Math.min(100, val) : val;
            const amount = adj.valueType === "percentage" ? netSubtotal * (safeVal / 100) : safeVal;
            const safeAmount = isNaN(amount) ? 0 : amount;

            if (adj.type === "discount") globalDiscountsAmount += safeAmount;
            else globalChargesAmount += safeAmount;
        });

        const total = Math.max(0, netSubtotal + taxesAmount - globalDiscountsAmount + globalChargesAmount);

        return {
            subtotal: isNaN(grossSubtotal) ? 0 : grossSubtotal,
            lineDiscountsAmount: isNaN(lineDiscountsAmount) ? 0 : lineDiscountsAmount,
            globalDiscountsAmount: isNaN(globalDiscountsAmount) ? 0 : globalDiscountsAmount,
            globalChargesAmount: isNaN(globalChargesAmount) ? 0 : globalChargesAmount,
            taxesAmount: isNaN(taxesAmount) ? 0 : taxesAmount,
            total: isNaN(total) ? 0 : total,
        };
    }, [items, globalAdjustments]);

    // Payload que espera POST/PATCH /purchase-orders — idéntico en formato al de
    // Cotizaciones/Remisiones (ver prompt.md: allowance_charges/taxes por línea
    // y allowance_charges con scope "global" en la raíz).
    const buildPayload = (data: {
        type: "internal" | "external";
        contact_id: number | string;
        resolution_id?: number | string | null;
        reference?: string;
        issue_date: string;
        delivery_date?: string;
        warehouse_id?: number | string | null;
        cost_center_id?: number | string | null;
        notes?: string;
        terms_and_conditions?: string;
        status?: string;
    }) => {
        const payloadItems = items.map((item) => {
            const itemObj: any = {
                item_id: Number(item.item_id),
                description: item.description || "",
                quantity: Number(item.cantidad) || 0,
                unit_price: Number(item.precio) || 0,
            };

            const discVal = Number(item.discountValue) || 0;
            if (discVal > 0) {
                itemObj.allowance_charges = [
                    {
                        scope: "line",
                        value_type: item.discountType === "percentage" ? "percentage" : "fixed",
                        charge_indicator: false,
                        value: discVal,
                        reason: "Descuento comercial",
                    },
                ];
            }

            if (item.taxObj) {
                const taxRate = Number(item.taxObj.rate || item.taxObj.percentage || 0);
                itemObj.taxes = [
                    {
                        rate: taxRate,
                        type: item.taxObj.type === "fixed" ? "fixed" : "percentage",
                        name: item.taxObj.name || `IVA (${taxRate}%)`,
                        tax_code: String(item.taxObj.tax_code || item.taxObj.code || item.taxObj.tax_id || ""),
                    },
                ];
            }

            return itemObj;
        });

        const globalAllowanceCharges = globalAdjustments.map((adj) => ({
            scope: "global",
            value_type: adj.valueType,
            charge_indicator: adj.type === "charge",
            value: Number(adj.value),
            reason: adj.reason || (adj.type === "charge" ? "Cargo global" : "Descuento global"),
        }));

        const payload: any = {
            type: data.type,
            contact_id: Number(data.contact_id),
            issue_date: data.issue_date,
            status: data.status || "open",
            items: payloadItems,
        };

        if (globalAllowanceCharges.length > 0) {
            payload.allowance_charges = globalAllowanceCharges;
        }

        if (data.type === "external") {
            payload.reference = data.reference || "";
        } else {
            payload.resolution_id = Number(data.resolution_id);
        }

        if (data.delivery_date) payload.delivery_date = data.delivery_date;
        if (data.warehouse_id) payload.warehouse_id = Number(data.warehouse_id);
        if (data.cost_center_id) payload.cost_center_id = Number(data.cost_center_id);
        if (data.notes && data.notes.trim()) payload.notes = data.notes;
        if (data.terms_and_conditions && data.terms_and_conditions.trim()) payload.terms_and_conditions = data.terms_and_conditions;

        return payload;
    };

    const reset = () => {
        setItems([]);
        setGlobalAdjustments([]);
    };

    return {
        items,
        setItems,
        globalAdjustments,
        setGlobalAdjustments,
        addItem,
        removeItem,
        updateItem,
        updateItemDiscount,
        updateItemTax,
        addGlobalAdjustment,
        removeGlobalAdjustment,
        totals,
        buildPayload,
        reset,
    };
}
