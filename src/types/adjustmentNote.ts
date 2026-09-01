// Types for the Nota de Ajuste (Adjustment Note) module — corrects or voids a Support Document.
// Mirrors types/supportDocument.ts's conventions against the actual backend contract
// (AdjustmentNoteController / StoreAdjustmentNoteRequest).

export interface AdjustmentNoteLineTax {
    tax_id: number;
    rate: number;
}

export interface AdjustmentNoteAllowanceCharge {
    scope: "global" | "line";
    charge_indicator: boolean;
    value_type: "percentage" | "fixed";
    value: number;
    reason?: string;
    base_amount?: number;
}

export interface AdjustmentNoteLineInput {
    item_id?: number | null;
    support_document_line_id?: number | null;
    description?: string;
    quantity: number;
    price: number;
    taxes?: AdjustmentNoteLineTax[];
    allowance_charges?: AdjustmentNoteAllowanceCharge[];
}

// DIAN "Concepto de Corrección" catalog codes (type_adjustment_notes). '2' is a full annulment;
// everything else is treated as a partial correction in the UI.
export const ADJUSTMENT_NOTE_ANNULMENT_CODE = "2";

export interface AdjustmentNotePayload {
    support_document_id: number;
    type_adjustment_note_id: number;
    resolution_id?: number | null;
    contact_id?: number | null;
    issue_date: string;
    issue_time?: string;
    currency_id?: number;
    seller_origin_code?: "10" | "11";
    note?: string;
    observation?: string;
    discrepancy_reference_id?: string;
    discrepancy_response_description?: string;
    lines: AdjustmentNoteLineInput[];
    allowance_charges?: AdjustmentNoteAllowanceCharge[];
}

export interface TypeAdjustmentNoteRef {
    id: number;
    code: string;
    name: string;
    description?: string;
}

export interface AdjustmentNoteStatusRef {
    id: number;
    code: string;
    name: string;
}

export interface DianStatusRef {
    id: number;
    code: string;
    name: string;
}

export interface AdjustmentNoteContact {
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

export interface AdjustmentNoteResolutionRef {
    id: number;
    prefix?: string;
    resolution_number?: string;
    resolution_text?: string;
}

export interface AdjustmentNoteSupportDocumentRef {
    id: number;
    prefix?: string;
    number?: number;
    cuds?: string | null;
    payable_amount?: number | string;
    contact?: AdjustmentNoteContact;
}

export interface AdjustmentNoteTax {
    id: number;
    tax_id: number | null;
    tax_code?: string;
    name?: string;
    percent: number | string;
    taxable_amount: number | string;
    tax_amount: number | string;
}

export interface AdjustmentNoteLine {
    id: number;
    adjustment_note_id: number;
    support_document_line_id: number | null;
    product_id: number | null;
    item_code?: string;
    description?: string;
    quantity: number | string;
    price: number | string;
    discount: number | string;
    line_extension_amount: number | string;
    total: number | string;
    item_snapshot?: Record<string, any> | null;
    taxes?: AdjustmentNoteTax[];
}

export interface AdjustmentNote {
    id: number;
    support_document_id: number;
    contact_id?: number | null;
    user_id?: number | null;
    resolution_id: number;
    type_adjustment_note_id: number;
    adjustment_note_status_id: number;
    prefix?: string;
    number: number;
    issue_date: string;
    issue_time?: string;
    currency_id?: number;
    seller_origin_code?: string;
    note?: string | null;
    observation?: string | null;
    discrepancy_reference_id?: string | null;
    discrepancy_response_code?: string | null;
    discrepancy_response_description?: string | null;
    subtotal: number | string;
    discount_total: number | string;
    charge_total: number | string;
    tax_total: number | string;
    payable_amount: number | string;
    total: number | string;
    xml_path?: string | null;
    cuds?: string | null;
    dian_status_id: number;
    dian_rejection_reason?: string | null;
    dian_submission_status?: string | null;
    created_at?: string;
    updated_at?: string;

    contact?: AdjustmentNoteContact;
    resolution?: AdjustmentNoteResolutionRef;
    support_document?: AdjustmentNoteSupportDocumentRef;
    type_adjustment_note?: TypeAdjustmentNoteRef;
    adjustment_note_status?: AdjustmentNoteStatusRef;
    dian_status?: DianStatusRef;
    lines?: AdjustmentNoteLine[];
    discounts?: any[];
    charges?: any[];
}

export interface AdjustmentNotePagination {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    from: number | null;
    to: number | null;
}

export interface AdjustmentNoteFindAllSuccess {
    pagination: AdjustmentNotePagination;
    adjustment_notes: AdjustmentNote[];
}

export interface AdjustmentNoteDetailData {
    adjustment_note: AdjustmentNote;
}

export interface AdjustmentNoteSendTestResult {
    message?: string;
    success: boolean;
    zipKey?: string | null;
    dian_status?: string | null;
    errors?: any[];
    dian_response?: Record<string, any>;
    xml?: string | null;
    cuds?: string | null;
    adjustment_note?: AdjustmentNote;
}
