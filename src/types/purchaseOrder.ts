export interface PurchaseOrderAllowanceCharge {
    scope: "line" | "global";
    value_type: "percentage" | "fixed";
    charge_indicator: boolean;
    value: number;
    reason?: string;
}

export interface PurchaseOrderLineTax {
    rate: number;
    type: "percentage" | "fixed";
    name: string;
    tax_code?: string;
}

export interface PurchaseOrderLine {
    id?: number;
    item_id: number;
    name?: string;
    reference?: string;
    description: string;
    quantity: number;
    unit_price: number;
    // Request (lo que se envía)
    allowance_charges?: PurchaseOrderAllowanceCharge[];
    taxes?: PurchaseOrderLineTax[];
    // Response (lo que calcula el backend, ver GET/POST/PATCH)
    line_extension_amount?: number;
    discount_amount?: number;
    tax_amount?: number;
    line_total?: number;
    discounts?: any[];
    charges?: any[];
}

export type PurchaseOrderType = "internal" | "external";

export interface PurchaseOrder {
    id: number;
    type: PurchaseOrderType;
    contact_id: number;
    contact?: {
        id: number;
        name?: string;
        registration_name?: string;
        first_name?: string;
        last_name?: string;
        identification_number?: string;
        phone1?: string;
    } | string;
    resolution_id?: number | null;
    reference?: string | null;
    prefix?: string;
    number?: string | number;
    issue_date: string;
    delivery_date?: string | null;
    warehouse_id?: number | null;
    cost_center_id?: number | null;
    terms_and_conditions?: string;
    notes?: string;
    status: string;
    invoice_id?: number | null;
    items: PurchaseOrderLine[];
    // Alias que puede traer el detalle en vez de "items"
    lines?: PurchaseOrderLine[];
    // Ajustes globales del documento (request y/o detalle)
    allowance_charges?: PurchaseOrderAllowanceCharge[];
    global_charges?: any[];
    global_discounts?: any[];
    // Totales calculados por el backend — no recalcular en el frontend
    line_extension_amount?: number;
    discount_total?: number;
    charge_total?: number;
    tax_total?: number;
    total?: number;
    created_at?: string;
    updated_at?: string;
}

export interface PurchaseOrderSummary {
    id: number;
    type: PurchaseOrderType;
    reference?: string | null;
    prefix?: string;
    number?: string | number;
    contact: string;
    issue_date: string;
    created_at: string;
    total: string | number;
    status: string;
    invoice_id?: number | null;
}

export interface PurchaseOrderPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number;
    to: number;
}

export type PurchaseOrderListData = {
    purchase_orders: PurchaseOrderSummary[];
    pagination: PurchaseOrderPagination;
};
