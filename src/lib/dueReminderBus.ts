// Puente entre useNotificationsSocket() (donde llega el evento "reminder_due" por WebSocket,
// dentro de un hook sin JSX propio) y <DueReminderPopup /> (montado una sola vez en el layout
// raíz, ver src/app/layout.tsx) — el popup de recordatorio vencido tiene que verse sin importar
// en qué página esté el usuario, así que no puede vivir dentro de un componente de una pantalla
// en particular. Mismo patrón de singleton por módulo que src/lib/echo.ts.

export interface DueReminderPayload {
    reminderId: number;
    title: string;
    dueAtLabel: string;
    remindableType: string;
    remindableId: number;
}

type Listener = (payload: DueReminderPayload) => void;

let listeners: Listener[] = [];

export function emitDueReminder(payload: DueReminderPayload): void {
    listeners.forEach((listener) => listener(payload));
}

export function onDueReminder(listener: Listener): () => void {
    listeners.push(listener);
    return () => {
        listeners = listeners.filter((l) => l !== listener);
    };
}
