/**
 * Reglas centralizadas para decidir cuándo un ítem (producto, servicio o combo)
 * debe validarse contra el stock disponible al agregarlo a una factura, cotización
 * o remisión. Se usa tanto al seleccionar el ítem (datos crudos del API) como al
 * renderizar la fila del builder (datos ya aplanados en la línea).
 *
 * Regla: solo se valida stock para productos inventariables que NO acepten venta
 * en negativo. Los servicios nunca se validan. Los combos se validan a través del
 * stock de sus componentes tipo producto (los componentes tipo servicio se ignoran).
 */

const SERVICE_CODE = "SERVICE";
const COMBO_CODE = "COMBO";

export function isServiceItem(item: any): boolean {
    if (!item) return false;
    const code = item.type_item?.code;
    if (code) return code === SERVICE_CODE;
    return item.type_item_id === 2;
}

export function isComboItem(item: any): boolean {
    if (!item) return false;
    const code = item.type_item?.code;
    if (code) return code === COMBO_CODE;
    return item.type_item_id === 3;
}

/**
 * Para un producto individual (no combo, no servicio): ¿debe validarse su propio stock?
 */
export function requiresOwnStockCheck(item: any): boolean {
    if (!item || isServiceItem(item) || isComboItem(item)) return false;
    const isInventoriable = item.is_inventoriable ?? true;
    if (!isInventoriable) return false;
    if (item.allow_negative_stock) return false;
    return true;
}

function getComboComponents(item: any): any[] {
    return (
        item?.combo_settings?.components ||
        item?.components ||
        item?.combo_items ||
        item?.combo_components ||
        []
    );
}

/**
 * Unidades de combo que alcanzan a construirse con el stock actual de sus componentes
 * tipo producto (ignorando componentes de tipo servicio, que no son inventariables).
 * Devuelve null si el combo no trae componentes que deban validarse.
 */
export function getComboAvailableUnits(item: any): number | null {
    const components = getComboComponents(item);
    if (!components.length) return null;

    let limitingUnits: number | null = null;

    for (const comp of components) {
        const child = comp?.child_item || comp?.item || comp?.product || comp;
        if (!requiresOwnStockCheck(child)) continue;

        const perComboQty = Number(comp?.quantity) || 1;
        const availableStock = Number(child?.stock_quantity ?? 0);
        const buildableUnits = perComboQty > 0 ? Math.floor(availableStock / perComboQty) : Infinity;

        limitingUnits = limitingUnits === null ? buildableUnits : Math.min(limitingUnits, buildableUnits);
    }

    return limitingUnits;
}

/**
 * A partir de un ítem crudo (respuesta de GET /items), calcula los campos "planos"
 * que deben guardarse en la línea del builder para que la validación de stock
 * funcione igual sin importar si es producto, servicio o combo.
 */
export function resolveStockFields(rawItem: any): {
    is_inventoriable: boolean;
    allow_negative_stock: boolean;
    stock_quantity: number | null;
} {
    if (isServiceItem(rawItem)) {
        return { is_inventoriable: false, allow_negative_stock: false, stock_quantity: null };
    }

    if (isComboItem(rawItem)) {
        const comboUnits = getComboAvailableUnits(rawItem);
        if (comboUnits === null) {
            // Combo sin componentes inventariables (ej. solo servicios): no se valida.
            return { is_inventoriable: false, allow_negative_stock: false, stock_quantity: null };
        }
        return { is_inventoriable: true, allow_negative_stock: false, stock_quantity: comboUnits };
    }

    const isInventoriable = rawItem?.is_inventoriable ?? true;
    return {
        is_inventoriable: isInventoriable,
        allow_negative_stock: rawItem?.allow_negative_stock ?? false,
        stock_quantity: rawItem?.stock_quantity ?? null,
    };
}

/**
 * Ya con la línea aplanada del builder (is_inventoriable / allow_negative_stock ya resueltos
 * por resolveStockFields), decide si debe validarse la cantidad contra el stock disponible.
 */
export function shouldValidateLineStock(line: any): boolean {
    return !!line?.item_id && !!line?.is_inventoriable && !line?.allow_negative_stock;
}
