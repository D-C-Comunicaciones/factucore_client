// Tipos habilitados hoy en el backend (Reminder::remindableTypeMap()) — ver recordatorios.md.
// Superset de CommentableType (agrega "contact", que el backend soporta para recordatorios
// pero no para comentarios) — se define aparte para no acoplar ambas features.
export type ReminderableType =
    | "invoice"
    | "credit_note"
    | "quotation"
    | "remission"
    | "payment"
    | "purchase_order"
    | "contact";

export interface ReminderUser {
    id: number;
    name: string;
    email: string;
}

export interface ReminderCreator {
    id: number;
    name: string;
}

export interface Reminder {
    id: number;
    title: string;
    due_at: string; // ISO 8601
    remindable_type: string; // alias corto en eventos de socket; FQCN completo en respuestas HTTP normales
    remindable_id: number;
    user: ReminderUser | null;
    created_by: ReminderCreator | null;
    notified_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface CreateReminderPayload {
    type: ReminderableType;
    remindable_id: number | string;
    title: string;
    date: string; // yyyy-MM-dd
    time: string; // HH:mm
    user_id: number;
}

export type UpdateReminderPayload = Omit<CreateReminderPayload, "type" | "remindable_id">;
