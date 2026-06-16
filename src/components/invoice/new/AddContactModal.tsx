"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { CheckCircle2, ChevronDown, ChevronUp, HelpCircle, Loader2, Plus, Sparkles, UploadCloud, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { showToast } from "@/components/sonner/CustomToaster";
import { customersApi } from "@/lib/customers";
import { providersApi } from "@/lib/providers";
import { adquirerApi } from "@/lib/acquirers";
import { validateVerificationDigit } from "@/utils/validate-verification-digit";

interface PrefilledContactData {
  docType?: string;
  docNumber?: string;
  nombres?: string;
  apellidos?: string;
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

export function AddContactModal({
  isOpen,
  onClose,
  onCustomerCreated,
  catalogData,
  prefilledData,
}: AddContactModalProps) {
  // UI Mode: "simple" | "advanced"
  const [mode, setMode] = useState<"simple" | "advanced">("simple");
  const [contactTypes, setContactTypes] = useState<("cliente" | "proveedor")[]>(["cliente"]);

  // Form Fields
  const [docType, setDocType] = useState<string>("");
  const [docNumber, setDocNumber] = useState<string>("");
  const [nombres, setNombres] = useState<string>("");
  const [apellidos, setApellidos] = useState<string>("");
  const [registrationName, setRegistrationName] = useState<string>("");
  const [municipalityId, setMunicipalityId] = useState<string>("");
  const [direccion, setDireccion] = useState<string>("");
  const [codigoPostal, setCodigoPostal] = useState<string>("");
  const [pais, setPais] = useState<string>("");
  const [ciudad, setCiudad] = useState<string>("");

  // Advanced fields
  const [email, setEmail] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [telefono2, setTelefono2] = useState<string>("");
  const [celular, setCelular] = useState<string>("");

  // Commercial fields
  const [plazoPago, setPlazoPago] = useState<string>("");
  const [listaPrecios, setListaPrecios] = useState<string>("");
  const [vendedor, setVendedor] = useState<string>("");
  const [enviarEstadoCuenta, setEnviarEstadoCuenta] = useState<boolean>(false);

  // Accounting and comments
  const [cuentaCobrar, setCuentaCobrar] = useState<string>("");
  const [cuentaPagar, setCuentaPagar] = useState<string>("");
  const [comentarios, setComentarios] = useState<string>("");

  // Loading states
  const [autocompleting, setAutocompleting] = useState<boolean>(false);
  const [creating, setCreating] = useState<boolean>(false);

  // Accordion Sections (for advanced mode)
  const [expandedSections, setExpandedSections] = useState({
    datosGenerales: true,
    infoContacto: false,
    personasAsociadas: false,
    infoComercial: false,
    contabilidad: false,
    comentarios: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Reset form when modal opens, then apply prefilled data if present
  useEffect(() => {
    if (isOpen) {
      setMode("simple");
      setDocNumber("");
      setNombres("");
      setApellidos("");
      setRegistrationName("");
      setMunicipalityId("");
      setDireccion("");
      setCodigoPostal("");
      setPais("");
      setCiudad("");
      setEmail("");
      setTelefono("");
      setTelefono2("");
      setCelular("");
      setPlazoPago("");
      setListaPrecios("");
      setVendedor("");
      setCuentaCobrar("");
      setCuentaPagar("");
      setComentarios("");
      setEnviarEstadoCuenta(false);
      setErrors({});
      setContactTypes(["cliente"]);
      setExpandedSections({
        datosGenerales: true,
        infoContacto: false,
        personasAsociadas: false,
        infoComercial: false,
        contabilidad: false,
        comentarios: false,
      });

      // Default doc type to first catalog element
      if (catalogData?.typeDocumentIdentifications?.length > 0) {
        setDocType(catalogData.typeDocumentIdentifications[0].id.toString());
      }

      // Apply prefilled data from DIAN search
      if (prefilledData) {
        if (prefilledData.docType) setDocType(prefilledData.docType);
        if (prefilledData.docNumber) setDocNumber(prefilledData.docNumber);
        if (prefilledData.nombres !== undefined) setNombres(prefilledData.nombres);
        if (prefilledData.apellidos !== undefined) setApellidos(prefilledData.apellidos);
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
  }, [isOpen, prefilledData, catalogData]);

  // Split full name from DIAN format: APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2
  // The DIAN sends last names first, then first names
  const splitDianName = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length <= 1) {
      // Single word: treat as apellido
      return { apellidos: fullName, nombres: "" };
    }
    if (parts.length === 2) {
      // Two words: first is apellido, second is nombre
      return { apellidos: parts[0], nombres: parts[1] };
    }
    if (parts.length === 3) {
      // Three words: first two are apellidos, last is nombre
      return { apellidos: `${parts[0]} ${parts[1]}`, nombres: parts[2] };
    }
    // Four or more: first two are apellidos, rest are nombres
    return {
      apellidos: `${parts[0]} ${parts[1]}`,
      nombres: parts.slice(2).join(" "),
    };
  };

  // Autocomplete using DIAN Acquirer API
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

        // DIAN convention: APELLIDO1 APELLIDO2 NOMBRE1 NOMBRE2
        const { apellidos: splitA, nombres: splitN } = splitDianName(fullDianName);
        setNombres(splitN);
        setApellidos(splitA);
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


  // Compute document type info for conditional rendering
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
    docTypeName.includes("NIT DE OTRO PAIS") ||
    docTypeName.includes("PASAPORTE") ||
    docTypeName.includes("EXTRANJER") ||
    docTypeName.includes("DOCUMENTO DE IDENTIFICACIÓN EXTRANJERO");

  const dvValue = isNit && docNumber ? validateVerificationDigit(docNumber) : null;

  // Submit and create contact in local backend
  const toggleContactType = (type: "cliente" | "proveedor") => {
    setContactTypes((prev) => {
      if (prev.includes(type)) {
        if (prev.length === 1) return prev; // Do not allow empty selection
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    const cleanNum = docNumber.trim();
    const cleanNombres = nombres.trim();
    const cleanApellidos = apellidos.trim();

    const newErrors: { [key: string]: boolean } = {};
    if (!docType) newErrors.docType = true;
    if (!cleanNum) newErrors.docNumber = true;
    if (!cleanNombres) newErrors.nombres = true;
    if (!cleanApellidos) newErrors.apellidos = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast("Asegúrate de completar todos los campos marcados con * e intenta de nuevo.", "error", "Revisa los campos obligatorios");
      return;
    }
    setErrors({});

    const fullName = `${cleanNombres} ${cleanApellidos}`.trim();
    // Use explicit registration_name if set (from DIAN), otherwise build it
    const finalRegistrationName = registrationName.trim() || fullName;

    setCreating(true);
    try {
      // Construct base payload according to backend specification
      const basePayload: any = {
        registration_name: finalRegistrationName,
        first_name: cleanNombres || null,
        last_name: cleanApellidos || null,
        identification_number: Number(cleanNum) || cleanNum,
        verification_digit: dvValue !== null ? Number(dvValue) : null,
        type_document_identification_id: Number(docType),
        type_organization_id: isNit ? 1 : 2, // 1 Jurídica, 2 Natural
        type_regime_id: isNit ? 1 : 2, // 1 Común, 2 Simplificado
        type_liabilities: [5], // Default liabilities
        email: email.trim() || `cliente_${cleanNum}@dian.com`,
        phone1: celular.trim() || telefono.trim() || null,
        address: direccion.trim() || null,
        commercial_registration: null,
      };

      if (isForeigner) {
        basePayload.city = ciudad.trim() || null;
        basePayload.country_id = pais ? Number(pais) : null;
      } else {
        basePayload.municipality_id = municipalityId ? Number(municipalityId) : null;
      }

      let createdContact = null;

      if (contactTypes.includes("cliente")) {
        const res = await customersApi.createCustomer({ ...basePayload, type_contact: 1 });
        createdContact = res?.data?.customer || res?.data || res;
      }

      if (contactTypes.includes("proveedor")) {
        const res = await providersApi.createProvider({ ...basePayload, type_contact: 2 });
        // Use provider as result only if no customer was created
        if (!createdContact) {
          createdContact = res?.data?.provider || res?.data || res;
        }
      }

      if (createdContact) {
        showToast("Contacto creado exitosamente", "success");
        onCustomerCreated(createdContact);
        onClose();
      } else {
        throw new Error("No se pudo obtener la respuesta del servidor");
      }
    } catch (err: any) {
      console.error("Error creating customer:", err);
      const msg = err?.response?.data?.message || err?.message || "Ocurrió un error al crear el contacto";
      showToast(`Error: ${msg}`, "error");
    } finally {
      setCreating(false);
    }
  };

  const documentTypes = catalogData?.typeDocumentIdentifications?.map((doc: any) => ({
    value: doc.id.toString(),
    label: doc.name,
  })) || [];

  const municipalities = catalogData?.municipalities?.map((m: any) => ({
    value: m.id.toString(),
    label: m.name,
  })) || [];

  const countries = catalogData?.countries?.map((c: any) => ({
    value: c.id.toString(),
    label: c.name,
  })) || [];

  const priceLists = catalogData?.priceLists?.map((pl: any) => ({
    value: pl.id.toString(),
    label: pl.name,
  })) || [];

  const commonInputStyle = "w-full bg-white border border-gray-300 rounded-lg h-9 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#00b4a2] focus:border-[#00b4a2] transition-colors";

  // Custom switch class
  const switchLabelStyle = "relative inline-flex items-center cursor-pointer";
  const switchInputStyle = "sr-only peer";
  const switchBoxStyle = "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b4a2]";

  const dialogContentClass = mode === "advanced"
    ? "sm:max-w-[860px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border border-gray-200 bg-white"
    : "sm:max-w-[520px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-xl border border-gray-200 bg-white";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={dialogContentClass}>

        {/* MODAL HEADER — uses DialogHeader + DialogTitle for Radix accessibility */}
        <DialogHeader className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 space-y-0">
          <DialogTitle className="text-lg font-semibold text-slate-800">Nuevo contacto</DialogTitle>
        </DialogHeader>

        {/* MODAL CONTENT CONTAINER */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {mode === "simple" ? (
            /* =========================================================
               FORMULARIO SIMPLE 
               ========================================================= */
            <div className="p-6 space-y-6">
              {/* Cliente vs Proveedor Switcher — multi-select allowed */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleContactType("cliente")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${contactTypes.includes("cliente")
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  Cliente
                  {contactTypes.includes("cliente") && <CheckCircle2 className="w-5 h-5 ml-1" />}
                </button>
                <button
                  type="button"
                  onClick={() => toggleContactType("proveedor")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${contactTypes.includes("proveedor")
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                    }`}
                >
                  Proveedor
                  {contactTypes.includes("proveedor") && <CheckCircle2 className="w-5 h-5 ml-1" />}
                </button>
              </div>

              {/* Crear mediante archivo Box */}
              <div className="border border-dashed border-gray-300 bg-slate-50/50 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 transition-colors flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 text-primary mb-2" />
                <span className="text-sm font-medium text-slate-800 flex items-center gap-1.5 justify-center">
                  Crear mediante archivo <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">Beta</span>
                </span>
                <span className="text-xs text-slate-400 mt-1">
                  Suelta aquí tu archivo PNG, JPG o PDF (máx. 5 MB) o haz clic para subirlo
                </span>
              </div>

              {/* Document fields */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Tipo de identificación *</label>
                  <SearchableSelect
                    value={docType}
                    onValueChange={(val) => { setDocType(val); setErrors(prev => ({ ...prev, docType: false })); }}
                    options={documentTypes}
                    placeholder="Seleccionar tipo"
                    className={`w-full text-foreground ${errors.docType ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.docType && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                </div>

                <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Número de identificación *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Ej: 22950341"
                        value={docNumber}
                        onChange={(e) => { setDocNumber(e.target.value); setErrors(prev => ({ ...prev, docNumber: false })); }}
                        className={`bg-white ${errors.docNumber ? "border-red-500 pr-8" : "border-gray-300"}`}
                      />
                      {errors.docNumber && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                    {errors.docNumber && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                  </div>
                  {isNit && (
                    <div className="space-y-1.5 w-12">
                      <label className="text-xs font-semibold text-slate-600 text-center block">DV</label>
                      <Input
                        type="text"
                        value={dvValue !== null ? dvValue : ""}
                        disabled
                        className="border-gray-300 bg-slate-100 text-center font-semibold disabled:opacity-70"
                      />
                    </div>
                  )}
                  <div className="space-y-1.5">
                    {/* Empty label spacer */}
                    <label className="text-xs font-semibold text-transparent block">.</label>
                    <button
                      type="button"
                      onClick={handleAutocomplete}
                      disabled={autocompleting}
                      className="bg-[#2a59d9]/90 text-white hover:bg-[#2a59d9] h-9 text-xs font-bold px-4 rounded-lg flex items-center justify-center gap-1 transition-colors border-none disabled:opacity-50"
                    >
                      {autocompleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      Autocompletar
                    </button>
                  </div>
                </div>

                {/* Names and Last names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Nombres *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Ej: FABIOLA ESTHER"
                        value={nombres}
                        onChange={(e) => { setNombres(e.target.value); setErrors(prev => ({ ...prev, nombres: false })); }}
                        className={`bg-white ${errors.nombres ? "border-red-500 pr-8" : "border-gray-300"}`}
                      />
                      {errors.nombres && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                    {errors.nombres && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Apellidos *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Ej: PALACIO SALGADO"
                        value={apellidos}
                        onChange={(e) => { setApellidos(e.target.value); setErrors(prev => ({ ...prev, apellidos: false })); }}
                        className={`bg-white ${errors.apellidos ? "border-red-500 pr-8" : "border-gray-300"}`}
                      />
                      {errors.apellidos && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                    {errors.apellidos && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                  </div>
                </div>

                {/* Foreigner location fields conditionally rendered */}
                {isForeigner && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">País</label>
                      <SearchableSelect
                        value={pais}
                        onValueChange={setPais}
                        options={countries}
                        placeholder="País"
                        className="w-full text-foreground border-gray-300"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Ciudad</label>
                      <Input
                        type="text"
                        placeholder="Ciudad"
                        value={ciudad}
                        onChange={(e) => setCiudad(e.target.value)}
                        className="bg-white border-gray-300"
                      />
                    </div>
                  </div>
                )}

                {/* Municipality / Dept */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Municipio / Departamento</label>
                  <SearchableSelect
                    value={municipalityId}
                    onValueChange={setMunicipalityId}
                    options={municipalities}
                    placeholder="Seleccionar municipio"
                    className="w-full text-foreground border-gray-300"
                  />
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Dirección</label>
                  <Input
                    type="text"
                    placeholder="Dirección del domicilio"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================
               FORMULARIO AVANZADO 
               ========================================================= */
            <div className="flex flex-col md:flex-row h-full min-h-[460px] bg-slate-50/30">
              {/* Left Column (Collapsible Accordion Form) */}
              <div className="flex-1 p-6 space-y-4 border-r border-gray-100 max-h-[60vh] overflow-y-auto">
                {/* 1. SECCIÓN: DATOS GENERALES */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("datosGenerales")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Datos generales</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Incluye los datos principales de tu nuevo contacto</p>
                    </div>
                    {expandedSections.datosGenerales ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.datosGenerales && (
                    <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                      {/* Cliente / Proveedor Switcher — multi-select allowed */}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleContactType("cliente")}
                          className={`flex-1 py-1.5 px-4 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${contactTypes.includes("cliente")
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                          Cliente
                          {contactTypes.includes("cliente") && <CheckCircle2 className="w-4 h-4 ml-1" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleContactType("proveedor")}
                          className={`flex-1 py-1.5 px-4 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${contactTypes.includes("proveedor")
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                            }`}
                        >
                          Proveedor
                          {contactTypes.includes("proveedor") && <CheckCircle2 className="w-4 h-4 ml-1" />}
                        </button>
                      </div>

                      {/* File Upload Box */}
                      <div className="border border-dashed border-gray-300 bg-slate-50/50 rounded-xl p-5 text-center cursor-pointer hover:bg-slate-50 transition-colors flex flex-col items-center justify-center">
                        <UploadCloud className="w-6 h-6 text-[#00b4a2] mb-1.5" />
                        <span className="text-xs font-semibold text-slate-800">
                          Crear mediante archivo <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded-full font-bold ml-1">Beta</span>
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Suelta aquí tu archivo PNG, JPG o PDF (máx. 5 MB) o haz clic para subirlo
                        </span>
                      </div>

                      {/* ID Fields */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Tipo de identificación *</label>
                          <SearchableSelect
                            value={docType}
                            onValueChange={(val) => { setDocType(val); setErrors(prev => ({ ...prev, docType: false })); }}
                            options={documentTypes}
                            placeholder="Tipo"
                            className={`w-full text-foreground ${errors.docType ? "border-red-500" : "border-gray-300"}`}
                          />
                          {errors.docType && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                        </div>

                        <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-end">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Número de identificación *</label>
                            <div className="relative">
                              <Input
                                type="text"
                                placeholder="Ej: 22950341"
                                value={docNumber}
                                onChange={(e) => { setDocNumber(e.target.value); setErrors(prev => ({ ...prev, docNumber: false })); }}
                                className={errors.docNumber ? "border-red-500 pr-8" : "border-gray-300"}
                              />
                              {errors.docNumber && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                            </div>
                            {errors.docNumber && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                          </div>
                          {isNit && (
                            <div className="space-y-1.5 w-12">
                              <label className="text-xs font-semibold text-slate-600 text-center block">DV</label>
                              <Input
                                type="text"
                                value={dvValue !== null ? dvValue : ""}
                                disabled
                                className="border-gray-300 bg-slate-100 text-center font-semibold disabled:opacity-70"
                              />
                            </div>
                          )}
                          <div className="space-y-1.5">
                            {/* Empty label spacer to align button with inputs */}
                            <label className="text-xs font-semibold text-transparent block">.</label>
                            <button
                              type="button"
                              onClick={handleAutocomplete}
                              disabled={autocompleting}
                              className="bg-[#2a59d9]/90 text-white hover:bg-[#2a59d9] h-9 text-xs font-bold px-4 rounded-lg flex items-center justify-center gap-1 transition-colors border-none disabled:opacity-50"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Autocompletar
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Names & Last Names */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Nombres *</label>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Nombres"
                              value={nombres}
                              onChange={(e) => { setNombres(e.target.value); setErrors(prev => ({ ...prev, nombres: false })); }}
                              className={errors.nombres ? "border-red-500 pr-8" : "border-gray-300"}
                            />
                            {errors.nombres && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                          </div>
                          {errors.nombres && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Apellidos *</label>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Apellidos"
                              value={apellidos}
                              onChange={(e) => { setApellidos(e.target.value); setErrors(prev => ({ ...prev, apellidos: false })); }}
                              className={errors.apellidos ? "border-red-500 pr-8" : "border-gray-300"}
                            />
                            {errors.apellidos && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                          </div>
                          {errors.apellidos && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                        </div>
                      </div>

                      {/* Foreigner location fields conditionally rendered */}
                      {isForeigner && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">País</label>
                            <SearchableSelect
                              value={pais}
                              onValueChange={setPais}
                              options={countries}
                              placeholder="País"
                              className="w-full text-foreground border-gray-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-600">Ciudad</label>
                            <Input
                              type="text"
                              placeholder="Ciudad"
                              value={ciudad}
                              onChange={(e) => setCiudad(e.target.value)}
                              className="border-gray-300"
                            />
                          </div>
                        </div>
                      )}

                      {/* Municipality */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Municipio / Departamento</label>
                        <SearchableSelect
                          value={municipalityId}
                          onValueChange={setMunicipalityId}
                          options={municipalities}
                          placeholder="Municipio"
                          className="w-full text-foreground border-gray-300"
                        />
                      </div>

                      {/* Address & Postal Code */}
                      <div className="grid grid-cols-[1fr_120px] gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Dirección</label>
                          <Input
                            type="text"
                            placeholder="Dirección del domicilio"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Código postal</label>
                          <Input
                            type="text"
                            placeholder="Código"
                            value={codigoPostal}
                            onChange={(e) => setCodigoPostal(e.target.value)}
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. SECCIÓN: INFORMACIÓN DE CONTACTO */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("infoContacto")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Información de contacto</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Agrega estos datos para comunicarte en cualquier momento</p>
                    </div>
                    {expandedSections.infoContacto ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.infoContacto && (
                    <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Correo electrónico</label>
                        <Input
                          type="email"
                          placeholder="Ej: correo@empresa.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="bg-white border-gray-300"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Teléfono</label>
                          <Input
                            type="text"
                            placeholder="Teléfono fijo"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="bg-white border-gray-300"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Teléfono 2</label>
                          <Input
                            type="text"
                            placeholder="Otro número"
                            value={telefono2}
                            onChange={(e) => setTelefono2(e.target.value)}
                            className="bg-white border-gray-300"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Celular</label>
                        <Input
                          type="text"
                          placeholder="Celular de contacto"
                          value={celular}
                          onChange={(e) => setCelular(e.target.value)}
                          className="bg-white border-gray-300"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. SECCIÓN: PERSONAS ASOCIADAS */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("personasAsociadas")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Personas asociadas</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Vincula los datos de personas relacionadas a este contacto</p>
                    </div>
                    {expandedSections.personasAsociadas ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.personasAsociadas && (
                    <div className="p-5 border-t border-gray-100 bg-white">
                      <button
                        type="button"
                        className="py-1.5 px-3 border border-[#00b4a2]/30 text-[#008f80] hover:bg-[#e2f7f4]/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Asociar persona
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. SECCIÓN: INFORMACIÓN COMERCIAL */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("infoComercial")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Información comercial</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Agrega los datos administrativos y condiciones comerciales</p>
                    </div>
                    {expandedSections.infoComercial ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.infoComercial && (
                    <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Plazo de pago</label>
                        <Select value={plazoPago} onValueChange={setPlazoPago}>
                          <SelectTrigger className="w-full bg-white h-9 border border-gray-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                            <SelectValue placeholder="Seleccionar plazo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0" className="cursor-pointer">De contado</SelectItem>
                            <SelectItem value="8" className="cursor-pointer">8 días</SelectItem>
                            <SelectItem value="15" className="cursor-pointer">15 días</SelectItem>
                            <SelectItem value="30" className="cursor-pointer">30 días</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Lista de precios</label>
                          <SearchableSelect
                            value={listaPrecios}
                            onValueChange={setListaPrecios}
                            options={priceLists}
                            placeholder="Seleccionar lista"
                            className="w-full text-foreground"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Vendedor</label>
                          <Select value={vendedor} onValueChange={setVendedor}>
                            <SelectTrigger className="w-full bg-white h-9 border border-gray-300 rounded-lg hover:bg-slate-50 cursor-pointer">
                              <SelectValue placeholder="Seleccionar vendedor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="andres" className="cursor-pointer">Andrés Leones</SelectItem>
                              <SelectItem value="maria" className="cursor-pointer">María Gómez</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          className="py-1.5 px-3 border border-[#00b4a2]/30 text-[#008f80] hover:bg-[#e2f7f4]/40 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Agregar sucursal
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. SECCIÓN: CONFIGURACIÓN PARA CONTABILIDAD */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("contabilidad")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Configuración para contabilidad</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Elige las cuentas contables que recibirán los movimientos de valores pendientes de pago. <span className="text-primary cursor-pointer hover:underline">Ver más</span></p>
                    </div>
                    {expandedSections.contabilidad ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.contabilidad && (
                    <div className="p-5 border-t border-gray-100 bg-white space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            Cuenta por cobrar <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          </label>
                          <Select value={cuentaCobrar} onValueChange={setCuentaCobrar}>
                            <SelectTrigger className="w-full bg-white h-9 border border-gray-300 rounded-lg hover:bg-slate-50 cursor-pointer text-sm">
                              <SelectValue placeholder="Cuentas por cobrar clien..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="130505" className="cursor-pointer">130505 - Clientes nacionales</SelectItem>
                              <SelectItem value="130510" className="cursor-pointer">130510 - Clientes del exterior</SelectItem>
                              <SelectItem value="130515" className="cursor-pointer">130515 - Cuentas corrientes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                            Cuenta por pagar <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          </label>
                          <Select value={cuentaPagar} onValueChange={setCuentaPagar}>
                            <SelectTrigger className="w-full bg-white h-9 border border-gray-300 rounded-lg hover:bg-slate-50 cursor-pointer text-sm">
                              <SelectValue placeholder="Cuentas por pagar a pro..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="220505" className="cursor-pointer">220505 - Proveedores nacionales</SelectItem>
                              <SelectItem value="220510" className="cursor-pointer">220510 - Proveedores del exterior</SelectItem>
                              <SelectItem value="220515" className="cursor-pointer">220515 - Costos y gastos por pagar</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. SECCIÓN: COMENTARIOS */}
                <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleSection("comentarios")}
                    className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">Comentarios</span>
                      <p className="text-xs text-slate-400 font-normal mt-0.5">Registra aquí las observaciones importantes sobre tu contacto.</p>
                    </div>
                    {expandedSections.comentarios ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>

                  {expandedSections.comentarios && (
                    <div className="p-5 border-t border-gray-100 bg-white space-y-3">
                      <div className="flex items-start gap-3">
                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                          A
                        </div>
                        <div className="flex-1 space-y-2">
                          <textarea
                            placeholder="Escribe un comentario..."
                            value={comentarios}
                            onChange={(e) => setComentarios(e.target.value)}
                            rows={4}
                            className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors resize-none"
                          />
                          <p className="text-[11px] text-slate-400">Solo tú puedes ver los comentarios</p>
                          <div className="flex justify-end">
                            <button
                              type="button"
                              className="px-4 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              Comentar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column (Live Preview Card) */}
              <div className="w-full md:w-[280px] p-6 shrink-0 bg-slate-50/30 flex flex-col gap-4">
                <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Nombre del contacto</span>
                    <h4 className="text-sm font-bold text-slate-800 break-words leading-tight uppercase">
                      {nombres.trim() || apellidos.trim() ? `${nombres} ${apellidos}`.trim() : "Nuevo contacto"}
                    </h4>
                  </div>

                  <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                        Enviar estado de cuenta
                        <HelpCircle className="w-3 h-3 text-slate-400" />
                      </span>
                    </div>
                    <label className={switchLabelStyle}>
                      <input
                        type="checkbox"
                        checked={enviarEstadoCuenta}
                        onChange={(e) => setEnviarEstadoCuenta(e.target.checked)}
                        className={switchInputStyle}
                      />
                      <div className={switchBoxStyle}></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
          {mode === "simple" ? (
            <button
              type="button"
              onClick={() => setMode("advanced")}
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
              disabled={creating}
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
