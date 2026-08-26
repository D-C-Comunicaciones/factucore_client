"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";
import { onDueReminder, type DueReminderPayload } from "@/lib/dueReminderBus";
import { playReminderDueSound } from "@/lib/notificationSound";
import { DOCUMENT_ROUTES } from "@/lib/notifications";

// Popup de recordatorio vencido: a propósito NO es el <Dialog> de shadcn/Radix que usa el
// resto de la app — ese cierra con Escape y clic afuera por default, y este SÍ necesita que
// el usuario tenga que darse cuenta y cerrarlo a propósito con el botón (es el aviso "de
// verdad" del recordatorio, el que llega justo cuando vence — perderlo sin querer con un
// Escape reflejo derrotaría el propósito). Overlay + tarjeta armados a mano, sin listener de
// teclado ni de clic-afuera en absoluto.
//
// Se monta UNA sola vez en el layout raíz (ver src/app/layout.tsx) y escucha
// src/lib/dueReminderBus.ts — así se ve sin importar en qué pantalla esté el usuario cuando
// el WebSocket entrega el aviso.
export function DueReminderPopup() {
    const router = useRouter();
    const [queue, setQueue] = useState<DueReminderPayload[]>([]);

    useEffect(() => {
        return onDueReminder((payload) => {
            playReminderDueSound();
            setQueue((prev) => [...prev, payload]);
        });
    }, []);

    const current = queue[0];

    const dismiss = () => setQueue((prev) => prev.slice(1));

    if (!current) return null;

    const basePath = DOCUMENT_ROUTES[current.remindableType];

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="due-reminder-title"
        >
            <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-br from-[#5C45F2] to-[#3b2fb8] p-1 shadow-2xl animate-in zoom-in-95 fade-in duration-300">
                <div className="rounded-[22px] bg-[#0f172a] px-7 py-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 animate-pulse">
                        <Bell className="h-8 w-8 text-white" />
                    </div>

                    <h2 id="due-reminder-title" className="text-lg font-bold text-white">
                        Factucore te recuerda
                    </h2>
                    <p className="mt-2 text-base font-semibold text-white break-words">{current.title}</p>
                    <p className="mt-1 text-sm text-slate-300">{current.dueAtLabel}</p>

                    <div className="mt-7 flex items-center justify-center gap-3">
                        {basePath && (
                            <button
                                onClick={() => {
                                    router.push(`${basePath}/${current.remindableId}`);
                                    dismiss();
                                }}
                                className="cursor-pointer rounded-lg border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
                            >
                                Ver detalles
                            </button>
                        )}
                        <button
                            onClick={dismiss}
                            className="cursor-pointer flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#0f172a] transition-colors hover:bg-slate-200"
                        >
                            <X className="h-4 w-4" /> Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
