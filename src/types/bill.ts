export interface BillLine {
    id: string;
    item_id?: number | string | null;
    item?: string;
    description?: string;
    referencia?: string;
    cantidad: number | string;
    precio: number | string;
    discountValue?: number | string;
    discountType?: "percentage" | "fixed";
    taxObj?: {
        id?: number | string;
        name?: string;
        rate?: number | string;
        percentage?: number | string;
    } | null;
}

export interface BillWithholding {
    id?: string;
    retention_id?: number | string;
    name?: string;
    percentage?: number;
    base?: number;
    value?: number;
    is_assumed?: boolean;
    accounting_account_id?: string;
}

export interface BillPurchaseOrder {
    id: string;
    purchase_order_id?: number | string;
    items?: any[];
}

export interface BillGlobalAdjustment {
    id: number;
    type: "discount" | "charge";
    valueType: "percentage" | "fixed";
    value: number;
    reason?: string;
}

export interface Bill {
    id: number;
    prefix?: string;
    number?: number | string;
    consecutive?: string;
    bill_number?: string;
    contact_id: number;
    supplier?: any;
    contact?: any;
    issue_date?: string;
    due_date?: string;
    payment_form_id?: number;
    payment_method_id?: number;
    payment_terms?: string;
    warehouse_id?: number | null;
    cost_center_id?: number | null;
    currency_id?: number | null;
    terms_conditions?: string;
    notes?: string;
    items: BillLine[];
    withholdings?: BillWithholding[];
    purchase_orders?: BillPurchaseOrder[];
    global_adjustments?: BillGlobalAdjustment[];
    subtotal: number;
    discounts_total?: number;
    taxes_total?: number;
    withholdings_total?: number;
    total: number;
    paid_amount?: number;
    pending_amount?: number;
    status?: string;
    created_at?: string;
    updated_at?: string;
}

export interface BillFindAllSuccess {
    success: boolean;
    data: {
        bills: Bill[];
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
            from: number;
            to: number;
        };
    };
}

export interface BillDetailResponse {
    success: boolean;
    data: {
        bill: Bill;
    };
}
