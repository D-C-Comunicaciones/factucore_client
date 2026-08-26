"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DatePickerSimple } from "@/components/ui/DatePickerSimple";
import { TimePickerSimple } from "@/components/ui/TimePickerSimple";
import { useMentionableUsers } from "@/hooks/comments/useComments";
import type { MentionableUser } from "@/types/comment";
import type { Reminder } from "@/types/reminder";

function initialsOf(name?: string) {
  return (name || "?").trim().charAt(0).toUpperCase() || "?";
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// "yyyy-MM-dd" (local, no UTC) <-> Date, para no desfasar el día al convertir
// desde/hacia el DatePickerSimple.
function isoToLocalDate(iso: string): Date | undefined {
  if (!iso) return undefined;
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function localDateToIso(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// due_at (ISO, con offset del backend) -> {date, time} locales para prellenar
// el formulario al editar. El input de fecha/hora es local del navegador —
// usar los componentes de la fecha en LOCAL time, no en UTC.
function splitDueAt(dueAt: string): { date: string; time: string } {
  const d = new Date(dueAt);
  if (isNaN(d.getTime())) return { date: todayISO(), time: nowHHMM() };
  return {
    date: localDateToIso(d),
    time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

const fieldClass =
  "w-full h-9 rounded-md border border-gray-300 px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors placeholder:text-slate-400";

export interface ReminderFormData {
  title: string;
  date: string;
  time: string;
  user_id: number;
}

export function NewReminderModal({
  open,
  onClose,
  onSubmit,
  reminder,
  submitting = false,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ReminderFormData) => void;
  reminder?: Reminder | null;
  submitting?: boolean;
}) {
  const isEdit = !!reminder;

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState(nowHHMM());
  const [recipient, setRecipient] = useState<MentionableUser | null>(null);
  const [recipientQuery, setRecipientQuery] = useState("");
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    if (open) {
      const initial = reminder?.due_at ? splitDueAt(reminder.due_at) : { date: todayISO(), time: nowHHMM() };
      setTitle(reminder?.title || "");
      setDate(initial.date);
      setTime(initial.time);
      setRecipient(reminder?.user || null);
      setRecipientQuery("");
      setShowRecipientDropdown(false);
    }
    // Solo al abrir: es un formulario "uncontrolled" respecto a `reminder`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(recipientQuery), 250);
    return () => clearTimeout(t);
  }, [recipientQuery]);

  const { data: users = [], isLoading } = useMentionableUsers(debouncedQuery, showRecipientDropdown);

  const canSubmit = !!(title.trim() && recipient && date && time);

  const handleSubmit = () => {
    if (!canSubmit || !recipient) return;
    onSubmit({
      title: title.trim(),
      date,
      time,
      user_id: recipient.id,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="sm:max-w-[420px] bg-white"
        aria-describedby={undefined}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar recordatorio" : "Nuevo recordatorio"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Título del recordatorio</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Revisar el pago de esta factura"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Fecha</label>
              <DatePickerSimple
                value={isoToLocalDate(date)}
                onChange={(d) => setDate(localDateToIso(d))}
                onClear={() => setDate("")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora</label>
              <TimePickerSimple value={time} onChange={setTime} onClear={() => setTime("")} />
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Asignar a: <span className="text-primary">*</span>
            </label>

            {recipient ? (
              <div className="flex items-center justify-between gap-2 h-9 rounded-md border border-gray-300 px-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                    {initialsOf(recipient.name)}
                  </div>
                  <span className="text-sm text-slate-700 truncate">{recipient.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setRecipient(null)}
                  className="text-slate-400 hover:text-slate-600 shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <input
                value={recipientQuery}
                onChange={(e) => {
                  setRecipientQuery(e.target.value);
                  setShowRecipientDropdown(true);
                }}
                onFocus={() => setShowRecipientDropdown(true)}
                onBlur={() => setTimeout(() => setShowRecipientDropdown(false), 150)}
                placeholder="Buscar usuario..."
                className={fieldClass}
              />
            )}

            {showRecipientDropdown && !recipient && (
              <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {isLoading ? (
                  <div className="px-3 py-2 text-xs text-slate-400">Buscando...</div>
                ) : users.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-slate-400">Sin resultados</div>
                ) : (
                  <div className="max-h-52 overflow-y-auto py-1">
                    {users.map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setRecipient(u);
                          setShowRecipientDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#5C45F2] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
                          {initialsOf(u.name)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-slate-700 font-medium truncate">{u.name}</div>
                          <div className="text-xs text-slate-400 truncate">{u.email}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border-gray-300 font-medium text-slate-700 cursor-pointer hover:bg-gray-100"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
          >
            {isEdit ? "Guardar cambios" : "Crear recordatorio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
