"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarClock, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NewReminderModal } from "./NewReminderModal";
import { useRemindersList, useCreateReminder, useUpdateReminder, useDeleteReminder } from "@/hooks/reminders/useReminders";
import { useRemindersSocket } from "@/hooks/reminders/useRemindersSocket";
import type { ReminderableType, Reminder } from "@/types/reminder";

function formatReminderDateTime(dueAt: string) {
  const d = new Date(dueAt);
  if (isNaN(d.getTime())) return "";
  const day = d.getDate();
  const month = d.toLocaleDateString("es-CO", { month: "short" }).replace(".", "");
  const time = d.toLocaleTimeString("es-CO", { hour: "numeric", minute: "2-digit", hour12: true });
  return `${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${time}`;
}

function ReminderCard({
  reminder,
  onEdit,
  onDelete,
}: {
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-xl p-3">
      <div className="w-9 h-9 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
        <CalendarClock className="w-4 h-4 text-slate-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{reminder.title}</p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <Bell className="w-3 h-3" /> {formatReminderDateTime(reminder.due_at)}
          </span>
          {reminder.user && (
            <span className="text-xs text-slate-400 truncate">para {reminder.user.name}</span>
          )}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors shrink-0">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
            <Pencil className="w-4 h-4 mr-2 text-slate-600" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-destructive focus:text-destructive">
            <Trash2 className="w-4 h-4 mr-2" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Panel de recordatorios conectado al backend real (ver recordatorios.md):
// listado, creación, edición (con reasignación) y borrado vía API, más
// actualización en vivo por WebSocket mientras la pantalla está abierta.
// ---------------------------------------------------------------------------
export function RemindersPanel({
  type,
  remindableId,
  onCountChange,
}: {
  type: ReminderableType;
  remindableId: number | string | null | undefined;
  onCountChange?: (count: number) => void;
}) {
  const { data: reminders = [], isLoading } = useRemindersList(type, remindableId);
  useRemindersSocket(type, remindableId);
  const createMutation = useCreateReminder(type, remindableId ?? "");
  const updateMutation = useUpdateReminder(type, remindableId ?? "");
  const deleteMutation = useDeleteReminder(type, remindableId ?? "");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    onCountChange?.(reminders.length);
  }, [reminders.length, onCountChange]);

  const openCreateModal = () => {
    setEditingReminder(null);
    setModalOpen(true);
  };

  const openEditModal = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setModalOpen(true);
  };

  const handleSubmit = (data: { title: string; date: string; time: string; user_id: number }) => {
    if (editingReminder) {
      updateMutation.mutate(
        { id: editingReminder.id, payload: data },
        { onSuccess: () => setModalOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setModalOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deletingId == null) return;
    deleteMutation.mutate(deletingId, { onSuccess: () => setDeletingId(null) });
  };

  const deletingReminder = reminders.find((r) => r.id === deletingId) || null;
  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
        <span className="text-sm font-medium text-slate-600">Activos ({reminders.length})</span>
        <button
          onClick={openCreateModal}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
          title="Nuevo recordatorio"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white min-h-[250px] max-h-[520px] overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400 pt-10 text-sm">
            Cargando recordatorios...
          </div>
        ) : reminders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 pt-10">
            <Bell className="w-12 h-12 mb-3 text-primary" strokeWidth={1.5} />
            <span className="text-sm font-medium">No hay recordatorios</span>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((r) => (
              <ReminderCard
                key={r.id}
                reminder={r}
                onEdit={() => openEditModal(r)}
                onDelete={() => setDeletingId(r.id)}
              />
            ))}
          </div>
        )}
      </div>

      <NewReminderModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        reminder={editingReminder}
        submitting={submitting}
      />

      {/* Delete Confirmation Modal */}
      <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
        <DialogContent className="sm:max-w-[425px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>¿Eliminar recordatorio?</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-slate-600">Esta acción es permanente y no se puede deshacer.</p>
            {deletingReminder && (
              <div className="flex items-center gap-3 mt-4 bg-white border border-gray-200 rounded-lg p-3">
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-4 h-4 text-slate-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">{deletingReminder.title}</p>
                  <p className="text-xs text-slate-400">{formatReminderDateTime(deletingReminder.due_at)}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingId(null)} disabled={deleteMutation.isPending} className="rounded-lg border-gray-300 font-medium text-slate-700">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending} className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] font-medium text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
