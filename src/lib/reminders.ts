import { apiClient } from "@/lib/api-client";
import type {
    ReminderableType,
    Reminder,
    CreateReminderPayload,
    UpdateReminderPayload,
} from "@/types/reminder";

// recordatorios.md documenta estos endpoints devolviendo la data "cruda" (sin el
// envelope {status,code,message,data} que usa el resto de la API) — normalizamos
// ambos casos igual que en lib/comments.ts, por si el contrato real termina
// envolviendo la respuesta.

function unwrapArray<T>(raw: any): T[] {
    for (const body of [raw, raw?.data]) {
        if (!body) continue;
        if (Array.isArray(body)) return body;
        if (Array.isArray(body.data)) return body.data;
        if (Array.isArray(body.reminders)) return body.reminders;
    }
    return [];
}

function unwrapReminder(raw: any): Reminder {
    if (raw?.id != null) return raw as Reminder;
    if (raw?.data?.id != null) return raw.data as Reminder;
    return raw;
}

export class RemindersService {
    /**
     * GET /reminders?type=...&remindable_id=...
     */
    static async list(type: ReminderableType, remindableId: number | string): Promise<Reminder[]> {
        const qs = new URLSearchParams({ type, remindable_id: String(remindableId) }).toString();
        const raw = await apiClient.get(`/reminders?${qs}`);
        return unwrapArray<Reminder>(raw);
    }

    /**
     * POST /reminders
     */
    static async create(payload: CreateReminderPayload): Promise<Reminder> {
        const raw = await apiClient.post("/reminders", payload);
        return unwrapReminder(raw);
    }

    /**
     * PUT /reminders/{id}
     */
    static async update(id: number, payload: UpdateReminderPayload): Promise<Reminder> {
        const raw = await apiClient.put(`/reminders/${id}`, payload);
        return unwrapReminder(raw);
    }

    /**
     * DELETE /reminders/{id}
     */
    static async remove(id: number): Promise<void> {
        await apiClient.delete(`/reminders/${id}`);
    }
}
