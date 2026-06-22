"use client";
import { useParams, useRouter } from "next/navigation";
import { useContact } from "@/hooks/contacts/useContacts";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/components/sonner/CustomToaster";
import { useEffect } from "react";

import { ContactDetailHeader } from "@/components/contact/detail/ContactDetailHeader";
import { ContactDetailGeneral } from "@/components/contact/detail/ContactDetailGeneral";
import { ContactDetailBranches } from "@/components/contact/detail/ContactDetailBranches";
import { ContactDetailAttachments } from "@/components/contact/detail/ContactDetailAttachments";
import { ContactDetailTabs } from "@/components/contact/detail/ContactDetailTabs";
import { ContactDetailComments } from "@/components/contact/detail/ContactDetailComments";

export default function ContactDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;
    const enabled = typeof id === 'string' || typeof id === 'number';
    
    const { data, isLoading, isError } = useContact(enabled ? id : "");

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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 bg-white rounded-lg border border-slate-200">
                            {[...Array(6)].map((_, i) => (
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

    return (
        <div className="w-full text-foreground pb-12">
            <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
                <ContactDetailHeader contact={contact} onBack={() => router.push("/contacts")} />
                
                <div className="mt-6 flex flex-col gap-6">
                    <div className="rounded-xl overflow-hidden">
                        <div className="p-0">
                            <ContactDetailGeneral contact={contact} />
                            <ContactDetailBranches contact={contact} />
                        </div>
                    </div>
                    
                    <ContactDetailAttachments contact={contact} />
                    <ContactDetailTabs contact={contact} />
                    <ContactDetailComments contact={contact} />
                </div>
            </div>
        </div>
    );
}
