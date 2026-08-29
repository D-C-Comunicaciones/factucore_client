export interface SupportDocumentTax {
    tax_id: number;
    type?: string;
    rate: number;
    name?: string;
    code?: string;
}

export interface SupportDocumentWithholding {
    id?: string;
    retention_id?: number | string;
    name?: string;
    code?: string;
    percentage?: number;
    base: number;
    value: number;
    is_assumed: boolean;
}

export interface SupportDocumentLine {
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
    taxes?: SupportDocumentTax[];
    allowance_charges?: any[];
}

export interface SupportDocument {
    id: number;
    resolution_id: number;
    contact_id: number;
    supplier_id?: number;
    payment_form_id: number;
    payment_method_id: number;
    payment_due_date?: string;
    operation_date?: string;
    physical_receipt_number?: string;
    cost_center_id?: number;
    currency_id?: number | string;
    warehouse_id?: number;
    seller_id?: number;
    purchase_order_id?: number | null;
    authorization_text?: string;
    notes?: string;
    observation?: string;
    items?: any[];
    support_document_lines?: any[];
    withholdings?: SupportDocumentWithholding[];
    payments?: any[];
    save_action?: string;
    status_dian?: any;
    status?: any;
    created_at?: string;
    updated_at?: string;
}

export interface SupportDocumentSummary {
    id: number;
    number: string;
    prefix?: string;
    supplier_name: string;
    supplier_identification?: string;
    supplier_phone?: string;
    contact_id?: number;
    created_at: string;
    operation_date?: string;
    payment_due_date: string | null;
    total: number | string;
    subtotal?: number | string;
    withholdings_total?: number | string;
    status_dian: {
        id?: number;
        code?: string;
        name: string;
        description?: string;
    } | string;
    status: {
        id?: number;
        code?: string;
        name: string;
    } | string;
}

export type SupportDocumentFindAllSuccess = {
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
    support_documents: SupportDocumentSummary[];
    meta?: any;
};

export type SupportDocumentDetailResponse = {
    data: SupportDocument;
    support_document?: SupportDocument;
    bill?: any;
};
