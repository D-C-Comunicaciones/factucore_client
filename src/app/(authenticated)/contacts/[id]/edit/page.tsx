"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactsService } from "@/lib/contacts";
import { ContactFormProvider, useContactForm } from "@/components/contact/new/ContactFormProvider";
import { ContactAdvancedForm } from "@/components/contact/new/ContactAdvancedForm";
import { ContactSidebar } from "@/components/contact/new/ContactSidebar";
import { useCatalogs } from "@/hooks/useCatalogs";
import { showToast } from "@/components/sonner/CustomToaster";

function EditContactContent() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loadingContact, setLoadingContact] = useState(true);
  
  const catalogData = useCatalogs();

  const {
    setMode,
    setContactTypes,
    docType, setDocType,
    docNumber, setDocNumber,
    firstName, setFirstName,
    lastName, setLastName,
    registrationName, setRegistrationName,
    municipalityId, setMunicipalityId,
    address, setAddress,
    country, setCountry,
    city, setCity,
    email, setEmail,
    phone1, setPhone1,
    mobile, setMobile,
    contactTypes,
    associatedPersons, setAssociatedPersons,
    creating, setCreating,
    errors, setErrors
  } = useContactForm();

  useEffect(() => {
    if (!id) return;
    setMode("advanced");
    const fetchContact = async () => {
      try {
        const res = await ContactsService.getById(id);
        const contact = res?.data?.contact || res?.data || res;
        if (contact) {
          if (contact.type_document_identification_id) setDocType(contact.type_document_identification_id.toString());
          if (contact.identification_number) setDocNumber(contact.identification_number.toString());
          if (contact.first_name) setFirstName(contact.first_name);
          if (contact.last_name) setLastName(contact.last_name);
          if (contact.registration_name) setRegistrationName(contact.registration_name);
          if (contact.email) setEmail(contact.email);
          if (contact.phone1) setMobile(contact.phone1);
          if (contact.phone2) setPhone1(contact.phone2);
          if (contact.address) setAddress(contact.address);
          if (contact.municipality_id) setMunicipalityId(contact.municipality_id.toString());
          
          const types: ("cliente" | "proveedor")[] = [];
          if (contact.type_contact_ids?.includes(1) || contact.type_contacts?.some((tc: any) => tc.id === 1)) types.push("cliente");
          if (contact.type_contact_ids?.includes(2) || contact.type_contacts?.some((tc: any) => tc.id === 2)) types.push("proveedor");
          if (types.length > 0) setContactTypes(types);

          if (contact.associated_persons && contact.associated_persons.length > 0) {
            setAssociatedPersons(contact.associated_persons);
          }
        }
      } catch (err) {
        console.error("Error fetching contact:", err);
        showToast("Error al cargar el contacto", "error");
      } finally {
        setLoadingContact(false);
      }
    };
    fetchContact();
  }, [id, setMode, setDocType, setDocNumber, setFirstName, setLastName, setRegistrationName, setEmail, setMobile, setPhone1, setAddress, setMunicipalityId, setContactTypes]);

  const handleSave = async () => {
    const cleanNum = docNumber.trim();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    const fullName = `${cleanFirstName} ${cleanLastName}`.trim();
    const finalRegistrationName = registrationName.trim() || fullName;

    const newErrors = {
      docType: !docType,
      docNumber: !cleanNum,
      firstName: !cleanFirstName && !registrationName.trim(),
      lastName: !cleanLastName && !registrationName.trim()
    };

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(prev => ({ ...prev, ...newErrors }));
      showToast(
        "Asegúrate de completar todos los campos marcados con * e intenta de nuevo.",
        "error",
        "Revisa los campos obligatorios"
      );
      return;
    }

    setCreating(true);
    try {
      const typeContactIds = [];
      if (contactTypes.includes("cliente")) typeContactIds.push(1);
      if (contactTypes.includes("proveedor")) typeContactIds.push(2);

      const basePayload: any = {
        registration_name: finalRegistrationName,
        first_name: cleanFirstName || null,
        last_name: cleanLastName || null,
        identification_number: Number(cleanNum) || cleanNum,
        type_document_identification_id: Number(docType),
        email: email.trim() || null,
        phone1: mobile.trim() || phone1.trim() || null,
        address: address.trim() || null,
        type_contact_ids: typeContactIds.length > 0 ? typeContactIds : [1],
      };

      if (municipalityId) {
        basePayload.municipality_id = Number(municipalityId);
      }

      if (associatedPersons && associatedPersons.length > 0) {
        basePayload.associated_person = associatedPersons;
      }

      await ContactsService.update(id, basePayload);
      showToast("Contacto actualizado exitosamente", "success");
      router.push(`/contacts/${id}`);
    } catch (err: any) {
      console.error("Error updating contact:", err);
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al actualizar el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    router.push("/contacts");
  };

  if (loadingContact) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-foreground pb-12 pt-6">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push(`/contacts/${id}`)} className="h-8 w-8">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-slate-800">
              Editar contacto
            </h1>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-transparent flex flex-col md:flex-row min-h-[600px] gap-6 items-start">
          <ContactAdvancedForm catalogData={catalogData} onAutocomplete={() => showToast("Autocompletado no disponible en edición", "info")} />
          <ContactSidebar 
            onSave={handleSave} 
            onCancel={handleCancel}
            creating={creating} 
            saveText="Guardar cambios" 
          />
        </div>
      </div>
    </div>
  );
}

export default function EditContactPage() {
  return (
    <ContactFormProvider>
      <EditContactContent />
    </ContactFormProvider>
  );
}
