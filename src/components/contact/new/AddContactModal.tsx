"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { showToast } from "@/components/sonner/CustomToaster";
import { ContactsService } from "@/lib/contacts";
import { adquirerApi } from "@/lib/acquirers";
import { validateVerificationDigit } from "@/utils/validate-verification-digit";

import { ContactFormProvider, useContactForm } from "@/components/contact/new/ContactFormProvider";
import { ContactBasicForm } from "@/components/contact/new/ContactBasicForm";
import { ContactAdvancedForm } from "@/components/contact/new/ContactAdvancedForm";
import { ContactSidebar } from "@/components/contact/new/ContactSidebar";
import { usePathname, useRouter } from "next/navigation";

interface PrefilledContactData {
  docType?: string;
  docNumber?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  registration_name?: string;
  showAutocompleteToast?: boolean;
}

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerCreated: (customer: any) => void;
  catalogData: any;
  prefilledData?: PrefilledContactData | null;
}

export function AddContactModal({ isOpen, onClose, onCustomerCreated, catalogData, prefilledData }: AddContactModalProps) {
  return (
    <ContactFormProvider>
      <ModalContent
        isOpen={isOpen}
        onClose={onClose}
        onCustomerCreated={onCustomerCreated}
        catalogData={catalogData}
        prefilledData={prefilledData}
      />
    </ContactFormProvider>
  );
}

