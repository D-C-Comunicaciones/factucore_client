// Types for Factura de Compra (Bill) — a non-electronic record of a purchase invoice a
// supplier issued the tenant. Mirrors types/supportDocument.ts's conventions against the real
// backend contract (BillController / StoreBillRequest); never sent to DIAN.

export interface BillLineTax {
    tax_id: number;
    rate: number;
}

export interface BillAllowanceCharge {
    scope: "global" | "line";
    charge_indicator: boolean;
    value_type: "percentage" | "fixed";
    value: number;
    reason?: string;
    base_amount?: number;
}

export interface BillLineInput {
    item_id?: number | null;
    description?: string;
    quantity: number;
    price: number;
    taxes?: BillLineTax[];
    allowance_charges?: BillAllowanceCharge[];
}

export interface BillPayload {
    contact_id: number;
    bill_number?: string;
    issue_date: string;
    due_date?: string;
    currency_id?: number;
    payment_form_id?: number;
    warehouse_id?: number | null;
    cost_center_id?: number | null;
    physical_document_number?: string;
    terms_conditions?: string;
    notes?: string;
    lines: BillLineInput[];
    allowance_charges?: BillAllowanceCharge[];
    withholding_taxes?: { scope: "global" | "line"; tax_id: number; rate: number }[];
    save_action?: "DRAFT";
    bill_status_id?: number;
}

export interface BillStatusRef {
    id: number;
    code: string;
    name: string;
}

export interface BillContact {
    id: number;
    registration_name?: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    identification_number?: string;
    verification_digit?: string | number | null;
    email?: string;
    phone?: string;
}

export interface BillTaxRow {
    id: number;
    tax_id: number | null;
    tax_code?: string;
    name?: string;
    percent: number | string;
    taxable_amount: number | string;
    tax_amount: number | string;
}

export interface BillLine {
    id: number;
    bill_id: number;
    product_id: number | null;
    item_code?: string;
    description?: string;
    quantity: number | string;
    price: number | string;
    discount: number | string;
    line_extension_amount: number | string;
    total: number | string;
    item_snapshot?: Record<string, any> | null;
    taxes?: BillTaxRow[];
}

export interface BillPayment {
    id: number;
    bill_id: number;
    contact_id?: number | null;
    resolution_id?: number | null;
    payment_method_id?: number | null;
    account_id?: number | null;
    prefix?: string;
    number: number;
    amount: number | string;
    payment_date: string;
    notes?: string | null;
    contact?: BillContact;
    account?: { id: number; name: string } | null;
    payment_method?: { id: number; name: string } | null;
}

export interface BillDebitNote {
    id: number;
    bill_id: number;
    number: number;
    issue_date: string;
    reason: string;
    amount: number | string;
}

export interface Bill {
    id: number;
    contact_id: number;
    bill_number?: string | null;
    user_id?: number | null;
    bill_status_id: number;
    issue_date: string;
    due_date?: string | null;
    currency_id?: number | null;
    payment_form_id?: number | null;
    warehouse_id?: number | null;
    cost_center_id?: number | null;
    physical_document_number?: string | null;
    terms_conditions?: string | null;
    notes?: string | null;
    subtotal: number | string;
    discount_total: number | string;
    charge_total: number | string;
    tax_total: number | string;
    withholding_total: number | string;
    payable_amount: number | string;
    paid_amount: number | string;
    balance: number | string;
    total: number | string;
    created_at?: string;
    updated_at?: string;

    contact?: BillContact;
    bill_status?: BillStatusRef;
    lines?: BillLine[];
    discounts?: any[];
    charges?: any[];
    withholdings?: any[];
    payments?: BillPayment[];
    debit_notes?: BillDebitNote[];
}

export interface BillPagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface BillFindAllSuccess {
    pagination: BillPagination;
    bills: Bill[];
}

export interface BillDetailData {
    bill: Bill;
}

export interface StoreBillPaymentPayload {
    amount: number;
    payment_date?: string;
    payment_method_id?: number | null;
    account_id?: number | null;
    contact_id?: number | null;
    resolution_id?: number | null;
    notes?: string | null;
    accounting_lines?: { account_id: number; amount: number; description?: string }[];
}

export interface StoreBillDebitNotePayload {
    reason: string;
    amount: number;
    issue_date?: string;
}
