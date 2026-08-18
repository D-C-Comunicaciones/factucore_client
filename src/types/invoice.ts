export interface InvoiceLine {
    id: number;
    quantity: number;
    price_amount: number;
    description?: string;
    taxes?: InvoiceTax[];
    allowance_charges?: AllowanceCharge[];
}

export interface InvoiceTax {
    tax_id: number;
    type: string;
    rate: number;
}

export interface AllowanceCharge {
    scope: 'global' | 'line';
    value_type: 'percentage' | 'fixed';
    reason: string;
    charge_indicator: boolean;
    value: number;
    reason_code?: string;
}

export interface Invoice {
    id: number;
    resolution_id: number;
    contact_id: number;
    payment_form_id: number;
    payment_method_id: number;
    type_operation_invoice: number;
    type_operation_id?: number;
    payment_due_date: string;
    municipality_id: number;
    send_email: boolean;
    observation?: string;
    billing_period?: {
        start_date: string;
        start_time: string;
        end_date: string;
        end_time: string;
    };
    purchase_order_id?: number | null;
    delivery_note_id?: number | null;
    invoice_lines: InvoiceLine[];
    allowance_charges?: AllowanceCharge[];
    withholding_taxes?: any[];
    save_action?: string;
    invoice_status_id?: number;
    // Otros campos según el endpoint
}



// --- NUEVOS TIPOS PARA RESPUESTAS DE API ---


// Nueva respuesta de /invoices (findAll) según backend actualizado
export type InvoiceFindAllSuccess = {
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
    invoices: InvoiceSummary[];
    meta?: any;
};

export interface InvoiceFindAllEmpty {
    message: string;
    code: number;
    status: "success";
    data?: undefined;
}

export type InvoiceListData = {
    invoices: InvoiceSummary[];
    pagination: {
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
        from: number;
        to: number;
    };
    meta?: {
        suggestion?: string | null;
    };
};

// Resumen de factura para listado (según backend actualizado, campos planos en español)
export interface InvoiceSummary {
    id: number;
    number: string;
    contact: string;
    contact_id?: number;
    created_at: string;
    payment_due_date: string | null;
    total: string;
    pending_amount: number;
    total_iva?: number;
    status_dian: {
        id: number;
        code: string;
        name: string;
        description?: string;
        created_at?: string | null;
        updated_at?: string | null;
    } | string;
    status: {
        id: number;
        code: string;
        name: string;
        description?: string;
        created_at?: string | null;
        updated_at?: string | null;
    } | string;
    is_email_sent: boolean;
}

// Tipos para la respuesta de detalle de factura (según ejemplo real de backend)
export interface InvoiceDetailResponse {
    message: string;
    code: number;
    status: "success" | "error";
    data: {
        invoice?: any; // El nuevo formato viene directamente en invoice
        company?: InvoiceCompany;
        establishment?: InvoiceEstablishment;
        customer?: InvoiceCustomer;
        numbering_range?: InvoiceNumberingRange;
        billing_period?: InvoiceBillingPeriod;
        bill?: InvoiceBill;
        related_documents?: any[];
        items?: InvoiceItem[];
        allowance_charges?: any[];
        withholding_taxes?: any[];
        credit_notes?: any[];
        debit_notes?: any[];
        payments?: any[];
        payments_received?: any[];
        remissions?: any[];
    };
    dian?: InvoiceDian;
}

export interface InvoiceCompany {
    nit: string;
    dv: string | null;
    company: string;
    name: string;
    phone: string;
    email: string;
    direction: string;
    municipality: string;
}

export interface InvoiceEstablishment {
    name: string;
    address: string;
    phone_number: string;
    email: string;
    municipality: {
        id: number | null;
        code: string;
        name: string;
    };
}

export interface InvoiceCustomer {
    identification: string;
    dv: string | null;
    graphic_representation_name: string;
    company: string;
    names: string;
    address: string;
    email: string;
    phone: string;
}

export interface InvoiceNumberingRange {
    prefix: string;
    from: number;
    to: number;
    resolution_number: string;
    start_date: string;
    end_date: string;
}

export interface InvoiceBillingPeriod {
    start_date: string;
    start_time: string;
    end_date: string;
    end_time: string;
}

// Estado del procesamiento asíncrono de envío a la DIAN (armado XML/firma/envío en background).
// QUEUED/PROCESSING: aún no hay resultado final de la DIAN. SENT: ya se envió y respondió.
// FAILED: error técnico interno (no es un rechazo de la DIAN).
export type DianSubmissionStatus = "QUEUED" | "PROCESSING" | "SENT" | "FAILED";

export interface InvoiceBill {
    id: number;
    document: {
        code: string;
        name: string;
    };
    number: string;
    reference_code: string;
    status: number;
    send_email: boolean;
    dian_submission_status?: DianSubmissionStatus;
    dian_status_id?: number;
    qr: string;
    cufe: string;
    validated: string;
    gross_value: string;
    taxable_amount: string;
    tax_amount: string;
    discount_amount: string;
    surcharge_amount: string;
    total: string;
    observation: string;
    errors: any[];
    created_at: string;
    payment_due_date: string;
    has_claim: number;
    is_negotiable_instrument: number;
    payment_form: {
        code: string;
        name: string;
    };
    payment_method: {
        code: string;
        name: string;
    };
    public_url: string | null;
    payments?: any[];
    payments_received?: any[];
}

export interface InvoiceItem {
    scheme_id: number | null;
    note: string | null;
    code_reference: string;
    name: string;
    quantity: string;
    discount_rate: string;
    discount: string;
    gross_value: string;
    tax_rate: string;
    taxable_amount: string;
    tax_amount: string;
    price: string;
    is_excluded: number;
    unit_measure: {
        id: number;
        code: string;
        name: string;
    };
    standard_code: {
        id: number;
        code: string;
        name: string;
    };
    tribute: {
        id: number | null;
        code: string;
        name: string;
    };
    total: number;
    withholding_taxes: any[];
    mandate: any;
    additional_properties: any[];
}

export interface InvoiceDian {
    estado_documento: string;
    track_id: string | null;
    codigo_dian: string;
    mensaje_dian: string;
    errors: Array<{
        code: string;
        message: string;
        category: string;
        hint: string;
    }>;
}

// --- TIPOS LEGACY (pueden eliminarse si ya no se usan) ---
export interface InvoiceListItem {
    id: number;
    numero: string;
    cliente: string;
    fechaCreacion: string;
    fechaVencimiento: string;
    total: number;
    porCobrar: number;
    estadoDian: string;
    estado: string;
}
