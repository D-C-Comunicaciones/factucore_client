import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
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
import type { Plan } from "@/services/plan.service"

interface UpdatePlanDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: Plan | null
    onSubmit: (data: Partial<Plan>) => Promise<void>
}

export function UpdatePlanDialog({ open, onOpenChange, plan, onSubmit }: UpdatePlanDialogProps) {
    const { register, handleSubmit, reset } = useForm<Partial<Plan>>({
        defaultValues: plan || {},
    })

    useEffect(() => {
        if (plan) reset(plan)
    }, [plan, reset])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg w-full rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-6 rounded-t-2xl">
                    <DialogTitle className="text-white text-2xl font-bold">
                        Editar Plan
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-blue-100 text-sm mt-2">
                            Modifica los datos del plan.
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit(async (data) => {
                        await onSubmit(data)
                        onOpenChange(false)
                    })}
                    className="px-6 py-6 bg-white flex flex-col gap-4"
                >
                    <label>
                        Nombre
                        <Input {...register("name")} />
                    </label>
                    <label>
                        Descripción
                        <Input {...register("description")} />
                    </label>
                    <label>
                        Precio
                        <Input type="number" {...register("price")} />
                    </label>
                    <label>
                        Máx. Documentos
                        <Input type="number" {...register("max_documents")} />
                    </label>
                    <label>
                        Máx. Usuarios
                        <Input type="number" {...register("max_users")} />
                    </label>
                    <label>
                        Máx. Monto
                        <Input type="number" {...register("max_amount")} />
                    </label>
                    <label>
                        Orden
                        <Input type="number" {...register("sort_order")} />
                    </label>
                    <div className="flex justify-end gap-2 mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button type="submit">
                            Actualizar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
