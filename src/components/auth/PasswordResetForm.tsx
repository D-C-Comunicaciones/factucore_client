"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordResetFormProps {
    onSubmit: (password: string, passwordConfirmation: string) => Promise<void>
    isSubmitting: boolean
    submitLabel: string
    fieldErrors?: Record<string, string>
}

export function PasswordResetForm({ onSubmit, isSubmitting, submitLabel, fieldErrors }: PasswordResetFormProps) {
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [matchError, setMatchError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMatchError(null)

        if (password !== passwordConfirmation) {
            setMatchError("Las contraseñas no coinciden")
            return
        }

        await onSubmit(password, passwordConfirmation)
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="password">Nueva contraseña</FieldLabel>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                            className="pr-10"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                    </div>
                    {fieldErrors?.password && <FieldError>{fieldErrors.password}</FieldError>}
                </Field>

                <Field>
                    <FieldLabel htmlFor="password_confirmation">Confirmar contraseña</FieldLabel>
                    <Input
                        id="password_confirmation"
                        type={showPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        disabled={isSubmitting}
                        placeholder="••••••••"
                    />
                    {matchError && <FieldError>{matchError}</FieldError>}
                    {fieldErrors?.password_confirmation && <FieldError>{fieldErrors.password_confirmation}</FieldError>}
                </Field>

                <Field>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <IconLoader className="animate-spin" />}
                        {submitLabel}
                    </Button>
                </Field>
            </FieldGroup>
        </form>
    )
}
