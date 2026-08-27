"use client";

import { CheckCircle2, Loader2, Sparkles, AlertCircle, UploadCloud, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useContactForm } from "./ContactFormProvider";
import { validateVerificationDigit } from "@/utils/validate-verification-digit";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ContactBasicFormProps {
  catalogData: any;
  onAutocomplete: () => void;
}

export function ContactBasicForm({ catalogData, onAutocomplete }: ContactBasicFormProps) {
  const {
    contactTypes, toggleContactType,
    docType, setDocType,
    docNumber, setDocNumber,
    firstName, setFirstName,
    lastName, setLastName,
    registrationName, setRegistrationName,
    typeOrganizationId, setTypeOrganizationId,
    typeRegimeId, setTypeRegimeId,
    typeLiabilityId, setTypeLiabilityId,
    municipalityId, setMunicipalityId,
    address, setAddress,
    postalCode, setPostalCode,
    country, setCountry,
    city, setCity,
    email, setEmail,
    phone1, setPhone1,
    autocompleting,
    errors, setErrors
  } = useContactForm();

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

  const selectedDocTypeObj = catalogData?.typeDocumentIdentifications?.find(
    (d: any) => d.id.toString() === docType
  );
  const docTypeName = selectedDocTypeObj?.name?.toUpperCase() || "";
  const docTypeCode = selectedDocTypeObj?.code?.toUpperCase() || "";
  const normalizedDocName = docTypeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const isNit = normalizedDocName.includes("NIT") && !normalizedDocName.includes("OTRO PAIS");
  const isForeigner =
    normalizedDocName.includes("NIT DE OTRO PAIS") ||
    normalizedDocName.includes("PASAPORTE") ||
    normalizedDocName.includes("TARJETA DE EXTRANJER") ||
    normalizedDocName.includes("DOCUMENTO DE IDENTIFICACION EXTRANJERO");

  const isForeignerNit = normalizedDocName.includes("NIT DE OTRO PAIS");

  const useRegistrationName = (isNit || isForeignerNit) && typeOrganizationId !== "2";

  const dvValue = isNit && docNumber ? validateVerificationDigit(docNumber) : null;

  const typeOrganizations = catalogData?.typeOrganizations?.map((o: any) => ({
    value: o.id.toString(),
    label: o.name,
  })) || [
      { value: "1", label: "Persona jurídica" },
      { value: "2", label: "Persona natural" },
    ];

  const typeRegimes = catalogData?.typeRegimes?.map((r: any) => ({
    value: r.id.toString(),
    label: r.name,
  })) || [
      { value: "1", label: "Responsable de IVA" },
      { value: "2", label: "No responsable de IVA" },
    ];

  const typeLiabilities = catalogData?.typeLiabilities?.map((l: any) => ({
    value: l.id.toString(),
    label: l.name,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Cliente vs Proveedor Switcher */}
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
                placeholder="Ej: 123456789"
                value={docNumber}
                onChange={(e) => { setDocNumber(e.target.value); setErrors(prev => ({ ...prev, docNumber: false })); }}
                className={`bg-white ${errors.docNumber === "warning" ? "border-orange-500 pr-8 focus-visible:ring-orange-500" : errors.docNumber ? "border-red-500 pr-8" : "border-gray-300"}`}
              />
              {errors.docNumber === "warning" ? (
                <AlertCircle className="w-4 h-4 text-orange-500 absolute right-3 top-1/2 -translate-y-1/2" />
              ) : errors.docNumber ? (
                <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />
              ) : null}
            </div>
            {errors.docNumber && errors.docNumber !== "warning" && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
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
            <label className="text-xs font-semibold text-transparent block">.</label>
            <button
              type="button"
              onClick={onAutocomplete}
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

        {/* Names and Last names or Registration Name */}
        {useRegistrationName && !isForeignerNit && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Razón social o nombre completo *</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Razón social o nombre completo"
                value={registrationName}
                onChange={(e) => { setRegistrationName(e.target.value); setErrors(prev => ({ ...prev, registrationName: false })); }}
                className={`bg-white ${errors.registrationName ? "border-red-500 pr-8" : "border-gray-300"}`}
              />
              {errors.registrationName && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
            </div>
            {errors.registrationName && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
          </div>
        )}

        {isForeignerNit && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Razón social o nombre completo *</label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Razón social o nombre completo"
                value={registrationName}
                onChange={(e) => { setRegistrationName(e.target.value); setErrors(prev => ({ ...prev, registrationName: false })); }}
                className={`bg-white ${errors.registrationName ? "border-red-500 pr-8" : "border-gray-300"}`}
              />
              {errors.registrationName && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
            </div>
            {errors.registrationName && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
          </div>
        )}

        {!useRegistrationName && !isForeignerNit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Nombres *</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ej: JUAN CARLOS"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: false })); }}
                  className={`bg-white ${errors.firstName ? "border-red-500 pr-8" : "border-gray-300"}`}
                />
                {errors.firstName && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
              </div>
              {errors.firstName && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Apellidos *</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Ej: PEREZ GOMEZ"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: false })); }}
                  className={`bg-white ${errors.lastName ? "border-red-500 pr-8" : "border-gray-300"}`}
                />
                {errors.lastName && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
              </div>
              {errors.lastName && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
            </div>
          </div>
        )}

        {isNit && !isForeignerNit && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Tipo de persona *</label>
              <SearchableSelect
                value={typeOrganizationId}
                onValueChange={(val) => { setTypeOrganizationId(val); setErrors(prev => ({ ...prev, typeOrganizationId: false })); }}
                options={typeOrganizations}
                placeholder="Seleccionar tipo de persona"
                className={`w-full text-foreground ${errors.typeOrganizationId ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.typeOrganizationId && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 truncate" title="Responsabilidad tributaria *">Resp. tributaria *</label>
              <SearchableSelect
                value={typeRegimeId}
                onValueChange={(val) => { setTypeRegimeId(val); setErrors(prev => ({ ...prev, typeRegimeId: false })); }}
                options={typeRegimes}
                placeholder="Seleccionar"
                className={`w-full text-foreground ${errors.typeRegimeId ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.typeRegimeId && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 truncate" title="Responsabilidad fiscal">Resp. fiscal</label>
              <SearchableSelect
                value={typeLiabilityId}
                onValueChange={(val) => { setTypeLiabilityId(val); setErrors(prev => ({ ...prev, typeLiabilityId: false })); }}
                options={typeLiabilities}
                placeholder="Seleccionar res. fiscal"
                className="w-full text-foreground border-gray-300"
              />
            </div>
          </div>
        )}

        {/* Foreigner location fields */}
        {isForeigner && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">País</label>
              <SearchableSelect
                value={country}
                onValueChange={setCountry}
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
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
          </div>
        )}

        {/* Email and Phone 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              Correo electrónico *
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#2A2A2A] text-white text-xs px-3 py-2 border-none">
                    <p className="max-w-[220px] text-center">Ingresa el correo donde tu contacto recibirá sus facturas.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
            <div className="relative">
              <Input
                type="email"
                placeholder="Ej: correo@empresa.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: false })); }}
                className={`bg-white ${errors.email ? "border-red-500 pr-8" : "border-gray-300"}`}
              />
              {errors.email && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
            </div>
            {errors.email && (
              <span className="text-red-500 text-[10px] mt-1 block">
                {errors.email === "invalid" ? "El correo electrónico no tiene un formato válido" : "Este campo es obligatorio"}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Teléfono</label>
            <Input
              type="text"
              placeholder="Teléfono fijo"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
        </div>

        {/* Municipality */}
        {!isForeigner && (
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
        )}

        {/* Address and Postal Code */}
        <div className={`grid grid-cols-1 ${!isForeignerNit ? "md:grid-cols-[1fr_150px]" : ""} gap-4`}>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-600">Dirección</label>
            <Input
              type="text"
              placeholder="Dirección del domicilio"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="bg-white border-gray-300"
            />
          </div>
          {!isForeignerNit && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Código postal</label>
              <Input
                type="text"
                placeholder="Código"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="bg-white border-gray-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
