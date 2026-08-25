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
 * Reconstructs builder line items (used by useRemissionBuilder, which shares the same
 * InvoiceLine shape as useInvoiceBuilder/useQuoteBuilder) from a remission's raw item data.
 * Mirrors the same field fallbacks used to display these items in the remission detail view
 * (RemissionDetailDocument.tsx), so the target document ends up with the same products,
 * quantities, prices, line discounts and line taxes as the source remission.
 */
export function mapRemissionItemsToLines(items: any[]): MappedLine[] {
    return (items || []).map((item: any) => {
        const itemName = item.name || item.item_name || item.item?.name || item.description || '';
        // OJO: `item.id` es el id de la LÍNEA de la remisión, no del ítem del catálogo
        // (por eso no se usa aquí) — usarlo como fallback hacía que se enviara un item_id
        // inexistente al convertir a factura (ej. línea 1 -> item_id 1, aunque el producto
        // real tenga otro id), y el backend rechazaba la factura con 422.
        const itemId = item.item_id || item.item?.id || null;
        const itemRef = item.code_reference || item.item_code || item.standard_item_code || item.code || '';
        const itemPrice = Number(item.price || item.price_amount || 0);
        const itemQty = Number(item.quantity || 1);
        const unitMeasureCode = item.unit_measure?.code || item.unit_measure_code || '94';

        // Line discount: prefer the raw allowance_charge/discount entry so the value & type match the remission exactly
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

        // item_snapshot es una foto de nombre/precio al momento de crear la remisión,
        // NO trae stock en vivo — usarlo para resolver stock hacía que todo ítem convertido
        // a factura apareciera "agotado" de inmediato (stock_quantity quedaba null -> 0).
        // Se deja la línea en estado neutro (sin validar) hasta que se refresque con el
        // stock real del ítem (ver el efecto de refresco en invoices/new/page.tsx).
        const is_inventoriable = false;
        const allow_negative_stock = false;
        const stock_quantity: number | null = null;

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
            stock_quantity,
            is_inventoriable,
            allow_negative_stock,
            selected_warehouse_id: item.warehouse_id ?? item.selected_warehouse_id ?? null,
        };
    });
}

/**
 * Reconstructs global (document-level) discounts/charges from a remission, mirroring
 * the same field fallbacks used in RemissionDetailDocument.tsx to compute remission totals.
 */
export function mapRemissionGlobalAdjustments(remission: any): MappedGlobalAdjustment[] {
    const allDiscounts = remission?.global_discounts || remission?.discounts || remission?.allowance_charges?.filter((ac: any) => ac.charge_indicator === false) || [];
    const allCharges = remission?.global_charges || remission?.charges || remission?.allowance_charges?.filter((ac: any) => ac.charge_indicator === true) || [];

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
