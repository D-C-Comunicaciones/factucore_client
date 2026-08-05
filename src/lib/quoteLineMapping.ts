interface MappedLine {
    id: string;
    item_id: number | null;
    standard_code: string;
    item: string;
    description: string;
    referencia: string;
    cantidad: number | '';
    unit_measure_code: string;
    precio: number;
    discountValue: number;
    discountType: 'percentage' | 'fixed';
    taxObj: any | null;
    allowance_charges: any[];
    taxes: any[];
    stock_quantity: number | null;
    is_inventoriable: boolean;
    allow_negative_stock: boolean;
    selected_warehouse_id?: number | null;
}

interface MappedGlobalAdjustment {
    id: string;
    type: 'discount' | 'charge';
    valueType: 'percentage' | 'fixed';
    value: number;
    reason: string;
}

/**
 * Reconstructs builder line items (used by both useInvoiceBuilder and useQuoteBuilder,
 * which share the same InvoiceLine shape) from a quote's raw item data. Mirrors the same
 * field fallbacks used to display these items in the quote detail view
 * (QuoteDetailDocument.tsx), so the target document ends up with the same products,
 * quantities, prices, line discounts and line taxes as the source quote.
 */
export function mapQuoteItemsToLines(items: any[]): MappedLine[] {
    return (items || []).map((item: any) => {
        const itemName = item.name || item.item_name || item.item?.name || item.description || '';
        const itemId = item.item_id || item.id || item.item?.id || null;
        const itemRef = item.code_reference || item.item_code || item.standard_item_code || item.code || '';
        const itemPrice = Number(item.price || item.price_amount || 0);
        const itemQty = Number(item.quantity || 1);
        const unitMeasureCode = item.unit_measure?.code || item.unit_measure_code || '94';

        // Line discount: prefer the raw allowance_charge/discount entry so the value & type match the quote exactly
        const rawDiscount = item.discounts?.[0] || item.allowance_charges?.find((ac: any) => ac.charge_indicator === false);
        const discountAmount = item.discounts?.length
            ? item.discounts.reduce((sum: number, d: any) => sum + Number(d.calculated_amount ?? d.amount ?? d.value ?? 0), 0)
            : item.allowance_charges?.filter((ac: any) => ac.charge_indicator === false)?.reduce((sum: number, ac: any) => sum + Number(ac.amount || ac.value || 0), 0)
            || Number(item.discount_amount || 0);
        const totalGross = itemPrice * itemQty;

        let discountType: 'percentage' | 'fixed' = rawDiscount?.value_type === 'fixed' ? 'fixed' : 'percentage';
        let discountValue = 0;
        if (rawDiscount?.value != null) {
            discountValue = Number(rawDiscount.value);
        } else if (rawDiscount?.percent != null) {
            discountValue = Number(rawDiscount.percent);
            discountType = 'percentage';
        } else if (discountAmount > 0 && totalGross > 0) {
            discountValue = (discountAmount / totalGross) * 100;
            discountType = 'percentage';
        }

        const allowance_charges = discountValue > 0 ? [{
            scope: 'line',
            value_type: discountType,
            reason: rawDiscount?.reason || 'Descuento comercial',
            charge_indicator: false,
            value: discountValue,
            reason_code: rawDiscount?.reason_code || '00'
        }] : [];

        // Line tax
        const rawTax = item.taxes?.[0] || item.tax_totals?.[0] || null;
        const taxRate = Number(item.tax_rate || rawTax?.percent || rawTax?.rate || 0);
        const taxName = item.tax_name || rawTax?.tax_name || rawTax?.name || rawTax?.tax?.name || (taxRate > 0 ? `IVA ${taxRate}%` : '');
        const taxObj = taxRate > 0 ? {
            tax_id: rawTax?.tax_id ?? rawTax?.tax?.id ?? rawTax?.id ?? null,
            tax_rate_id: rawTax?.tax_rate_id ?? rawTax?.id ?? null,
            name: taxName,
            rate: taxRate,
            type: rawTax?.type || 'percentage',
        } : null;

        return {
            id: crypto.randomUUID(),
            item_id: itemId,
            standard_code: item.standard_code?.code || item.standard_code || '',
            item: itemName,
            description: item.description || '',
            referencia: itemRef,
            cantidad: itemQty,
            unit_measure_code: unitMeasureCode,
            precio: itemPrice,
            discountValue,
            discountType,
            taxObj,
            allowance_charges,
            taxes: taxObj ? [taxObj] : [],
            stock_quantity: item.stock_quantity ?? null,
            is_inventoriable: item.is_inventoriable ?? true,
            allow_negative_stock: item.allow_negative_stock ?? false,
            selected_warehouse_id: item.warehouse_id ?? item.selected_warehouse_id ?? null,
        };
    });
}

/**
 * Reconstructs global (document-level) discounts/charges from a quote, mirroring
 * the same field fallbacks used in QuoteDetailDocument.tsx to compute quote totals.
 */
export function mapQuoteGlobalAdjustments(quote: any): MappedGlobalAdjustment[] {
    const allDiscounts = quote?.global_discounts || quote?.discounts || quote?.allowance_charges?.filter((ac: any) => ac.charge_indicator === false) || [];
    const allCharges = quote?.global_charges || quote?.charges || quote?.allowance_charges?.filter((ac: any) => ac.charge_indicator === true) || [];

    const globalDiscounts = allDiscounts.filter((d: any) => d.scope === 'global' || !d.line_id);
    const globalCharges = allCharges.filter((c: any) => c.scope === 'global' || !c.line_id);

    const discounts: MappedGlobalAdjustment[] = globalDiscounts.map((d: any) => ({
        id: crypto.randomUUID(),
        type: 'discount',
        valueType: d.value_type === 'fixed' ? 'fixed' : 'percentage',
        value: Number(d.value ?? d.percent ?? 0),
        reason: d.reason || 'Descuento global',
    }));

    const charges: MappedGlobalAdjustment[] = globalCharges.map((c: any) => ({
        id: crypto.randomUUID(),
        type: 'charge',
        valueType: c.value_type === 'fixed' ? 'fixed' : 'percentage',
        value: Number(c.value ?? c.percent ?? 0),
        reason: c.reason || 'Cargo global',
    }));

    return [...discounts, ...charges];
}
