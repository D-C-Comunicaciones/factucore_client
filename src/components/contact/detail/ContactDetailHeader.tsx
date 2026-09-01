"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ChevronDown, Edit, Trash2, RotateCcw, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteConfirmDialog } from "@/components/shared/DeleteConfirmDialog";
import { ContactsService } from "@/lib/contacts";
import { showToast } from "@/components/sonner/CustomToaster";
import { showContactDeletedToast } from "@/utils/contact-deleted-toast";
import { isConsumerFinal } from "@/utils/is-consumer-final";
import type { Contact, ContactSummary } from "@/types/contact";

const COMING_SOON_MESSAGE = "Esta función aún no está disponible, seguimos trabajando para ofrecerte más funcionalidades. Gracias por su comprensión.";

function notifyComingSoon() {
    showToast(COMING_SOON_MESSAGE, "info");
}

interface ContactDetailHeaderProps {
    contact: Contact;
    summary?: ContactSummary;
    onToggleActive?: (contactId: number, currentlyActive: boolean) => void | Promise<void>;
}

export function ContactDetailHeader({ contact, summary, onToggleActive }: ContactDetailHeaderProps) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [togglingActive, setTogglingActive] = useState(false);
    const [restoring, setRestoring] = useState(false);

    const name = contact.registration_name || contact.first_name || contact.last_name || "Detalle de contacto";
    const isActive = contact.is_active ?? true;
    const isFinalConsumer = isConsumerFinal(contact.identification_number);
    const isTrashed = Boolean(contact.deleted_at);
    const disabledBtnClass = "h-9 bg-white border-slate-200 text-slate-400 shadow-sm font-medium opacity-60 cursor-not-allowed";

    const handleToggleActive = async () => {
        if (!onToggleActive || togglingActive) return;
        setTogglingActive(true);
        try {
            await onToggleActive(contact.id, isActive);
        } finally {
            setTogglingActive(false);
        }
    };

    const defaultBtnClass = "h-9 bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-800 cursor-pointer transition-colors shadow-sm font-medium";

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value || 0).replace("COP", "$").trim();
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await ContactsService.delete(contact.id);
            showContactDeletedToast(name);
            router.push("/contacts");
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al eliminar el contacto";
            showToast(`Error: ${msg}`, "error");
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    const handleRestore = async () => {
        setRestoring(true);
        try {
            await ContactsService.restore(contact.id);
            showToast(`"${name}" fue restaurado y ya está disponible en tu lista de contactos.`, "success", "Contacto restaurado");
            router.push(`/contacts/${contact.id}`);
            router.refresh();
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al restaurar el contacto";
            showToast(`Error: ${msg}`, "error");
        } finally {
            setRestoring(false);
        }
    };

    return (
        <div className="mb-8">
            <h1 className="text-[22px] font-bold text-slate-800 mb-6">{name}</h1>

            <div className="flex flex-wrap items-center gap-3 mb-8">
                <div className="flex items-center gap-2 mr-2">
                    <span className={`text-sm font-medium ${isTrashed ? "text-slate-400" : "text-slate-700"}`}>
                        {isActive ? "Activado" : "Desactivado"}
                    </span>
                    <Switch
                        checked={isActive}
                        disabled={togglingActive || isTrashed}
                        onCheckedChange={handleToggleActive}
                        className="data-[state=checked]:bg-primary cursor-pointer disabled:cursor-not-allowed"
                    />
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={isTrashed}
                    className={isTrashed ? disabledBtnClass : defaultBtnClass}
                    onClick={() => router.push(`/sales/invoices/new?contactId=${contact.id}`)}
                >
                    + Nueva factura
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    disabled={isTrashed}
                    className={isTrashed ? disabledBtnClass : defaultBtnClass}
                    onClick={notifyComingSoon}
                >
                    + Nueva factura de compra
                </Button>
                {!isFinalConsumer && (
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={isTrashed}
                        className={isTrashed ? disabledBtnClass : defaultBtnClass}
                        onClick={() => router.push(`/contacts/${contact.id}/edit`)}
                    >
                        <Edit className="w-4 h-4 mr-2" /> Editar
                    </Button>
                )}

                {isTrashed ? (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-9 bg-white border-primary text-primary hover:bg-primary/5 cursor-pointer transition-colors shadow-sm font-medium"
                        onClick={handleRestore}
                        disabled={restoring}
                    >
                        {restoring ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
                        Restaurar
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className={defaultBtnClass}
                        onClick={() => setConfirmOpen(true)}
                    >
                        <Trash2 className="w-4 h-4 mr-2" /> Eliminar
                    </Button>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isTrashed}>
                        <Button variant="outline" size="sm" disabled={isTrashed} className={isTrashed ? disabledBtnClass : defaultBtnClass}>
                            Portal de clientes <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuItem className="cursor-pointer py-2" onClick={notifyComingSoon}>
                            Generar enlace de Portal de Clientes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-2" onClick={notifyComingSoon}>
                            Enviar por correo
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild disabled={isTrashed}>
                        <Button variant="outline" size="sm" disabled={isTrashed} className={isTrashed ? disabledBtnClass : defaultBtnClass}>
                            Más acciones <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="cursor-pointer py-2" onClick={notifyComingSoon}>
                            Adjuntar archivo
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer py-2" onClick={notifyComingSoon}>
                            Ver estado de cuenta
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden ${isTrashed ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Cuentas por cobrar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(summary?.accounts_receivable ?? 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Anticipos recibidos</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(summary?.advances_received ?? 0)}</p>
                </div>
                <div className="p-4 border-r border-slate-100 last:border-r-0 flex flex-col justify-between">
                    <h3 className="text-[11px] font-semibold text-slate-400 mb-4">Notas crédito por aplicar</h3>
                    <p className="text-lg font-semibold text-slate-800">{formatCurrency(summary?.credit_notes_available ?? 0)}</p>
                </div>
            </div>

            <DeleteConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="¿Eliminar este contacto?"
                description={`"${name}" se moverá a la papelera y podrás restaurarlo cuando lo necesites.`}
                onConfirm={handleDelete}
                loading={deleting}
            />
        </div>
    );
}
