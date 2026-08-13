"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { SearchableSelect } from "@/components/ui/searchable-select"
import { IconLoader } from "@tabler/icons-react"
import { Pencil, Upload } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useCatalogs } from "@/hooks/useCatalogs"
import { useUpdateCompanyProfile } from "@/hooks/profile/useCompanyProfile"
import { validateVerificationDigit } from "@/utils/validate-verification-digit"
import { extractFieldErrors } from "@/lib/errors"
import type { CompanyProfileUpdatePayload } from "@/types/auth"

function getInitials(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

function SectionCard({ title, isEditing, onEdit, children }: { title: string, isEditing: boolean, onEdit: () => void, children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-50">
                <h2 className="font-semibold text-foreground text-lg">{title}</h2>
                {!isEditing && (
                    <Button type="button" variant="outline" size="sm" className="cursor-pointer hover:bg-gray-100" onClick={onEdit}>
                        Editar
                    </Button>
                )}
            </div>
            <div className="p-4 md:p-6">
                {children}
            </div>
        </div>
    )
}

function ViewField({ label, value }: { label: string, value?: string | number | null }) {
    return (
        <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-sm font-medium text-foreground">{value || "No registrado"}</p>
        </div>
    )
}

export function CompanyProfileForm() {
    const { municipalities, typeDocumentIdentifications, isLoading: catalogsLoading } = useCatalogs()
    const updateCompanyProfile = useUpdateCompanyProfile()

    const [form, setForm] = useState<CompanyProfileUpdatePayload>({})
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const [editingSection, setEditingSection] = useState<"general" | "basic" | "address" | null>(null)

    const resetDraft = () => {
        const company = AuthService.getCompany<any>()
        if (!company) return
        setForm({
            company_name: company.company_name ?? "",
            identification_number: company.identification_number ?? undefined,
            verification_digit: company.verification_digit ?? undefined,
            email: company.email ?? "",
            phone: company.phone ?? "",
            address: company.address ?? "",
            postal_code: company.postal_code ?? "",
            merchant_registration: company.merchant_registration ?? "",
            municipality_id: company.municipality_id ?? undefined,
            type_document_identification_id: company.type_document_identification_id ?? undefined,

            // Missing fields - fallback to what is stored or default
            person_type: company.person_type ?? "Persona natural",
            first_name: company.first_name ?? "",
            second_name: company.second_name ?? "",
            last_name: company.last_name ?? "",
            nationality_type: company.nationality_type ?? "Nacional",
            tax_responsibility: company.tax_responsibility ?? "No responsable de IVA",
            website: company.website ?? "",
            currency: company.currency ?? "Colombia Peso",
            employees_count: company.employees_count ?? "",
            sector: company.sector ?? "",
            department_id: company.department_id ?? undefined,
        })
    }

    useEffect(() => {
        resetDraft()
    }, [])

    const setField = <K extends keyof CompanyProfileUpdatePayload>(field: K, value: CompanyProfileUpdatePayload[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleIdentificationChange = (value: string) => {
        const numeric = value ? Number(value) : undefined
        setField("identification_number", numeric)
        const dv = value ? validateVerificationDigit(value) : null
        if (dv !== null) setField("verification_digit", dv)
    }

    const municipalityOptions = municipalities?.map((m: any) => ({ value: String(m.id), label: m.name })) || []
    const documentTypeOptions = typeDocumentIdentifications?.map((d: any) => ({ value: String(d.id), label: d.name })) || []

    // Mocked options for new dropdowns
    const departmentOptions = [{ value: "1", label: "Atlántico" }]
    const currencyOptions = [{ value: "Colombia Peso", label: "Colombia Peso" }]
    const taxResponsibilityOptions = [{ value: "No responsable de IVA", label: "No responsable de IVA" }]
    const personTypeOptions = [{ value: "Nacional", label: "Nacional" }, { value: "Extranjero", label: "Extranjero" }]

    const initials = getInitials(form.company_name || form.first_name || "?")

    const isNitSelected = documentTypeOptions.find(o => o.value === String(form.type_document_identification_id))?.label?.toUpperCase().includes("NIT")

    const handleCancel = () => {
        setFieldErrors({})
        resetDraft()
        setEditingSection(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFieldErrors({})
        try {
            await updateCompanyProfile.mutateAsync(form)
            setEditingSection(null)
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6">
                <h1 className="text-xl font-bold text-foreground mb-1">Datos de tu empresa</h1>
                <p className="text-sm text-muted-foreground">Conoce la información que tienes registrada en Factucore sobre tu empresa.</p>
            </div>

            {/* 1. Información General */}
            <SectionCard title="Información general" isEditing={editingSection === "general"} onEdit={() => setEditingSection("general")}>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex flex-col items-center gap-2 shrink-0 md:w-1/4">
                        <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                            {initials}
                        </div>
                        {editingSection === "general" && (
                            <Button type="button" variant="outline" size="sm" disabled className="gap-1.5 cursor-pointer">
                                <Upload className="size-3.5" />
                                Subir foto
                            </Button>
                        )}
                    </div>

                    <div className="flex-1">
                        {editingSection === "general" ? (
                            <FieldGroup>
                                <div className="flex bg-muted/50 p-1 rounded-md mb-4 w-full">
                                    <button type="button" onClick={() => setField("person_type", "Persona natural")} className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-colors ${form.person_type === "Persona natural" ? "bg-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>Persona natural</button>
                                    <button type="button" onClick={() => setField("person_type", "Persona jurídica")} className={`flex-1 py-1.5 text-sm font-medium rounded-sm transition-colors ${form.person_type === "Persona jurídica" ? "bg-white shadow-sm" : "text-muted-foreground hover:bg-muted"}`}>Persona jurídica</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Field>
                                        <FieldLabel>Tipo de identificación <span className="text-primary">*</span></FieldLabel>
                                        <SearchableSelect
                                            value={form.type_document_identification_id ? String(form.type_document_identification_id) : undefined}
                                            onValueChange={(value) => setField("type_document_identification_id", Number(value))}
                                            options={documentTypeOptions}
                                            disabled={catalogsLoading}
                                        />
                                        {fieldErrors.type_document_identification_id && <FieldError>{fieldErrors.type_document_identification_id}</FieldError>}
                                    </Field>

                                    <div className="flex gap-2">
                                        <Field className="flex-1">
                                            <FieldLabel>Número de identificación <span className="text-primary">*</span></FieldLabel>
                                            <Input value={form.identification_number ?? ""} onChange={(e) => handleIdentificationChange(e.target.value)} />
                                            {fieldErrors.identification_number && <FieldError>{fieldErrors.identification_number}</FieldError>}
                                        </Field>
                                        {isNitSelected && (
                                            <Field className="w-16">
                                                <FieldLabel>&nbsp;</FieldLabel>
                                                <Input value={form.verification_digit ?? ""} disabled className="bg-muted text-center cursor-not-allowed" />
                                            </Field>
                                        )}
                                    </div>

                                    <Field>
                                        <FieldLabel>Primer nombre <span className="text-primary">*</span></FieldLabel>
                                        <Input value={form.first_name ?? ""} onChange={(e) => setField("first_name", e.target.value)} />
                                        {fieldErrors.first_name && <FieldError>{fieldErrors.first_name}</FieldError>}
                                    </Field>
                                    <Field>
                                        <FieldLabel>Segundo nombre</FieldLabel>
                                        <Input value={form.second_name ?? ""} onChange={(e) => setField("second_name", e.target.value)} />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Apellidos <span className="text-primary">*</span></FieldLabel>
                                        <Input value={form.last_name ?? ""} onChange={(e) => setField("last_name", e.target.value)} />
                                        {fieldErrors.last_name && <FieldError>{fieldErrors.last_name}</FieldError>}
                                    </Field>
                                    <Field>
                                        <FieldLabel>Nombre comercial</FieldLabel>
                                        <Input value={form.company_name ?? ""} onChange={(e) => setField("company_name", e.target.value)} placeholder="No registrado" />
                                        {fieldErrors.company_name && <FieldError>{fieldErrors.company_name}</FieldError>}
                                    </Field>
                                    <Field>
                                        <FieldLabel>Tipo de persona según nacionalidad <span className="text-primary">*</span></FieldLabel>
                                        <SearchableSelect value={form.nationality_type} onValueChange={(val) => setField("nationality_type", val)} options={personTypeOptions} />
                                    </Field>
                                    <Field>
                                        <FieldLabel>Responsabilidad tributaria <span className="text-primary">*</span></FieldLabel>
                                        <SearchableSelect value={form.tax_responsibility} onValueChange={(val) => setField("tax_responsibility", val)} options={taxResponsibilityOptions} />
                                    </Field>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleCancel} disabled={updateCompanyProfile.isPending}>Cancelar</Button>
                                    <Button type="submit" className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground" disabled={updateCompanyProfile.isPending}>
                                        {updateCompanyProfile.isPending && <IconLoader className="animate-spin mr-2" />}
                                        Guardar
                                    </Button>
                                </div>
                            </FieldGroup>
                        ) : (
                            <div>
                                <div className="flex bg-muted/30 p-2 rounded-md mb-6 w-full justify-center">
                                    <span className="text-sm font-medium">{form.person_type || "Persona natural"}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                                    <ViewField label="Tipo de identificación *" value={documentTypeOptions.find(o => o.value === String(form.type_document_identification_id))?.label} />
                                    <ViewField label="Número de identificación" value={form.identification_number ? (isNitSelected && form.verification_digit != null ? `${form.identification_number} - ${form.verification_digit}` : form.identification_number) : undefined} />
                                    <ViewField label="Primer nombre *" value={form.first_name} />
                                    <ViewField label="Segundo nombre" value={form.second_name} />
                                    <ViewField label="Apellidos *" value={form.last_name} />
                                    <ViewField label="Nombre comercial" value={form.company_name} />
                                    <ViewField label="Tipo de persona según nacionalidad *" value={form.nationality_type} />
                                    <ViewField label="Responsabilidad tributaria *" value={form.tax_responsibility} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SectionCard>

            {/* 2. Información Básica */}
            <SectionCard title="Información básica" isEditing={editingSection === "basic"} onEdit={() => setEditingSection("basic")}>
                {editingSection === "basic" ? (
                    <FieldGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Correo empresarial</FieldLabel>
                                <Input value={form.email ?? ""} onChange={(e) => setField("email", e.target.value)} type="email" />
                                {fieldErrors.email && <FieldError>{fieldErrors.email}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel>Teléfono <span className="text-primary">*</span></FieldLabel>
                                <div className="flex">
                                    <div className="flex items-center gap-1 bg-muted px-3 border border-r-0 border-input rounded-l-md text-sm whitespace-nowrap">
                                        🇨🇴 +57
                                    </div>
                                    <Input className="rounded-l-none" value={form.phone ?? ""} onChange={(e) => setField("phone", e.target.value)} placeholder="No registrado" />
                                </div>
                                {fieldErrors.phone && <FieldError>{fieldErrors.phone}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel>Sitio web</FieldLabel>
                                <div className="flex">
                                    <div className="flex items-center px-3 border border-r-0 border-input bg-muted/30 rounded-l-md text-sm text-muted-foreground whitespace-nowrap">
                                        www.
                                    </div>
                                    <Input className="rounded-l-none" value={form.website ?? ""} onChange={(e) => setField("website", e.target.value)} placeholder="No registrado" />
                                </div>
                            </Field>
                            <Field>
                                <FieldLabel>Moneda</FieldLabel>
                                <SearchableSelect value={form.currency} onValueChange={(val) => setField("currency", val)} options={currencyOptions} />
                            </Field>
                            <Field>
                                <FieldLabel>Número de colaboradores</FieldLabel>
                                <SearchableSelect value={form.employees_count} onValueChange={(val) => setField("employees_count", val)} options={[]} placeholder="No seleccionado" />
                            </Field>
                            <Field>
                                <FieldLabel>Sector</FieldLabel>
                                <SearchableSelect value={form.sector} onValueChange={(val) => setField("sector", val)} options={[]} placeholder="No seleccionado" />
                            </Field>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleCancel} disabled={updateCompanyProfile.isPending}>Cancelar</Button>
                            <Button type="submit" className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground" disabled={updateCompanyProfile.isPending}>
                                {updateCompanyProfile.isPending && <IconLoader className="animate-spin mr-2" />}
                                Guardar
                            </Button>
                        </div>
                    </FieldGroup>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                        <ViewField label="Correo empresarial" value={form.email} />
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Teléfono *</p>
                            <p className="text-sm font-medium text-foreground flex items-center gap-2">
                                <span>🇨🇴 +57</span> {form.phone || <span className="text-muted-foreground font-normal">No registrado</span>}
                            </p>
                        </div>
                        <ViewField label="Sitio web" value={form.website} />
                        <ViewField label="Moneda" value={form.currency} />
                        <ViewField label="Número de colaboradores" value={form.employees_count || "No seleccionado"} />
                        <ViewField label="Sector" value={form.sector || "No seleccionado"} />
                    </div>
                )}
            </SectionCard>

            {/* 3. Dirección */}
            <SectionCard title="Dirección" isEditing={editingSection === "address"} onEdit={() => setEditingSection("address")}>
                {editingSection === "address" ? (
                    <FieldGroup>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Dirección <span className="text-primary">*</span></FieldLabel>
                                <Input value={form.address ?? ""} onChange={(e) => setField("address", e.target.value)} />
                                {fieldErrors.address && <FieldError>{fieldErrors.address}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel>Departamento <span className="text-primary">*</span></FieldLabel>
                                <SearchableSelect value={form.department_id ? String(form.department_id) : undefined} onValueChange={(val) => setField("department_id", Number(val))} options={departmentOptions} />
                            </Field>
                            <Field>
                                <FieldLabel>Municipio <span className="text-primary">*</span></FieldLabel>
                                <SearchableSelect
                                    value={form.municipality_id ? String(form.municipality_id) : undefined}
                                    onValueChange={(value) => setField("municipality_id", Number(value))}
                                    options={municipalityOptions}
                                    disabled={catalogsLoading}
                                />
                                {fieldErrors.municipality_id && <FieldError>{fieldErrors.municipality_id}</FieldError>}
                            </Field>
                            <Field>
                                <FieldLabel>Código postal</FieldLabel>
                                <Input value={form.postal_code ?? ""} onChange={(e) => setField("postal_code", e.target.value)} placeholder="No registrado" />
                                {fieldErrors.postal_code && <FieldError>{fieldErrors.postal_code}</FieldError>}
                            </Field>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleCancel} disabled={updateCompanyProfile.isPending}>Cancelar</Button>
                            <Button type="submit" className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground" disabled={updateCompanyProfile.isPending}>
                                {updateCompanyProfile.isPending && <IconLoader className="animate-spin mr-2" />}
                                Guardar
                            </Button>
                        </div>
                    </FieldGroup>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                        <ViewField label="Dirección *" value={form.address} />
                        <ViewField label="Departamento *" value={departmentOptions.find(o => o.value === String(form.department_id))?.label} />
                        <ViewField label="Municipio *" value={municipalityOptions.find(o => o.value === String(form.municipality_id))?.label} />
                        <ViewField label="Código postal" value={form.postal_code} />
                    </div>
                )}
            </SectionCard>
        </form>
    )
}
