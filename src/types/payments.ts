export interface Payment {
    id: number;
    number: string;
    customer: string;
    customer_id?: number;
    contact_id?: number;
    created_at: string;
    account_name: string;
    payment_status: "No conciliado" | "Conciliado" | "Anulado" | string;
    amount: number | string;
}

export interface PaymentListResponse {
    data: Payment[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}
