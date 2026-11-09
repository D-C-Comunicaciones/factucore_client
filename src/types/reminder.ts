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
    | "contact"
    | "support_document";

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
    // Forma inconsistente entre el fetch inicial (GET /reminders, modelo Eloquent crudo: aquí
    // created_by es el entero de la columna FK, y el objeto del creador viaja aparte en
    // `creator`) y los eventos en vivo (App\Events\ReminderBroadcastEvent::broadcastWith(), que
    // arma `created_by` como {id,name} y no manda `creator`). getReminderCreatorId() de abajo
    // abstrae la diferencia — no leer created_by/creator directo fuera de ese helper.
    created_by: ReminderCreator | number | null;
    creator?: ReminderCreator | null;
    notified_at: string | null;
    created_at: string;
    updated_at: string;
}

// Ver el comentario en Reminder.created_by: el id de quien creó el recordatorio puede venir
// como número crudo (fetch inicial) o como objeto (eventos en vivo) — este helper normaliza
// ambos casos para saber si el usuario actual puede editar/eliminar (ver ReminderService::
// update()/delete() en el backend, que ya exigen lo mismo del lado del servidor).
export function getReminderCreatorId(reminder: Reminder): number | undefined {
    if (typeof reminder.created_by === "number") return reminder.created_by;
    if (reminder.created_by && typeof reminder.created_by === "object") return reminder.created_by.id;
    return reminder.creator?.id;
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
