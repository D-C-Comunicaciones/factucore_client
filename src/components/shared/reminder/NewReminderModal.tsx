"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

const fieldClass =
  "w-full h-9 rounded-md border border-gray-300 px-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-1 focus:ring-primary/40 transition-colors placeholder:text-slate-400";

export function NewReminderModal({
  open,
  onClose,
  onSubmit,
  reminder,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (reminder: Reminder) => void;
  reminder?: Reminder | null;
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
      setTitle(reminder?.title || "");
      setDate(reminder?.date || todayISO());
      setTime(reminder?.time || nowHHMM());
      setRecipient(reminder?.recipient || null);
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

  const canSubmit = !!(title.trim() && recipient);

  const handleSubmit = () => {
    if (!canSubmit || !recipient) return;
    onSubmit({
      id: reminder?.id || crypto.randomUUID(),
      title: title.trim(),
      date,
      time,
      recipient,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
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
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`${fieldClass} pr-8`}
                />
                {date && (
                  <button
                    type="button"
                    onClick={() => setDate("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Hora</label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className={`${fieldClass} pr-8`}
                />
                {time && (
                  <button
                    type="button"
                    onClick={() => setTime("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Destinatario <span className="text-primary">*</span>
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
          <Button variant="outline" onClick={onClose} className="rounded-lg border-gray-300 font-medium text-slate-700">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isEdit ? "Guardar cambios" : "Crear recordatorio"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
