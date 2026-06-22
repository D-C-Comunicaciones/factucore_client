import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ContactDetailGeneralProps {
    contact: any;
}

export function ContactDetailGeneral({ contact }: ContactDetailGeneralProps) {
    const isCustomer = contact.type_contact_ids?.includes(1) || contact.type_contacts?.some((tc: any) => tc.id === 1) || true;
    const isProvider = contact.type_contact_ids?.includes(2) || contact.type_contacts?.some((tc: any) => tc.id === 2) || false;
    
    // We determine the active radio based on type. Defaults to 'cliente' if it's both or customer.
    const contactType = isCustomer ? "cliente" : "proveedor";

    const Field = ({ label, value }: { label: string, value: string }) => (
        <div className="flex flex-col border-b border-slate-100 pb-2">
            <span className="text-sm font-medium text-[#0F2843] mb-1">{label}</span>
            <span className="text-[15px] text-slate-600">{value || "-"}</span>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Datos generales */}
            <section>
                <h2 className="text-[17px] font-bold text-[#0F2843] mb-6">Datos generales</h2>
                
                <div className="mb-6 flex items-center gap-6">
                    <RadioGroup defaultValue={contactType} className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cliente" id="r-cliente" className="text-primary border-primary" disabled />
                            <Label htmlFor="r-cliente" className="text-sm font-medium text-slate-700">Cliente</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="proveedor" id="r-proveedor" disabled />
                            <Label htmlFor="r-proveedor" className="text-sm font-medium text-slate-700">Proveedor</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="mb-6 w-full md:w-2/3">
                    <Field label="Nombre" value={contact.registration_name || contact.name || contact.names || contact.company || ''} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <Field label="Tipo de identificación" value={contact.identification_document?.name || "CC - Cédula de ciudadanía"} />
                    <Field label="Número de identificación" value={contact.identification_number || contact.identification || ''} />
                    <Field label="Municipio / Departamento" value={contact.municipality?.name ? `${contact.municipality.name}, ${contact.municipality.department?.name || ''}` : ''} />
                    
                    <Field label="Código postal" value={contact.postal_code || ''} />
                    <Field label="País" value={contact.country || "Colombia"} />
                    <div className="hidden md:block"></div>
                </div>

                <div className="mt-6 w-full md:w-2/3">
                    <Field label="Dirección" value={contact.address || ''} />
                </div>
            </section>

            {/* Información de contacto */}
            <section>
                <h2 className="text-[17px] font-bold text-[#0F2843] mb-6">Información de contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <Field label="Correo electrónico" value={contact.email || ''} />
                    <Field label="Correo electrónico 2" value={contact.email2 || ''} />
                    <Field label="Celular" value={contact.mobile || ''} />
                    
                    <Field label="Teléfono" value={contact.phone1 || contact.phone || ''} />
                    <Field label="Teléfono 2" value={contact.phone2 || ''} />
                    <div className="hidden md:block"></div>
                </div>
            </section>

            {/* Información comercial */}
            <section>
                <h2 className="text-[17px] font-bold text-[#0F2843] mb-6">Información comercial</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <Field label="Plazo de pago" value={contact.payment_term?.name || "Ninguno"} />
                    <Field label="Vendedor" value={contact.seller?.name || "Ninguno"} />
                    <Field label="Lista de precios" value={contact.price_list?.name || "Ninguna"} />
                </div>
                <div className="mt-6 w-full md:w-1/3">
                    <Field label="Límite de crédito ⓘ" value={contact.credit_limit ? `$ ${contact.credit_limit}` : "Sin límite"} />
                </div>
            </section>

            {/* Configuración para contabilidad */}
            <section>
                <h2 className="text-[17px] font-bold text-[#0F2843] mb-6">Configuración para contabilidad</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <Field label="Cuenta por cobrar" value={contact.account_receivable?.name || "Cuentas por cobrar clientes nacionales"} />
                    <Field label="Cuenta por pagar" value={contact.account_payable?.name || "Cuentas por pagar a proveedores naci..."} />
                </div>
            </section>
        </div>
    );
}
