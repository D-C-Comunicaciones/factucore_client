"use client";

import { useRouter } from "next/navigation";
import { ContactsService } from "@/lib/contacts";
import { ContactFormProvider, useContactForm } from "@/components/contact/new/ContactFormProvider";
import { ContactAdvancedForm } from "@/components/contact/new/ContactAdvancedForm";
import { ContactSidebar } from "@/components/contact/new/ContactSidebar";
import { useCatalogs } from "@/hooks/useCatalogs";
import { showToast } from "@/components/sonner/CustomToaster";
import { toast } from "sonner";
import { adquirerApi } from "@/lib/acquirers";

function NewContactContent() {
  const router = useRouter();
  const catalogData = useCatalogs();

  const {
    docType, docNumber,
    firstName, lastName,
    registrationName,
    municipalityId,
    address,
    email,
    phone1, mobile,
    contactTypes,
    associatedPersons,
    comments,
    creating, setCreating,
    setAutocompleting,
    setFirstName, setLastName, setRegistrationName, setEmail,
    errors, setErrors
  } = useContactForm();

  const splitDianName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) return { apellidos: fullName, nombres: "" };
    if (parts.length === 2) return { apellidos: parts[0], nombres: parts[1] };
    if (parts.length === 3) return { apellidos: `${parts[0]} ${parts[1]}`, nombres: parts[2] };
    return { apellidos: `${parts[0]} ${parts[1]}`, nombres: parts.slice(2).join(" ") };
  };

  const handleAutocomplete = async () => {
    const cleanNum = docNumber.trim();
    if (!cleanNum) {
      showToast("Por favor ingrese un número de identificación", "warning");
      return;
    }

    setAutocompleting(true);
    const searchToastId = toast.loading("Consultando identificación en la DIAN...");

    try {
      const docTypeId = docType ? Number(docType) : 1;
      const res = await adquirerApi.getAcquirer({
        type_document_identification_id: docTypeId,
        identification_number: cleanNum,
      });

      const acquirerData = (res as any)?.data?.acquirer || (res as any)?.acquirer || res?.data;

      toast.dismiss(searchToastId);

      if (acquirerData && (acquirerData.found || acquirerData.receiver_name)) {
        const fullDianName = acquirerData.receiver_name || "";
        const dianEmail = acquirerData.receiver_email || "";
        const { apellidos: splitA, nombres: splitN } = splitDianName(fullDianName);

        setFirstName(splitN || "");
        setLastName(splitA || "");
        setRegistrationName(fullDianName);
        setEmail(dianEmail);

        showToast("Completamos la información con la identificación ingresada.", "success", "Formulario autocompletado");
      } else {
        showToast("No se encontró información para el número de identificación ingresado", "error");
      }
    } catch (err: any) {
      console.error("Error autocompleting:", err);
      toast.dismiss(searchToastId);
      showToast(`Error al autocompletar: ${err.message || err}`, "error");
    } finally {
      setAutocompleting(false);
    }
  };

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
        type_document_identification_id: docType ? Number(docType) : null,
        email: email.trim() || null,
        phone1: mobile.trim() || phone1.trim() || null,
        address: address.trim() || null,
        type_contact_ids: typeContactIds.length > 0 ? typeContactIds : [1], // Default a cliente si no hay
      };

      if (municipalityId) {
        basePayload.municipality_id = Number(municipalityId);
      }

      if (associatedPersons && associatedPersons.length > 0) {
        basePayload.associated_person = associatedPersons;
      }

      if (comments && comments.length > 0) {
        basePayload.comments = comments.filter(c => c.comment.trim() !== "");
      }

      const res = await ContactsService.create(basePayload);
      showToast(`${finalRegistrationName} ya está disponible en tu lista de contactos.`, "success", "Contacto creado");
      const newId = res?.data?.id || (res?.data as any)?.contact?.id || (res as any)?.contact?.id;
      if (newId) {
        router.push(`/contacts/${newId}`);
      } else {
        router.push(`/contacts`);
      }
    } catch (err: any) {
      console.error("Error creating contact:", err);
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al crear el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleSaveAndCreateAnother = async () => {
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
        type_document_identification_id: docType ? Number(docType) : null,
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

      if (comments && comments.length > 0) {
        basePayload.comments = comments.filter(c => c.comment.trim() !== "");
      }

      await ContactsService.create(basePayload);
      showToast(`${finalRegistrationName} ya está disponible en tu lista de contactos.`, "success", "Contacto creado");
      // Reset the form state via a re-render or explicit reset if available.
      // But we can just reload the page or empty context
      window.location.reload();
    } catch (err: any) {
      console.error("Error creating contact:", err);
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al crear el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    router.push("/contacts");
  };

  return (
    <div className="w-full min-h-screen text-foreground pb-12 pt-6">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">

        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-1">
          <h1 className="text-[22px] font-bold text-[#0B1A3F]">
            Nuevo contacto
          </h1>
          <p className="text-[13px] text-slate-500">
            Crea tus contactos para asociarlos en los documentos y transacciones que registres a su nombre.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-transparent flex flex-col md:flex-row min-h-[600px] gap-6 items-start">
          <ContactAdvancedForm catalogData={catalogData} onAutocomplete={handleAutocomplete} />
          <ContactSidebar
            onSave={handleSave}
            onSaveAndCreateAnother={handleSaveAndCreateAnother}
            onCancel={handleCancel}
            creating={creating}
            saveText="Crear contacto"
          />
        </div>
      </div>
    </div>
  );
}

export default function NewContactPage() {
  return (
    <ContactFormProvider>
      <NewContactContent />
    </ContactFormProvider>
  );
}
