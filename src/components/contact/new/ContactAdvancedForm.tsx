"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, UploadCloud, AlertCircle, Sparkles, HelpCircle, Plus, Edit2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useContactForm } from "./ContactFormProvider";
import { ContactCommercialInfo } from "./ContactCommercialInfo";
import { ContactAccountingInfo } from "./ContactAccountingInfo";
import { ContactComments } from "./ContactComments";
import { showToast } from "@/components/sonner/CustomToaster";
import { validateVerificationDigit } from "@/utils/validate-verification-digit";

interface ContactAdvancedFormProps {
  catalogData: any;
  onAutocomplete: () => void;
}

export function ContactAdvancedForm({ catalogData, onAutocomplete }: ContactAdvancedFormProps) {
  const [expandedGen, setExpandedGen] = useState(true);
  const [expandedContact, setExpandedContact] = useState(true);

  const {
    contactTypes, toggleContactType,
    docType, setDocType,
    docNumber, setDocNumber,
    firstName, setFirstName,
    lastName, setLastName,
    municipalityId, setMunicipalityId,
    address, setAddress,
    postalCode, setPostalCode,
    country, setCountry,
    city, setCity,
    email, setEmail,
    phone1, setPhone1,
    phone2, setPhone2,
    mobile, setMobile,
    sendAccountStatement, setSendAccountStatement,
    associatedPersons, setAssociatedPersons,
    autocompleting,
    errors, setErrors
  } = useContactForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);

  const [personNombre, setPersonNombre] = useState("");
  const [personNombreError, setPersonNombreError] = useState(false);
  const [personApellidos, setPersonApellidos] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [personCelular, setPersonCelular] = useState("");
  const [personTelefono, setPersonTelefono] = useState("");
  const [personNotify, setPersonNotify] = useState(false);

  const openNewPersonModal = () => {
    setEditingPersonId(null);
    setPersonNombre("");
    setPersonNombreError(false);
    setPersonApellidos("");
    setPersonEmail("");
    setPersonCelular("");
    setPersonTelefono("");
    setPersonNotify(false);
    setIsModalOpen(true);
  };

  const openEditPersonModal = (index: number) => {
    const person = associatedPersons[index];
    setEditingPersonId(index.toString());
    setPersonNombre(person.first_name || "");
    setPersonNombreError(false);
    setPersonApellidos(person.last_name || "");
    setPersonEmail(person.email || "");
    setPersonCelular(person.mobile || "");
    setPersonTelefono(person.phone || "");
    setPersonNotify(person.send_notifications || false);
    setIsModalOpen(true);
  };

  const deletePerson = (index: number) => {
    const newList = [...associatedPersons];
    newList.splice(index, 1);
    setAssociatedPersons(newList);
  };

  const savePerson = () => {
    if (!personNombre.trim()) {
      setPersonNombreError(true);
      showToast(
        "Asegúrate de completar todos los campos marcados con * e intenta de nuevo.",
        "error",
        "Revisa los campos obligatorios"
      );
      return;
    }
    const personData = {
      first_name: personNombre,
      last_name: personApellidos,
      email: personEmail,
      mobile: personCelular,
      phone: personTelefono,
      send_notifications: personNotify,
    };

    if (editingPersonId !== null) {
      const newList = [...associatedPersons];
      newList[Number(editingPersonId)] = personData;
      setAssociatedPersons(newList);
    } else {
      setAssociatedPersons([...associatedPersons, personData]);
    }
    setIsModalOpen(false);
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

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-4 min-h-0">
        {/* 1. SECCIÓN: DATOS GENERALES */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedGen(!expandedGen)}
            className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
          >
            <div>
              <span className="text-sm font-semibold text-slate-800">Datos generales</span>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Incluye los datos principales de tu nuevo contacto</p>
            </div>
            {expandedGen ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${expandedGen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleContactType("cliente")}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all flex items-center justify-between outline-none focus:outline-none focus:ring-0 ${contactTypes.includes("cliente")
                      ? "bg-primary/15 text-primary border-transparent hover:bg-primary/25"
                      : "bg-white text-slate-800 border-gray-300 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                  >
                    <span>Cliente</span>
                    {contactTypes.includes("cliente") && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleContactType("proveedor")}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium border transition-all flex items-center justify-between outline-none focus:outline-none focus:ring-0 ${contactTypes.includes("proveedor")
                      ? "bg-primary/15 text-primary border-transparent hover:bg-primary/25"
                      : "bg-white text-slate-800 border-gray-300 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                  >
                    <span>Proveedor</span>
                    {contactTypes.includes("proveedor") && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group">
                  <UploadCloud className="w-8 h-8 text-black mb-3 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs font-semibold text-slate-800">
                    Crear mediante archivo <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded-full font-bold ml-1">Beta</span>
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Suelta aquí tu archivo PNG, JPG o PDF (máx. 5 MB) o haz clic para subirlo
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Tipo de identificación *</label>
                    <SearchableSelect
                      value={docType}
                      onValueChange={(val) => { setDocType(val); setErrors(prev => ({ ...prev, docType: false })); }}
                      options={documentTypes}
                      placeholder="Tipo de identificación"
                      className={`w-full text-foreground ${errors.docType ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.docType && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                  </div>

                  <div className={`grid gap-2 items-end ${docType ? (isNit ? "grid-cols-[1fr_auto_auto]" : "grid-cols-[1fr_auto]") : "grid-cols-1"}`}>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Número de identificación *</label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Ej: 1234567890"
                          value={docNumber}
                          onChange={(e) => { setDocNumber(e.target.value.replace(/\D/g, '')); setErrors(prev => ({ ...prev, docNumber: false })); }}
                          className={errors.docNumber ? "border-red-500 pr-8" : "border-gray-300"}
                        />
                        {errors.docNumber && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                      </div>
                      {errors.docNumber && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                    </div>
                    {isNit && docType && (
                      <div className="space-y-1.5 w-12 transition-all duration-300 ease-in-out">
                        <label className="text-xs font-semibold text-slate-600 text-center block">DV</label>
                        <Input
                          type="text"
                          value={dvValue !== null ? dvValue : ""}
                          disabled
                          className="border-gray-300 bg-slate-100 text-center font-semibold disabled:opacity-70"
                        />
                      </div>
                    )}
                    <div className={`space-y-1.5 transition-all duration-300 ease-in-out origin-right ${docType ? 'opacity-100 scale-100 w-auto' : 'opacity-0 scale-95 w-0 overflow-hidden pointer-events-none'}`}>
                      <label className="text-xs font-semibold text-transparent block">.</label>
                      <button
                        type="button"
                        onClick={onAutocomplete}
                        disabled={autocompleting}
                        className="bg-[#2a59d9]/90 text-white hover:bg-[#2a59d9] h-9 text-xs font-bold px-4 rounded-lg flex items-center justify-center gap-1 transition-all duration-300 ease-in-out border-none disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        Autocompletar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Nombres *</label>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Nombres"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setErrors(prev => ({ ...prev, firstName: false })); }}
                        className={errors.firstName ? "border-red-500 pr-8" : "border-gray-300"}
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
                        placeholder="Apellidos"
                        value={lastName}
                        onChange={(e) => { setLastName(e.target.value); setErrors(prev => ({ ...prev, lastName: false })); }}
                        className={errors.lastName ? "border-red-500 pr-8" : "border-gray-300"}
                      />
                      {errors.lastName && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
                    </div>
                    {errors.lastName && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
                  </div>
                </div>

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
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                )}

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

                <div className="grid grid-cols-[1fr_120px] gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                      Dirección
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-800 text-white border-slate-800">
                          Se recomienda usar la dirección para la emisión de facturas donde la venta se realice fuera de la sede del negocio.
                        </TooltipContent>
                      </Tooltip>
                    </label>
                    <Input
                      type="text"
                      placeholder="Dirección del domicilio"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Código postal</label>
                    <Input
                      type="text"
                      placeholder="Código"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECCIÓN: INFORMACIÓN DE CONTACTO */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <button
            type="button"
            onClick={() => setExpandedContact(!expandedContact)}
            className="w-full px-5 py-4 flex items-center justify-between bg-white text-left font-medium text-slate-800 hover:bg-slate-50/60 transition-colors"
          >
            <div>
              <span className="text-sm font-semibold text-slate-800">Información de contacto</span>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Agrega estos datos para comunicarte en cualquier momento</p>
            </div>
            {expandedContact ? <ChevronUp className="w-4 h-4 text-slate-400 transition-transform duration-300" /> : <ChevronDown className="w-4 h-4 text-slate-400 transition-transform duration-300" />}
          </button>

          <div className={`grid transition-all duration-300 ease-in-out ${expandedContact ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <div className="p-5 border-t border-gray-100 space-y-4 bg-white">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    Correo electrónico
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 text-white border-slate-800">
                        En cada factura enviada por correo, tu cliente recibirá su estado de cuenta.
                      </TooltipContent>
                    </Tooltip>
                  </label>
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
                      value={phone1}
                      onChange={(e) => setPhone1(e.target.value.replace(/\D/g, ''))}
                      className="bg-white border-gray-300"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Teléfono 2</label>
                    <Input
                      type="text"
                      placeholder="Otro número"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value.replace(/\D/g, ''))}
                      className="bg-white border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Celular</label>
                  <Input
                    type="text"
                    placeholder="Celular de contacto"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-5 bg-white">
                <span className="text-sm font-semibold text-slate-800 block mb-1">Personas asociadas</span>
                <p className="text-xs text-slate-500 font-normal mb-4">
                  Vincula los datos de personas relacionadas a este contacto y activa notificaciones de vencimiento para tus clientes. <span className="text-primary cursor-pointer hover:underline">Ver más</span>
                </p>

                {associatedPersons.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {associatedPersons.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-transparent hover:border-gray-200 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                            {p.first_name ? p.first_name.charAt(0).toUpperCase() : ""}
                          </div>
                          <span className="text-sm font-medium text-slate-700">{p.first_name} {p.last_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button type="button" onClick={() => openEditPersonModal(idx)} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => deletePerson(idx)} className="p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={openNewPersonModal}
                  className="py-1.5 px-3 bg-primary/10 text-primary hover:bg-primary/20 border border-transparent text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors w-fit"
                >
                  <Plus className="w-4 h-4" />
                  Asociar persona
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. SECCIÓN: ESTADO DE CUENTA */}
        <div className="border border-gray-200 bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="p-5 flex items-center justify-between bg-white">
            <div className="flex-1 pr-4">
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                Enviar estado de cuenta
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="w-3.5 h-3.5 text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-800 text-white border-slate-800">
                    Enviaremos un correo mensual a este contacto con el resumen de sus saldos y movimientos.
                  </TooltipContent>
                </Tooltip>
              </span>
              <p className="text-xs text-slate-400 font-normal mt-0.5">Activa esta opción para notificar a tu cliente mensualmente</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={sendAccountStatement}
                onChange={(e) => setSendAccountStatement(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>

        {/* Otras secciones */}
        <ContactCommercialInfo catalogData={catalogData} />
        <ContactAccountingInfo catalogData={catalogData} />
        <ContactComments />
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[400px] p-6 bg-white border border-gray-100 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800 border-b border-gray-100 pb-4">
              Asociar persona
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Nombre *</label>
              <div className="relative">
                <Input
                  type="text"
                  value={personNombre}
                  onChange={(e) => { setPersonNombre(e.target.value); setPersonNombreError(false); }}
                  className={personNombreError ? "border-red-500 pr-8" : "border-gray-300"}
                />
                {personNombreError && <AlertCircle className="w-4 h-4 text-red-500 absolute right-3 top-1/2 -translate-y-1/2" />}
              </div>
              {personNombreError && <span className="text-red-500 text-[10px] mt-1 block">Este campo es obligatorio</span>}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Apellidos</label>
              <Input
                type="text"
                value={personApellidos}
                onChange={(e) => setPersonApellidos(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Correo electrónico</label>
              <Input
                type="email"
                value={personEmail}
                onChange={(e) => setPersonEmail(e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Celular</label>
              <Input
                type="text"
                value={personCelular}
                onChange={(e) => setPersonCelular(e.target.value.replace(/\D/g, ''))}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Teléfono</label>
              <Input
                type="text"
                value={personTelefono}
                onChange={(e) => setPersonTelefono(e.target.value.replace(/\D/g, ''))}
                className="border-gray-300"
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="notify"
                checked={personNotify}
                onCheckedChange={(checked) => setPersonNotify(checked as boolean)}
              />
              <label htmlFor="notify" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700 cursor-pointer">
                Enviar notificaciones
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="bg-white text-slate-700 border-gray-300 hover:bg-slate-50">
              Cancelar
            </Button>
            <Button onClick={savePerson} className="bg-primary hover:bg-primary/90 text-white">
              Aceptar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
