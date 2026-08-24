import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { RemindersService } from "@/lib/reminders";
import { showToast } from "@/components/sonner/CustomToaster";
import { extractErrorMessage } from "@/lib/errors";
import type { ReminderableType, CreateReminderPayload, UpdateReminderPayload } from "@/types/reminder";

export const REMINDERS_KEY = (type: ReminderableType, remindableId: number | string) =>
    ["reminders", type, String(remindableId)] as const;

export function useRemindersList(type: ReminderableType, remindableId: number | string | null | undefined) {
    return useQuery({
        queryKey: REMINDERS_KEY(type, remindableId ?? "none"),
        queryFn: () => RemindersService.list(type, remindableId as number | string),
        enabled: !!remindableId,
        staleTime: 0,
        refetchOnWindowFocus: false,
    });
}

export function useCreateReminder(type: ReminderableType, remindableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Omit<CreateReminderPayload, "type" | "remindable_id">) =>
            RemindersService.create({ type, remindable_id: remindableId, ...payload }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REMINDERS_KEY(type, remindableId) });
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al crear el recordatorio", "error");
        },
    });
}

export function useUpdateReminder(type: ReminderableType, remindableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id: number; payload: UpdateReminderPayload }) =>
            RemindersService.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REMINDERS_KEY(type, remindableId) });
            showToast("Recordatorio actualizado correctamente", "success");
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al editar el recordatorio", "error");
        },
    });
}

export function useDeleteReminder(type: ReminderableType, remindableId: number | string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => RemindersService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: REMINDERS_KEY(type, remindableId) });
            showToast("Recordatorio cancelado correctamente", "success");
        },
        onError: (error: any) => {
            showToast(extractErrorMessage(error) || "Error al eliminar el recordatorio", "error");
        },
    });
}
