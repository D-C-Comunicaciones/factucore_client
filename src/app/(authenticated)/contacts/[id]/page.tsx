"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Building2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactsService } from "@/lib/contacts";
import { Loader2 } from "lucide-react";

export default function ContactDetailView() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchContact = async () => {
      try {
        const res = await ContactsService.getById(id);
        setContact(res?.data?.contact || res?.data || res);
      } catch (err) {
        console.error("Error fetching contact:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Contacto no encontrado</h2>
        <Button onClick={() => router.push("/contacts")} variant="outline">
          Volver a contactos
        </Button>
      </div>
    );
  }

  const name = contact.registration_name || `${contact.first_name || ""} ${contact.last_name || ""}`.trim();
  const isCustomer = contact.type_contact_ids?.includes(1) || contact.type_contacts?.some((tc: any) => tc.id === 1);
  const isProvider = contact.type_contact_ids?.includes(2) || contact.type_contacts?.some((tc: any) => tc.id === 2);

  return (
    <div className="w-full min-h-screen text-foreground pb-12">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push("/contacts")} className="h-8 w-8">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
              {name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                {name}
                {isCustomer && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">Cliente</span>}
                {isProvider && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Proveedor</span>}
              </h1>
              <p className="text-sm text-slate-500">ID: {contact.identification_number}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
            <Button onClick={() => router.push(`/contacts/${id}/edit`)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        {/* METRICS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Facturado</h3>
            <p className="text-2xl font-bold text-slate-800">$0.00</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Saldo Pendiente</h3>
            <p className="text-2xl font-bold text-red-600">$0.00</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Última Transacción</h3>
            <p className="text-2xl font-bold text-slate-800">-</p>
          </div>
        </div>

        {/* TABS & DETAILS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 pt-4 flex gap-6">
            <button className="pb-3 border-b-2 border-primary text-primary font-medium text-sm">Información general</button>
            <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm">Historial de facturas</button>
            <button className="pb-3 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm">Estado de cuenta</button>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <UserCircle2 className="w-4 h-4 text-slate-400" />
                  Datos de contacto
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">{contact.email || "No registrado"}</p>
                      <p className="text-xs text-slate-500">Correo electrónico</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">{contact.phone1 || contact.phone2 || "No registrado"}</p>
                      <p className="text-xs text-slate-500">Teléfono principal</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  Dirección y ubicación
                </h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-slate-700">{contact.address || "No registrada"}</p>
                      <p className="text-xs text-slate-500">Dirección</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
