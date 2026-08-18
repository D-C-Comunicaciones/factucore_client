"use client";

import { useEffect, useState } from "react";
import { Bell, CalendarClock, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { showToast, showReminderToast } from "@/components/sonner/CustomToaster";
import { NewReminderModal } from "./NewReminderModal";
import type { Reminder } from "@/types/reminder";

const MONTHS_ES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatReminderDateTime(date: string, time: string) {
  if (!date) return time || "";
  const [, m, d] = date.split("-").map(Number);
  const month = MONTHS_ES[(m || 1) - 1] || "";
  let timeLabel = "";
  if (time) {
    const [hh, mm] = time.split(":").map(Number);
    const period = hh >= 12 ? "pm" : "am";
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    timeLabel = `, ${h12}:${String(mm).padStart(2, "0")} ${period}`;
  }
  return `${d} ${month}${timeLabel}`;
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
        <span className="inline-flex items-center gap-1.5 mt-1.5 bg-emerald-50 text-emerald-600 text-xs font-medium px-2.5 py-1 rounded-full">
          <Bell className="w-3 h-3" /> {formatReminderDateTime(reminder.date, reminder.time)}
        </span>
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
// Panel de recordatorios — solo UI por ahora (no hay endpoint todavía), se
// usa igual que CommentsAndReminders: montado dentro de la pestaña
// "Recordatorios" en invoices/credit_notes/payments/remissions/quotations.
// ---------------------------------------------------------------------------
export function RemindersPanel({ onCountChange }: { onCountChange?: (count: number) => void }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleSubmit = (reminder: Reminder) => {
    if (editingReminder) {
      setReminders((prev) => prev.map((r) => (r.id === reminder.id ? reminder : r)));
      showToast("Recordatorio actualizado correctamente", "success");
    } else {
      setReminders((prev) => [reminder, ...prev]);
      showReminderToast({
        title: reminder.title,
        dateTimeLabel: formatReminderDateTime(reminder.date, reminder.time),
      });
    }
  };

  const handleDelete = () => {
    if (!deletingId) return;
    setReminders((prev) => prev.filter((r) => r.id !== deletingId));
    setDeletingId(null);
    showToast("Recordatorio cancelado correctamente", "success");
  };

  const deletingReminder = reminders.find((r) => r.id === deletingId) || null;

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
        {reminders.length === 0 ? (
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
                  <p className="text-xs text-slate-400">{formatReminderDateTime(deletingReminder.date, deletingReminder.time)}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeletingId(null)} className="rounded-lg border-gray-300 font-medium text-slate-700">
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} className="rounded-lg bg-[#E11D48] hover:bg-[#BE123C] font-medium text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
