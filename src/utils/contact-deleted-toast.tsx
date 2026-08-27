import { showToast } from "@/components/sonner/CustomToaster";

// Mensaje compartido tras eliminar un contacto (ahora es un soft-delete — el
// contacto se puede recuperar desde /contacts/recycle) — usado tanto en la
// lista de contactos como en la vista de detalle para que ambos flujos avisen
// lo mismo.
export function showContactDeletedToast(name: string) {
    showToast(
        <>
            Tu contacto <strong>{name}</strong> fue eliminado. Puedes restaurarlo desde la papelera en cualquier momento.
        </>,
        "success",
        "Contacto eliminado 🗑️"
    );
}
