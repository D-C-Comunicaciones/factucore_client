"use client";
import { useParams } from "next/navigation";
import { useContact } from "@/hooks/contacts/useContacts";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/sonner/CustomToaster";
import { ContactsService } from "@/lib/contacts";
import { useEffect } from "react";

import { ContactDetailHeader } from "@/components/contact/detail/ContactDetailHeader";
import { ContactDetailGeneral } from "@/components/contact/detail/ContactDetailGeneral";
import { ContactDetailBranches } from "@/components/contact/detail/ContactDetailBranches";
import { ContactDetailAttachments } from "@/components/contact/detail/ContactDetailAttachments";
import { ContactDetailTabs } from "@/components/contact/detail/ContactDetailTabs";
import { ContactDetailComments } from "@/components/contact/detail/ContactDetailComments";

export default function ContactDetailPage() {
    const params = useParams();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    
    const { data, isLoading, isError, refetch } = useContact(enabled ? id : "");

    const handleToggleActive = async (contactId: number, currentlyActive: boolean) => {
        try {
            await ContactsService.update(contactId, { is_active: !currentlyActive });
            showToast(currentlyActive ? "Contacto desactivado" : "Contacto activado", "success");
            await refetch();
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al actualizar el contacto";
            showToast(`Error: ${msg}`, "error");
        }
    };

    useEffect(() => {
        if (data?.message && data.status !== "success") {
            showToast(data.message, "error", "Error");
        }
    }, [data?.message, data?.status]);

    useEffect(() => {
        if (data?.data) {
            const contact = data.data.contact || data.data;
            const name = contact.registration_name || contact.name || contact.names || contact.company || "Detalle de contacto";
            document.title = name;
        }
    }, [data?.data]);

    if (!enabled) return <div className="py-10 text-center text-red-500">ID de contacto inválido</div>;
    if (isLoading) {
        return (
            <div className="w-full text-foreground pb-12">
                <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
                    <div className="mb-8">
                        <Skeleton className="h-8 w-1/3 mb-6" />
                        <div className="flex gap-3 mb-8">
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-32" />
                            <Skeleton className="h-9 w-24" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 bg-white rounded-lg border border-slate-200">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="p-4 border-r border-slate-100 last:border-r-0">
                                    <Skeleton className="h-3 w-20 mb-4" />
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="mt-6 flex flex-col gap-6">
                        <Skeleton className="w-full h-64 rounded-xl" />
                        <Skeleton className="w-full h-40 rounded-xl" />
                        <Skeleton className="w-full h-48 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }
    if (isError || !data || (!data.data && !data.contact)) return <div className="py-10 text-center text-red-500">No se pudo cargar el contacto</div>;

    const contact = data.data?.contact || data.data || {};
    const documents = data.data?.documents;
    const summary = data.data?.summary;
    const isTrashed = Boolean(contact.deleted_at);

    return (
        <div className="w-full text-foreground pb-12">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
                <ContactDetailHeader contact={contact} summary={summary} onToggleActive={handleToggleActive} />

                <div className={`mt-6 flex flex-col gap-6 relative ${isTrashed ? "opacity-60" : ""}`}>
                    {isTrashed && <div className="absolute inset-0 z-50 cursor-not-allowed" title="Contacto eliminado" />}
                    <ContactDetailGeneral contact={contact} />
                    <ContactDetailBranches contact={contact} />

                    <ContactDetailAttachments contact={contact} />
                    <ContactDetailTabs documents={documents} />
                    <ContactDetailComments contact={contact} />
                </div>
            </div>
        </div>
    );
}
