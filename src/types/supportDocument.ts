// Types for the Documento Soporte (Support Document) module. Mirror the ACTUAL backend
// contract exposed by SupportDocumentController/StoreSupportDocumentRequest — not a guess.
// `contact` here is the seller/SNO (subject not obligated to invoice); the buyer/signer is
// always the current tenant, so there is no separate "customer" field like Invoice has.

export interface SupportDocumentLineTax {
    tax_id: number;
    rate: number;
}

export interface AllowanceCharge {
    scope: "global" | "line";
    charge_indicator: boolean;
    value_type: "percentage" | "fixed";
    value: number;
    reason?: string;
    base_amount?: number;
    invoice_line_index?: number | null;
}

export interface WithholdingTaxInput {
    scope: "global" | "line";
    tax_id: number;
    rate: number;
}

// Payload shape for POST/PATCH /support-documents (matches StoreSupportDocumentRequest).
export interface SupportDocumentLineInput {
    item_id?: number | null;
    description?: string;
    quantity: number;
    price: number;
    purchase_date?: string;
    generation_mode_code?: "1" | "2";
    taxes?: SupportDocumentLineTax[];
    allowance_charges?: AllowanceCharge[];
    withholding_taxes?: WithholdingTaxInput[];
}

export interface SupportDocumentPayload {
    contact_id: number;
    resolution_id?: number | null;
    issue_date: string; // YYYY-MM-DD
    issue_time?: string; // HH:mm:ss
    due_date?: string;
    currency_id?: number;
    seller_origin_code?: "10" | "11";
    note?: string;
    order_reference_id?: string;
    order_reference_date?: string;
    lines: SupportDocumentLineInput[];
    allowance_charges?: AllowanceCharge[];
    withholding_taxes?: WithholdingTaxInput[];
    save_action?: "DRAFT";
    support_document_status_id?: number;
}

// --- Read models (as returned by the API, English field names, snake_case relations) ---

export interface SupportDocumentStatusRef {
    id: number;
    code: string;
    name: string;
    description?: string;
    color?: string | null;
}

export interface DianStatusRef {
    id: number;
    code: string;
    name: string;
    description?: string;
}

export interface SupportDocumentContact {
    id: number;
    registration_name?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    identification_number?: string;
    verification_digit?: string | number | null;
    email?: string;
    phone?: string;
    address?: string;
}

export interface SupportDocumentResolutionRef {
    id: number;
    prefix?: string;
    resolution_number?: string;
    from_number?: number;
    to_number?: number;
    current_number?: number;
    valid_from?: string;
    valid_to?: string;
}

export interface SupportDocumentTax {
    id: number;
    tax_id: number | null;
    tax_code?: string;
    name?: string;
    percent: number | string;
    taxable_amount: number | string;
    tax_amount: number | string;
}

export interface SupportDocumentLine {
    id: number;
    support_document_id: number;
    product_id: number | null;
    item_code?: string;
    description?: string;
    unit_measure_id?: number | null;
    quantity: number | string;
    price: number | string;
    discount: number | string;
    charge: number | string;
    line_extension_amount: number | string;
    taxable_amount: number | string;
    subtotal: number | string;
    total: number | string;
    sort_order?: number;
    item_snapshot?: Record<string, any> | null;
    taxes?: SupportDocumentTax[];
}

export interface SupportDocumentDiscount {
    id: number;
    support_document_line_id: number | null;
    type_discount_id?: number;
    charge_indicator: boolean;
    amount: number | string;
    percent: number | string;
    base_amount: number | string;
    reason?: string;
}

export interface SupportDocumentCharge {
    id: number;
    scope: "global" | "line";
    support_document_line_id: number | null;
    charge_type?: string;
    charge_indicator: boolean;
    reason?: string;
    amount: number | string;
    base_amount: number | string;
    percent: number | string;
    calculated_amount: number | string;
}

export interface SupportDocumentPayment {
    id: number;
    support_document_id: number;
    contact_id?: number | null;
    resolution_id?: number | null;
    payment_method_id?: number | null;
    account_id?: number | null;
    prefix?: string;
    number: number;
    amount: number | string;
    payment_date: string;
    notes?: string | null;
    user_id?: number | null;
    created_at?: string;
    contact?: SupportDocumentContact;
    account?: { id: number; name: string } | null;
    payment_method?: { id: number; name: string } | null;
}

export interface SupportDocument {
    id: number;
    contact_id: number;
    user_id?: number | null;
    resolution_id: number;
    support_document_status_id: number;
    prefix?: string;
    number: number;
    issue_date: string;
    issue_time?: string;
    due_date?: string | null;
    currency_id: number;
    seller_origin_code: string;
    note?: string | null;
    order_reference_id?: string | null;
    order_reference_date?: string | null;
    origin_adjustment_note_id?: number | null;
    subtotal: number | string;
    discount_total: number | string;
    charge_total: number | string;
    tax_total: number | string;
    withholding_total: number | string;
    payable_amount: number | string;
    paid_amount: number | string;
    balance: number | string;
    total: number | string;
    xml_path?: string | null;
    cuds?: string | null;
    dian_status_id: number;
    dian_rejection_reason?: string | null;
    dian_submission_status?: string | null;
    origin_channel?: string | null;
    created_at?: string;
    updated_at?: string;

    contact?: SupportDocumentContact;
    resolution?: SupportDocumentResolutionRef;
    support_document_status?: SupportDocumentStatusRef;
    dian_status?: DianStatusRef;
    lines?: SupportDocumentLine[];
    discounts?: SupportDocumentDiscount[];
    charges?: SupportDocumentCharge[];
    payments?: SupportDocumentPayment[];
    adjustment_notes?: any[];
}

export interface SupportDocumentPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

// GET /support-documents -> wrapped by ResponseMiddleware into { data: { pagination, support_documents } }
export interface SupportDocumentFindAllSuccess {
    pagination: SupportDocumentPagination;
    support_documents: SupportDocument[];
}

// GET /support-documents/{id} -> wrapped into { data: { support_document } }
export interface SupportDocumentDetailData {
    support_document: SupportDocument;
}

export interface SupportDocumentSendTestResult {
    message?: string;
    success: boolean;
    zipKey?: string | null;
    dian_status?: string | null;
    errors?: any[];
    dian_response?: Record<string, any>;
    xml?: string | null;
    cuds?: string | null;
    support_document?: SupportDocument;
}

export interface StoreSupportDocumentPaymentPayload {
    amount: number;
    payment_date?: string;
    payment_method_id?: number | null;
    account_id?: number | null;
    contact_id?: number | null;
    resolution_id?: number | null;
    notes?: string | null;
    accounting_lines?: { account_id: number; amount: number; description?: string }[];
}
