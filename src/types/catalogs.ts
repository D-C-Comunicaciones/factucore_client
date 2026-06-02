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
    percentage: number;
}

export interface Tax {
    id: number;
    name: string;
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