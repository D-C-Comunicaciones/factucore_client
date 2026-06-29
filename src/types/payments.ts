export interface Payment {
    id: number;
    number: string;
    client: string;
    created_at: string;
    bank_account: string;
    payment_status: "No conciliado" | "Conciliado" | "Anulado";
    amount: number;
}

export interface PaymentListResponse {
    data: Payment[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}
