"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { IconLoader } from "@tabler/icons-react"
import { toast } from "sonner"
import { createTenantSchema, CreateTenantInput } from "@/types/tenant"
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

import React from "react"
import {
    useCountries,
    useDepartments,
    useMunicipalities,
    useTypeDocumentIdentifications,
    usePlans,
} from "@/hooks/use-catalogs"
import type { Country, Department, Municipality, TypeDocumentIdentification, Plan } from "@/types/catalogs"

interface CreateTenantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreateTenantInput) => Promise<void>
}

export function CreateTenantDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreateTenantDialogProps) {
    // Estados para selects dependientes
    const [selectedCountry, setSelectedCountry] = React.useState<number>(0)
    const [selectedDepartment, setSelectedDepartment] = React.useState<number>(0)

    // Catálogos
    const { countries, fetchCountries, loading: loadingCountries } = useCountries()
    const { departments, fetchDepartments, loading: loadingDepartments } = useDepartments(selectedCountry)
    const { municipalities, fetchMunicipalities, loading: loadingMunicipalities } = useMunicipalities(selectedDepartment)
    const { types, fetchTypes, loading: loadingTypes } = useTypeDocumentIdentifications()
    const { plans, fetchPlans, loading: loadingPlans } = usePlans()

    // Cargar catálogos solo cuando se abre el modal
    React.useEffect(() => {
        if (open) {
            fetchCountries()
            fetchPlans()
            fetchTypes()
        }
    }, [open, fetchCountries, fetchPlans, fetchTypes])

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

    const form = useForm<CreateTenantInput>({
        resolver: zodResolver(createTenantSchema),
        defaultValues: {
            company_name: "",
            nit: "",
            email: "",
            phone: "",
            address: "",
            municipality_id: 0,
            type_document_identification_id: 0,
            plan_id: 0,
            admin_name: "",
            admin_email: "",
            admin_password: "",
        },
    })

    // Limpia departamentos y municipios al cambiar país/departamento
    React.useEffect(() => {
        setSelectedDepartment(0)
        form.setValue("municipality_id", 0)
    }, [selectedCountry])
    React.useEffect(() => {
        form.setValue("municipality_id", 0)
    }, [selectedDepartment])

    const handleSubmit = async (data: CreateTenantInput) => {
        try {
            await onSubmit(data)
            toast.success("Empresa creada exitosamente")
            form.reset()
            setSelectedCountry(0)
            setSelectedDepartment(0)
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error?.message || "Error al crear la empresa")
            console.error("Error creating tenant:", error)
        }
    }

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
                        Nueva Empresa
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-blue-100 text-sm md:text-base mt-2">
                            Complete los datos para crear una nueva empresa en el sistema.
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
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    value={field.value ? String(field.value) : ""}
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
                                                                {type.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email *</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contacto@empresa.com" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    value={field.value ? String(field.value) : ""}
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
                                            </FormItem>
                                        )}
                                    />
                                </div>

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
                                        </FormItem>
                                    )}
                                />

                                {/* Selects de país, departamento, municipio en una sola fila, responsivo */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormItem className="w-full">
                                        <FormLabel>País *</FormLabel>
                                        <Select
                                            value={selectedCountry ? String(selectedCountry) : ""}
                                            onValueChange={value => {
                                                setSelectedCountry(value ? Number(value) : 0)
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
                                    </FormItem>

                                    <FormItem className="w-full">
                                        <FormLabel>Departamento *</FormLabel>
                                        <Select
                                            value={selectedDepartment ? String(selectedDepartment) : ""}
                                            onValueChange={value => {
                                                setSelectedDepartment(value ? Number(value) : 0)
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
                                    </FormItem>

                                    <FormField
                                        control={form.control}
                                        name="municipality_id"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel>Municipio *</FormLabel>
                                                <Select
                                                    onValueChange={value => field.onChange(Number(value))}
                                                    value={field.value ? String(field.value) : ""}
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
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="text-sm font-medium">Datos del Administrador</div>

                                <FormField
                                    control={form.control}
                                    name="admin_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre Completo *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Admin Demo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="admin_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email *</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="admin@empresa.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="admin_password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contraseña *</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
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
                                    Crear Empresa
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}