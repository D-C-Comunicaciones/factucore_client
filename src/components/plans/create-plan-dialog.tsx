import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldTitle,
} from "@/components/ui/field"

const createPlanSchema = z.object({
    name: z.string().min(2, "El nombre es requerido"),
    description: z.string().max(1000).optional(),
    is_unlimited: z.boolean().optional(),
    has_unlimited_documents: z.boolean().optional(),
    has_unlimited_users: z.boolean().optional(),
    has_unlimited_amount: z.boolean().optional(),
    max_documents: z.number().min(0),
    max_users: z.number().min(0),
    max_amount: z.number().min(0),
    price: z.number().min(0),
})

type CreatePlanInput = z.infer<typeof createPlanSchema>

interface CreatePlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (data: CreatePlanInput) => Promise<void>
}

export function CreatePlanDialog({
    open,
    onOpenChange,
    onSubmit,
}: CreatePlanDialogProps) {
    const form = useForm<CreatePlanInput>({
        resolver: zodResolver(createPlanSchema),
        defaultValues: {
            name: "",
            description: "",
            is_unlimited: false,
            has_unlimited_documents: false,
            has_unlimited_users: false,
            has_unlimited_amount: false,
            max_documents: 0,
            max_users: 0,
            max_amount: 0,
            price: 0,
        },
    })

    const handleSubmit = async (data: CreatePlanInput) => {
        try {
            await onSubmit({
                ...data,
                max_documents: Number(data.max_documents),
                max_users: Number(data.max_users),
                max_amount: Number(data.max_amount),
                price: Number(data.price),
            })
            toast.success("Plan creado exitosamente")
            form.reset()
            onOpenChange(false)
        } catch (error: any) {
            toast.error(error?.message || "Error al crear el plan")
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
                        Crear Plan
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-blue-100 text-sm md:text-base mt-2">
                            Complete los datos para crear un nuevo plan.
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-4 md:px-12 xl:px-20 py-6 md:py-10 bg-white">
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="text-sm font-medium">Información del Plan</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Nombre *</label>
                                    <Input {...form.register("name")} />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Descripción</label>
                                    <Input {...form.register("description")} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Precio *</label>
                                    <Input type="number" {...form.register("price", { valueAsNumber: true })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Máx. Documentos *</label>
                                    <Input
                                        type="number"
                                        {...form.register("max_documents", { valueAsNumber: true })}
                                        disabled={!!(form.watch("is_unlimited") || form.watch("has_unlimited_documents"))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Máx. Usuarios *</label>
                                    <Input
                                        type="number"
                                        {...form.register("max_users", { valueAsNumber: true })}
                                        disabled={!!form.watch("has_unlimited_users")}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Máx. Monto *</label>
                                    <Input
                                        type="number"
                                        {...form.register("max_amount", { valueAsNumber: true })}
                                        disabled={!!form.watch("has_unlimited_amount")}
                                    />
                                </div>
                            </div>
                            <FieldGroup className="w-full mt-4">
                                <FieldLabel htmlFor="switch-plan-ilimitado">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Plan Ilimitado</FieldTitle>
                                            <FieldDescription>
                                                Si está activo, no habrá límites en documentos, usuarios ni monto.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch
                                            id="switch-plan-ilimitado"
                                            checked={!!form.watch("is_unlimited")}
                                            onCheckedChange={v => form.setValue("is_unlimited", v)}
                                        />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="switch-docs-ilimitados">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Documentos Ilimitados</FieldTitle>
                                            <FieldDescription>
                                                Permite documentos ilimitados en el plan.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch
                                            id="switch-docs-ilimitados"
                                            checked={!!form.watch("has_unlimited_documents")}
                                            onCheckedChange={v => form.setValue("has_unlimited_documents", v)}
                                        />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="switch-users-ilimitados">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Usuarios Ilimitados</FieldTitle>
                                            <FieldDescription>
                                                Permite usuarios ilimitados en el plan.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch
                                            id="switch-users-ilimitados"
                                            checked={!!form.watch("has_unlimited_users")}
                                            onCheckedChange={v => form.setValue("has_unlimited_users", v)}
                                        />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="switch-monto-ilimitado">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Monto Ilimitado</FieldTitle>
                                            <FieldDescription>
                                                Permite monto ilimitado en el plan.
                                            </FieldDescription>
                                        </FieldContent>
                                        <Switch
                                            id="switch-monto-ilimitado"
                                            checked={!!form.watch("has_unlimited_amount")}
                                            onCheckedChange={v => form.setValue("has_unlimited_amount", v)}
                                        />
                                    </Field>
                                </FieldLabel>
                            </FieldGroup>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancelar
                                </Button>
                            </DialogClose>
                            <Button type="submit">
                                Crear Plan
                            </Button>
                        </DialogFooter>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