function ModalContent({
  isOpen,
  onClose,
  onCustomerCreated,
  catalogData,
  prefilledData,
}: AddContactModalProps) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    mode, setMode,
    contactTypes,
    docType, setDocType,
    docNumber, setDocNumber,
    firstName, setFirstName,
    lastName, setLastName,
    registrationName, setRegistrationName,
    municipalityId,
    address,
    country,
    city,
    email, setEmail,
    phone1, mobile,
    autocompleting, setAutocompleting,
    creating, setCreating,
    comments,
    setErrors,
    resetForm
  } = useContactForm();

  // Reset and prefill when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
      if (prefilledData) {
        if (prefilledData.docType) setDocType(prefilledData.docType);
        if (prefilledData.docNumber) setDocNumber(prefilledData.docNumber);
        if (prefilledData.firstName !== undefined) setFirstName(prefilledData.firstName);
        if (prefilledData.lastName !== undefined) setLastName(prefilledData.lastName);
        if (prefilledData.email !== undefined) setEmail(prefilledData.email);
        if (prefilledData.registration_name !== undefined) setRegistrationName(prefilledData.registration_name);
        if (prefilledData.showAutocompleteToast) {
          showToast(
            "Completamos la información con la identificación ingresada. Su verificación y uso correcto dependen de ti.",
            "success",
            "Formulario autocompletado"
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prefilledData]);

  // Set default document type if none is selected
  useEffect(() => {
    if (isOpen && !docType && catalogData?.typeDocumentIdentifications?.length > 0) {
      // Only set it if there's no prefilled data docType, otherwise it overwrites
      if (!prefilledData?.docType) {
        setDocType(catalogData.typeDocumentIdentifications[0].id.toString());
      }
    }
  }, [isOpen, docType, catalogData, prefilledData, setDocType]);

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

    try {
      const docTypeId = docType ? Number(docType) : 1;
      const res = await adquirerApi.getAcquirer({
        type_document_identification_id: docTypeId,
        identification_number: cleanNum,
      });

      const acquirerData = (res as any)?.data?.acquirer || (res as any)?.acquirer || res?.data;


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

      showToast(`Error al autocompletar: ${err.message || err}`, "error");
    } finally {
      setAutocompleting(false);
    }
  };

  const handleSubmit = async () => {
    const cleanNum = docNumber.trim();
    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();

    const newErrors: { [key: string]: boolean } = {
      docType: !docType,
      docNumber: !cleanNum,
      firstName: !cleanFirstName && !registrationName.trim(),
      lastName: !cleanLastName && !registrationName.trim()
    };

    if (Object.values(newErrors).some(v => v)) {
      setErrors(newErrors);
      showToast("Asegúrate de completar todos los campos marcados con * e intenta de nuevo.", "error", "Revisa los campos obligatorios");
      return;
    }
    setErrors({});

    const fullName = `${cleanFirstName} ${cleanLastName}`.trim();
    const finalRegistrationName = registrationName.trim() || fullName;

    setCreating(true);
    try {
      const selectedDocTypeObj = catalogData?.typeDocumentIdentifications?.find(
        (d: any) => d.id.toString() === docType
      );
      const docTypeName = selectedDocTypeObj?.name?.toUpperCase() || "";
      const docTypeCode = selectedDocTypeObj?.code?.toUpperCase() || "";
      const isNit = docTypeName.includes("NIT") && !docTypeName.includes("OTRO PAIS");
      const isForeigner =
        ["PP", "CE", "TE", "DIE"].some(
          (code) => docTypeCode.includes(code) || docTypeName.includes(code)
        ) ||
        docTypeName.includes("NIT DE OTRO PAIS") || docTypeName.includes("PASAPORTE") ||
        docTypeName.includes("EXTRANJER") || docTypeName.includes("DOCUMENTO DE IDENTIFICACIÓN EXTRANJERO");

      const dvValue = isNit && cleanNum ? validateVerificationDigit(cleanNum) : null;

      const typeContactIds = [];
      if (contactTypes.includes("cliente")) typeContactIds.push(1);
      if (contactTypes.includes("proveedor")) typeContactIds.push(2);

      const basePayload: any = {
        registration_name: finalRegistrationName,
        first_name: cleanFirstName || null,
        last_name: cleanLastName || null,
        identification_number: Number(cleanNum) || cleanNum,
        verification_digit: dvValue !== null ? Number(dvValue) : null,
        type_document_identification_id: docType ? Number(docType) : null,
        type_organization_id: isNit ? 1 : 2,
        type_regime_id: isNit ? 1 : 2,
        type_liabilities: [5],
        email: email.trim() || null,
        phone1: mobile.trim() || phone1.trim() || null,
        address: address.trim() || null,
        type_contact_ids: typeContactIds,
      };

      if (comments && comments.length > 0) {
        basePayload.comments = comments.filter(c => c.comment.trim() !== "");
      }

      if (isForeigner) {
        basePayload.city = city.trim() || null;
        basePayload.country_id = country ? Number(country) : null;
      } else {
        basePayload.municipality_id = municipalityId ? Number(municipalityId) : null;
      }

      // New Contacts architecture uses the unified endpoint
      const res = await ContactsService.create(basePayload);
      const createdContact = res?.data?.contact || res?.data || res;

      if (createdContact) {
        showToast("Contacto creado exitosamente", "success");
        onCustomerCreated(createdContact);
        onClose();
      } else {
        throw new Error("No se pudo obtener la respuesta del servidor");
      }
    } catch (err: any) {
      console.error("Error creating contact:", err);
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al crear el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const dialogContentClass = mode === "advanced"
    ? "sm:max-w-[860px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
    : "sm:max-w-[520px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border border-gray-200 bg-white";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 space-y-0">
          <DialogTitle className="text-lg font-semibold text-slate-800">Nuevo contacto</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0">
          {mode === "simple" ? (
            <ContactBasicForm
              catalogData={catalogData}
              onAutocomplete={handleAutocomplete}
            />
          ) : (
            <div className="flex flex-col md:flex-row h-full min-h-[460px] bg-slate-50/30">
              <ContactAdvancedForm
                catalogData={catalogData}
                onAutocomplete={handleAutocomplete}
              />
              <ContactSidebar />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
          {mode === "simple" ? (
            <button
              type="button"
              onClick={() => {
                if (pathname === '/contacts') {
                  onClose();
                  router.push('/contacts/new');
                } else {
                  setMode("advanced");
                }
              }}
              className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Ir a formulario avanzado
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setMode("simple")}
              className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Ir a formulario simple
            </button>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors text-slate-700"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={creating || autocompleting}
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
            >
              {creating && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear contacto
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
