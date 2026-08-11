"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { useChangePassword } from "@/hooks/perfil/useChangePassword"
import { extractFieldErrors } from "@/lib/errors"

export function ChangePasswordSection() {
    const changePassword = useChangePassword()
    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [matchError, setMatchError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
    const [showBanner, setShowBanner] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMatchError(null)
        setFieldErrors({})

        if (password !== passwordConfirmation) {
            setMatchError("Las contraseñas no coinciden")
            return
        }

        try {
            await changePassword.mutateAsync({
                current_password: currentPassword,
                password,
                password_confirmation: passwordConfirmation,
            })
            setCurrentPassword("")
            setPassword("")
            setPasswordConfirmation("")
            setShowBanner(true)
        } catch (error: any) {
            setFieldErrors(extractFieldErrors(error))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                {showBanner && (
                    <div className="rounded-md bg-blue-50 border border-blue-100 text-blue-800 text-sm px-4 py-3">
                        Por seguridad, cerramos tus otras sesiones activas. Esta sesión permanece activa.
                    </div>
                )}

                <Field>
                    <FieldLabel htmlFor="current_password">Contraseña actual</FieldLabel>
                    <Input
                        id="current_password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    {fieldErrors.current_password && <FieldError>{fieldErrors.current_password}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="new_password">Nueva contraseña</FieldLabel>
                    <Input
                        id="new_password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {fieldErrors.password && <FieldError>{fieldErrors.password}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="new_password_confirmation">Confirmar nueva contraseña</FieldLabel>
                    <Input
                        id="new_password_confirmation"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                    {matchError && <FieldError>{matchError}</FieldError>}
                </Field>

                <Field>
                    <Button type="submit" className="w-fit" disabled={changePassword.isPending}>
                        {changePassword.isPending && <IconLoader className="animate-spin" />}
                        Cambiar contraseña
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
