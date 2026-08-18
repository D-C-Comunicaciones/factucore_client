// Solo UI por ahora — no hay endpoint de recordatorios todavía, ver
// components/shared/reminder/RemindersPanel.tsx.
export interface ReminderRecipient {
    id: number;
    name: string;
    email: string;
}

export interface Reminder {
    id: string;
    title: string;
    date: string; // yyyy-mm-dd (formato de <input type="date">)
    time: string; // HH:mm
    recipient: ReminderRecipient;
    done?: boolean;
}
