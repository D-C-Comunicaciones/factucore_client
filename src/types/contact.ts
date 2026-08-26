// Forma real devuelta por GET/PATCH /contacts/{id} (ver App\Http\Controllers\Api\ContactController@show
// en el backend). Los campos de catálogo (municipality, seller, etc.) llegan como objeto cuando la
// relación fue cargada por el backend; se tipan `any` porque este módulo no tiene tipos de catálogo propios.

export interface AssociatedPerson {
    id?: string;
    first_name: string;
    last_name?: string;
    email?: string;
    mobile?: string;
    phone?: string;
    send_notifications?: boolean;
}

export interface Contact {
    id: number;
    registration_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;

    identification_number: number | string;
    verification_digit?: number | null;
    type_document_identification_id?: number | null;

    type_organization_id?: number | null;
    type_regime_id?: number | null;

    email: string;
    phone1?: string | null;
    phone2?: string | null;
    mobile?: string | null;

    address?: string | null;
    postal_code?: string | null;
    municipality_id?: number | null;
    country_id?: number | null;
    city?: string | null;

    payment_term_id?: number | null;
    price_list_id?: number | null;
    seller_id?: number | null;
    accounts_receivable_account_id?: number | null;
    accounts_payable_account_id?: number | null;
    associated_person?: AssociatedPerson[] | null;
    send_account_statement?: boolean;

    commercial_registration?: string | null;
    is_active?: boolean;
    deleted_at?: string | null;

    type_contacts?: any[];
    type_liabilities?: any[];
    municipality?: any;
    country?: any;
    seller?: any;
    payment_term?: any;
    accounts_receivable_account?: any;
    accounts_payable_account?: any;
    type_document_identification?: any;
    type_organization?: any;
    type_regime?: any;
    comments?: any[];

    created_at?: string;
    updated_at?: string;
}

// Un renglón de cualquiera de las listas en `ContactDocuments` — la forma exacta
// varía un poco por tipo (ver ContactService::buildDocuments en el backend), por
// eso los campos específicos de cada tipo son opcionales acá.
export interface ContactDocumentItem {
    id: number;
    number: string;
    issue_date?: string | null;
    payment_date?: string | null;
    total?: number;
    amount?: number;
    paid_amount?: number;
    balance?: number;
    status?: string | null;
    invoice_id?: number | null;
    is_advance?: boolean;
    payment_method?: string | null;
}

export interface ContactDocuments {
    invoices: ContactDocumentItem[];
    credit_notes: ContactDocumentItem[];
    remissions: ContactDocumentItem[];
    quotations: ContactDocumentItem[];
    purchase_orders: ContactDocumentItem[];
    payments: ContactDocumentItem[];
}

// Tarjetas de resumen del encabezado. Solo se calculan los conceptos con datos
// reales detrás (facturas de venta, pagos y notas crédito) — no hay todavía en
// el sistema facturas de proveedor / notas débito / anticipos entregados.
export interface ContactSummary {
    accounts_receivable: number;
    advances_received: number;
    credit_notes_available: number;
}

export interface ContactDetailResponse {
    contact: Contact;
    documents: ContactDocuments;
    summary: ContactSummary;
}
