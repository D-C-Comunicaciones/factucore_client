import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getEcho } from "@/lib/echo";
import { getSession } from "@/common/interfaces/session";
import { REMINDERS_KEY } from "./useReminders";
import type { ReminderableType, Reminder } from "@/types/reminder";

interface LiveReminderPayload {
    reminder: Reminder;
}

// Suscripción al canal en vivo de un documento (ver recordatorios.md): cualquiera
// con la pantalla de detalle abierta ve la lista de recordatorios actualizarse al
// instante — crear, editar (incluida reasignación) y eliminar, sin recargar.
export function useRemindersSocket(type: ReminderableType, remindableId: number | string | null | undefined) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!remindableId) return;

        const session = getSession() as any;
        const tenantId = session?.tenant_id;
        if (!tenantId) return;

        const echo = getEcho();
        if (!echo) return;

        const channelName = `tenant.${tenantId}.reminders.${type}.${remindableId}`;
        const channel = echo.private(channelName);

        // channelName lleva type+remindableId: dos documentos distintos (ej. invoice/2 vs
        // invoice/3, o invoice/2 vs remission/2) nunca comparten canal, así que un evento de
        // uno no puede aparecer en la vista del otro — ver también useCommentsSocket.ts.
        channel.subscribed(() => console.log(`[reminders-socket] suscrito: "${channelName}"`));
        channel.error((err: unknown) => console.error(`[reminders-socket] error suscribiendo "${channelName}"`, err));

        // reminder.created y reminder.updated mandan la misma forma de payload — un
        // solo handler de "upsert" sirve para ambos (ver recordatorios.md §2).
        const upsert = (label: string) => (payload: LiveReminderPayload) => {
            console.log(`[reminders-socket] ${label} en "${channelName}"`, { id: payload.reminder.id });
            queryClient.setQueryData<Reminder[]>(REMINDERS_KEY(type, remindableId), (old) => {
                if (!old) return old;
                const exists = old.some((r) => r.id === payload.reminder.id);
                if (exists) {
                    return old.map((r) => (r.id === payload.reminder.id ? payload.reminder : r));
                }
                return [payload.reminder, ...old];
            });
        };

        // El punto antes de ".reminder.created" es intencional: el evento se manda
        // con broadcastAs(), así que Echo NO debe anteponerle el namespace PHP.
        channel.listen(".reminder.created", upsert("reminder.created"));
        channel.listen(".reminder.updated", upsert("reminder.updated"));
        channel.listen(".reminder.deleted", (payload: LiveReminderPayload) => {
            console.log(`[reminders-socket] reminder.deleted en "${channelName}"`, { id: payload.reminder.id });
            queryClient.setQueryData<Reminder[]>(REMINDERS_KEY(type, remindableId), (old) =>
                old ? old.filter((r) => r.id !== payload.reminder.id) : old
            );
        });

        return () => {
            echo.leave(channelName);
        };
    }, [type, remindableId, queryClient]);
}
