"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { IconLoader } from "@tabler/icons-react"
import type { z } from "zod"

import { createTenantSchema } from "@/types/tenant"
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

interface CreateTenantDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: z.infer<typeof createTenantSchema>) => Promise<void>
}

export function CreateTenantDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreateTenantDialogProps) {
    const form = useForm<z.infer<typeof createTenantSchema>>({
        resolver: zodResolver(createTenantSchema),
        defaultValues: {
            id: "",
            company_name: "",
            nit: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            country: "CO",
            plan_id: "",
            admin_name: "",
            admin_email: "",
            admin_password: "",
        },
    })

    const handleSubmit = async (data: z.infer<typeof createTenantSchema>) => {
        try {
            await onSubmit(data)
            form.reset()
            onOpenChange(false)
        } catch (error) {
            console.error("Error creating tenant:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nueva Empresa</DialogTitle>
                    <DialogDescription>
                        Complete los datos para crear una nueva empresa en el sistema.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Información de la Empresa</div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>ID Tenant</FormLabel>
                                            <FormControl>
                                                <Input placeholder="tenant-ejemplo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="company_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre de la Empresa</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Empresa Demo SAS" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="nit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>NIT</FormLabel>
                                            <FormControl>
                                                <Input placeholder="900123456-7" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="contacto@empresa.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+57 300 1234567" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="plan_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plan</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar plan" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="1">Plan Básico</SelectItem>
                                                    <SelectItem value="2">Plan Profesional</SelectItem>
                                                    <SelectItem value="3">Plan Empresarial</SelectItem>
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
                                            <Input placeholder="Calle 123 #45-67" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ciudad</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Barranquilla" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>País</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccionar país" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="CO">Colombia</SelectItem>
                                                    <SelectItem value="US">Estados Unidos</SelectItem>
                                                    <SelectItem value="MX">México</SelectItem>
                                                    <SelectItem value="ES">España</SelectItem>
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
                                        <FormLabel>Nombre Completo</FormLabel>
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
                                        <FormLabel>Email</FormLabel>
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
                                        <FormLabel>Contraseña</FormLabel>
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
            </DialogContent>
        </Dialog>
    )
}
