export interface Country {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

export interface Department {
    id: number;
    country_id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

export interface Municipality {
    id: number;
    department_id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
}

export interface TypeDocumentIdentification {
    id: number;
    name: string;
    code: string;
    abbreviation: string;
    created_at: string;
    updated_at: string;
}

export interface Plan {
    id: number;
    name: string;
    description: string;
    is_unlimited: boolean;
    has_unlimited_documents: boolean;
    has_unlimited_users: boolean;
    has_unlimited_amount: boolean;
    max_documents: number;
    max_users: number;
    max_amount: string;
    price: string;
    is_active: boolean;
    sort_order: number;
    tenants_count: number;
    active_tenants_count: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface Warehouse {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface TaxRate {
    id: number;
    name: string;
    code: string;
}

// Referencia liviana a una cuenta del catálogo contable, tal como la devuelven las relaciones
// payableAccount/discountableAccount/receivableAccount (ver app/Models/Account.php en el backend).
export interface CatalogAccountRef {
    id: number;
    code: string;
    name: string;
    nature: "debito" | "credito";
}

export interface Tax {
    id: number;
    code: string;
    name: string;
    description: string | null;
    tax_rates?: TaxRate[];
    // Cuenta pasiva — impuesto generado en ventas (ej. IVA/ICA/INC por pagar).
    payable_account_id: number | null;
    payable_account: CatalogAccountRef | null;
    // Cuenta activa — impuesto descontable en compras (típicamente solo IVA).
    discountable_account_id: number | null;
    discountable_account: CatalogAccountRef | null;
}

export interface WithholdingRateItem {
    id: number;
    name: string;
    rate: number;
    type: string;
}

export interface Withholding {
    id: number;
    code: string;
    name: string;
    rates: WithholdingRateItem[];
    // Cuenta pasiva — retención practicada a un proveedor (Bill/Documento Soporte).
    payable_account_id: number | null;
    payable_account: CatalogAccountRef | null;
    // Cuenta activa — retención sufrida por un cliente (Factura de venta).
    receivable_account_id: number | null;
    receivable_account: CatalogAccountRef | null;
}

export interface UpdateTaxAccountsPayload {
    payable_account_id?: number | null;
    discountable_account_id?: number | null;
}

export interface UpdateWithholdingAccountsPayload {
    payable_account_id?: number | null;
    receivable_account_id?: number | null;
}

export interface UnitMeasure {
    id: number;
    name: string;
    code: string;
}

export interface StandardCode {
    id: number;
    code: string;
    name: string;
}

export interface Attribute {
    id: number;
    name: string;
}

export interface CustomField {
    id: number;
    name: string;
    type: string;
}

export interface TypeCustomField {
    id: number;
    name: string;
}

export interface PriceList {
    id: number;
    name: string;
}