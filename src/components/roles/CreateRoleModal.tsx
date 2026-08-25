"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useCreateRole } from "@/hooks/roles/useRoleMutations"
import { extractFieldErrors } from "@/lib/errors"

interface CreateRoleModalProps {
    open: boolean
    onClose: () => void
}

export function CreateRoleModal({ open, onClose }: CreateRoleModalProps) {
    const router = useRouter()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const createRole = useCreateRole()

    function handleClose() {
        setName("")
        setDescription("")
        setFieldErrors({})
        onClose()
    }

    async function handleSubmit() {
        setFieldErrors({})
        try {
            const response = await createRole.mutateAsync({ name, description: description || undefined })
            const role = response.data?.role
            handleClose()
            if (role?.id) router.push(`/configuration/roles/${role.id}`)
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Crear rol</DialogTitle>
                </DialogHeader>

                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="new-role-name">Nombre *</FieldLabel>
                        <Input
                            id="new-role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            aria-invalid={!!fieldErrors.name}
                        />
                        <FieldError errors={fieldErrors.name ? [{ message: fieldErrors.name }] : undefined} />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="new-role-description">Descripción (opcional)</FieldLabel>
                        <Input
                            id="new-role-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Field>
                </FieldGroup>

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button type="button" className="cursor-pointer" disabled={!name || createRole.isPending} onClick={handleSubmit}>
                        {createRole.isPending ? "Creando..." : "Crear rol"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
