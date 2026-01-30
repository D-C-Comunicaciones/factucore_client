"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { IconLoader } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    useCountries,
    useDepartments,
    useMunicipalities,
    useTypeDocumentIdentifications,
    usePlans,
} from "@/hooks/use-catalogs"
import type { Country, Department, Municipality, TypeDocumentIdentification, Plan } from "@/types/catalogs"
import type { Tenant } from "@/types/tenant"

// Añade este tipo para los datos completos de empresa (usado en el modal de edición)
export type TenantFullData = {
    id: string
    company_name: string
    nit: string
    type_document_identification_id: number
    plan_id: number
    address: string
    phone: string
    email: string
    country: string
    department_id: number
    municipality_id: number
    // ...otros campos si necesitas...
}

interface UpdateTenantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: Partial<TenantFullData>) => Promise<void>
    initialData: TenantFullData | null
}

type UpdateTenantFormFields = {
    company_name: string
    nit: string
    type_document_identification_id: number
    plan_id: number
    address: string
    phone: string
    email: string
    country: string
    department_id: number
    municipality_id: number
}

export function UpdateTenantDialog({
    open,
    onOpenChange,
    onSubmit,
    initialData,
}: UpdateTenantDialogProps) {
    // Estados para selects dependientes
    const [selectedCountry, setSelectedCountry] = React.useState<number>(0)
    const [selectedDepartment, setSelectedDepartment] = React.useState<number>(0)

    // Catálogos
    const { countries, fetchCountries, loading: loadingCountries } = useCountries()
    const { departments, fetchDepartments, loading: loadingDepartments } = useDepartments(selectedCountry)
    const { municipalities, fetchMunicipalities, loading: loadingMunicipalities } = useMunicipalities(selectedDepartment)
    const { types, fetchTypes, loading: loadingTypes } = useTypeDocumentIdentifications()
    const { plans, fetchPlans, loading: loadingPlans } = usePlans()

    // Guarda los valores originales para comparación
    const originalValues = React.useRef<UpdateTenantFormFields | null>(null)

    const form = useForm<UpdateTenantFormFields>({
        defaultValues: {
            company_name: "",
            nit: "",
            type_document_identification_id: 0,
            plan_id: 0,
            address: "",
            phone: "",
            email: "",
            country: "",
            department_id: 0,
            municipality_id: 0,
        },
    })

    // Cargar catálogos y setear valores actuales al abrir el modal
    React.useEffect(() => {
        if (open) {
            fetchCountries()
            fetchPlans()
            fetchTypes()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open])

    // Cargar departamentos y municipios cuando cambian los valores iniciales
    React.useEffect(() => {
        if (open && initialData) {
            const countryId = Number(initialData.country) || 0
            const departmentId = initialData.department_id ?? 0
            const municipalityId = initialData.municipality_id ?? 0

            setSelectedCountry(countryId)
            setSelectedDepartment(departmentId)

            // Cargar departamentos y municipios si hay valores
            if (countryId) fetchDepartments()
            if (departmentId) fetchMunicipalities()

            const values: UpdateTenantFormFields = {
                company_name: initialData.company_name ?? "",
                nit: initialData.nit ?? "",
                type_document_identification_id: initialData.type_document_identification_id ?? 0,
                plan_id: initialData.plan_id ?? 0,
                address: initialData.address ?? "",
                phone: initialData.phone ?? "",
                email: initialData.email ?? "",
                country: String(countryId),
                department_id: departmentId,
                municipality_id: municipalityId,
            }
            form.reset(values)
            originalValues.current = values
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialData])

    React.useEffect(() => {
        if (open && selectedCountry) {
            fetchDepartments()
        }
    }, [open, selectedCountry, fetchDepartments])

    React.useEffect(() => {
        if (open && selectedDepartment) {
            fetchMunicipalities()
        }
    }, [open, selectedDepartment, fetchMunicipalities])

    // Limpia departamentos y municipios al cambiar país/departamento
    React.useEffect(() => {
        if (open) {
            setSelectedDepartment(0)
            form.setValue("department_id", 0)
            form.setValue("municipality_id", 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCountry])

    React.useEffect(() => {
        if (open) {
            form.setValue("municipality_id", 0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDepartment])

    // Validación de cambios y mensajes de error por campo
    const [fieldErrors, setFieldErrors] = React.useState<Partial<Record<keyof UpdateTenantFormFields, string>>>({})

    const handleSubmit = async (data: UpdateTenantFormFields) => {
        if (!originalValues.current) return

        // Detecta qué campos cambiaron
        const changedFields: Partial<UpdateTenantFormFields> = {}
        const errors = {} as Partial<Record<keyof UpdateTenantFormFields, string>>

        (Object.keys(data) as (keyof UpdateTenantFormFields)[]).forEach((key) => {
            const dataValue = data[key]
            const originalValue = originalValues.current![key]
            if (dataValue !== originalValue) {
                (changedFields as any)[key] = dataValue // type assertion para evitar error TS7053
            } else {
                (errors as any)[key] = "No se detectaron cambios en este campo."
            }
        })

        // Si no hay ningún campo cambiado, muestra errores en todos los campos
        if (Object.keys(changedFields).length === 0) {
            setFieldErrors(errors)
            return
        }

        setFieldErrors({}) // Limpia errores si hay cambios

        try {
            // Solo envía los campos que cambiaron
            await onSubmit(changedFields)
            form.reset()
            setSelectedCountry(0)
            setSelectedDepartment(0)
            onOpenChange(false)
        } catch (error) {
            console.error("Error updating tenant:", error)
        }
    }

    // Limpia errores al cambiar cualquier campo
    React.useEffect(() => {
        const subscription = form.watch(() => {
            setFieldErrors({})
        })
        return () => {
            if (typeof subscription.unsubscribe === "function") {
                subscription.unsubscribe()
            }
        }
    }, [form])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="
                    w-full
                    max-w-[1400px]
                    min-w-[320px]
                    md:min-w-[700px]
                    lg:min-w-[900px]
                    xl:min-w-[1100px]
                    max-h-[90vh]
                    rounded-[2rem]
                    border border-gray-200
                    shadow-2xl
                    bg-white/95
                    p-0
                    flex flex-col
                    overflow-hidden
                "
            >
                <DialogHeader className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 md:px-12 xl:px-20 py-8 md:py-10 rounded-t-[2rem]">
                    <DialogTitle className="text-white text-2xl md:text-3xl font-bold tracking-tight">
                        Editar Empresa
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-blue-100 text-sm md:text-base mt-2">
                            Modifica los datos de la empresa.
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-4 md:px-12 xl:px-20 py-6 md:py-10 bg-white">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="text-sm font-medium">Información de la Empresa</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="company_name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nombre de la Empresa *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Empresa Demo SAS" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                {fieldErrors.company_name && (
                                                    <span className="text-xs text-red-500">{fieldErrors.company_name}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="nit"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>NIT *</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="900123456-7" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                                {fieldErrors.nit && (
                                                    <span className="text-xs text-red-500">{fieldErrors.nit}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="type_document_identification_id"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Tipo de Documento *</FormLabel>
                                                <Select
                                                    value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    disabled={loadingTypes}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar tipo" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {types?.map((type: TypeDocumentIdentification) => (
                                                            <SelectItem key={type.id} value={String(type.id)}>
                                                                {type.id} - {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                {fieldErrors.type_document_identification_id && (
                                                    <span className="text-xs text-red-500">{fieldErrors.type_document_identification_id}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="plan_id"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Plan *</FormLabel>
                                                <Select
                                                    value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    disabled={loadingPlans}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar plan" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {plans?.map((plan: Plan) => (
                                                            <SelectItem key={plan.id} value={String(plan.id)}>
                                                                {plan.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                {fieldErrors.plan_id && (
                                                    <span className="text-xs text-red-500">{fieldErrors.plan_id}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dirección</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Calle 123 #45-67"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {fieldErrors.address && (
                                                    <span className="text-xs text-red-500">{fieldErrors.address}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+57 300 1234567"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {fieldErrors.phone && (
                                                    <span className="text-xs text-red-500">{fieldErrors.phone}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="contacto@empresa.com"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                                {fieldErrors.email && (
                                                    <span className="text-xs text-red-500">{fieldErrors.email}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Selects de país, departamento, municipio en una sola fila, responsivo */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>País *</FormLabel>
                                                <Select
                                                    value={field.value || ""}
                                                    onValueChange={value => {
                                                        setSelectedCountry(value ? Number(value) : 0)
                                                        field.onChange(value)
                                                    }}
                                                    disabled={loadingCountries}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar país" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {countries?.map((country: Country) => (
                                                            <SelectItem key={country.id} value={String(country.id)}>
                                                                {country.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldErrors.country && (
                                                    <span className="text-xs text-red-500">{fieldErrors.country}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="department_id"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Departamento *</FormLabel>
                                                <Select
                                                    value={field.value ? String(field.value) : ""}
                                                    onValueChange={value => {
                                                        setSelectedDepartment(value ? Number(value) : 0)
                                                        field.onChange(value ? Number(value) : 0)
                                                    }}
                                                    disabled={!selectedCountry || loadingDepartments}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar departamento" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {departments?.map((dep: Department) => (
                                                            <SelectItem key={dep.id} value={String(dep.id)}>
                                                                {dep.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {fieldErrors.department_id && (
                                                    <span className="text-xs text-red-500">{fieldErrors.department_id}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="municipality_id"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Municipio *</FormLabel>
                                                <Select
                                                    value={field.value !== undefined && field.value !== null ? String(field.value) : ""}
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    disabled={!selectedDepartment || loadingMunicipalities}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Seleccionar municipio" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {municipalities?.map((mun: Municipality) => (
                                                            <SelectItem key={mun.id} value={String(mun.id)}>
                                                                {mun.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                                {fieldErrors.municipality_id && (
                                                    <span className="text-xs text-red-500">{fieldErrors.municipality_id}</span>
                                                )}
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={form.formState.isSubmitting}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting && <IconLoader className="animate-spin" />}
                                    Actualizar Empresa
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
