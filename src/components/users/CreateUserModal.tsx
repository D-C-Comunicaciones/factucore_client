"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { RoleListbox } from "@/components/users/RoleListbox"
import { useRolesList } from "@/hooks/roles/useRolesList"
import { useCreateUser } from "@/hooks/users/useUserMutations"
import { extractFieldErrors } from "@/lib/errors"
import type { CreateUserPayload } from "@/types/users"

interface CreateUserModalProps {
    open: boolean
    onClose: () => void
}

const EMPTY_FORM = { name: "", email: "", password: "", phone: "" }

export function CreateUserModal({ open, onClose }: CreateUserModalProps) {
    const [form, setForm] = useState(EMPTY_FORM)
    const [roleIds, setRoleIds] = useState<Set<number>>(new Set())
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

    const { data: roles } = useRolesList()
    const createUser = useCreateUser()

    function handleClose() {
        setForm(EMPTY_FORM)
        setRoleIds(new Set())
        setFieldErrors({})
        onClose()
    }

    function toggleRole(id: number) {
        setRoleIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    async function handleSubmit() {
        setFieldErrors({})

        const payload: CreateUserPayload = {
            name: form.name,
            email: form.email,
            active: true,
            send_invitation: true,
            role_ids: Array.from(roleIds),
        }
        if (form.password) payload.password = form.password
        if (form.phone) payload.phone = form.phone

        try {
            await createUser.mutateAsync(payload)
            handleClose()
        } catch (error: any) {
            const errors = extractFieldErrors(error)
            if (errors.email?.toLowerCase().includes("ya existe")) {
                errors.email = "Ya existe un usuario registrado con este correo."
            }
            setFieldErrors(errors)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>Crear usuario</DialogTitle>
                </DialogHeader>

                <div className="max-h-[70vh] overflow-y-auto">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="new-user-name">Nombre *</FieldLabel>
                            <Input
                                id="new-user-name"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                aria-invalid={!!fieldErrors.name}
                            />
                            <FieldError errors={fieldErrors.name ? [{ message: fieldErrors.name }] : undefined} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="new-user-email">Correo *</FieldLabel>
                            <Input
                                id="new-user-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                aria-invalid={!!fieldErrors.email}
                            />
                            <FieldError errors={fieldErrors.email ? [{ message: fieldErrors.email }] : undefined} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="new-user-password">
                                Contraseña (opcional)
                            </FieldLabel>
                            <Input
                                id="new-user-password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                                aria-invalid={!!fieldErrors.password}
                            />
                            <FieldError errors={fieldErrors.password ? [{ message: fieldErrors.password }] : undefined} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="new-user-phone">Teléfono (opcional)</FieldLabel>
                            <Input
                                id="new-user-phone"
                                value={form.phone}
                                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            />
                        </Field>

                        <Field>
                            <FieldLabel>Roles</FieldLabel>
                            <RoleListbox roles={roles || []} selectedIds={roleIds} onToggle={toggleRole} />
                        </Field>
                    </FieldGroup>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" className="cursor-pointer hover:bg-gray-100" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        className="cursor-pointer"
                        disabled={!form.name || !form.email || createUser.isPending}
                        onClick={handleSubmit}
                    >
                        {createUser.isPending ? "Creando..." : "Crear usuario"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
