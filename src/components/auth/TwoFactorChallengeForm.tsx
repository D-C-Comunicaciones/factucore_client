"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Checkbox } from "@/components/ui/checkbox"
import { IconLoader } from "@tabler/icons-react"
import { useAuth } from "@/contexts/auth-context"
import { extractErrorMessage } from "@/lib/errors"

interface TwoFactorChallengeFormProps {
    challengeToken: string
    onSuccess: () => void
    onBackToLogin: () => void
}

export function TwoFactorChallengeForm({ challengeToken, onSuccess, onBackToLogin }: TwoFactorChallengeFormProps) {
    const { completeTwoFactorChallenge } = useAuth()
    const [mode, setMode] = useState<"code" | "recovery">("code")
    const [value, setValue] = useState("")
    const [rememberDevice, setRememberDevice] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            await completeTwoFactorChallenge(
                challengeToken,
                mode === "code"
                    ? { code: value, remember_device: rememberDevice }
                    : { recovery_code: value, remember_device: rememberDevice }
            )
            onSuccess()
        } catch (err: any) {
            const status = err?.response?.status
            if (status === 404 || status === 410 || status === 401) {
                onBackToLogin()
                return
            }
            setError(extractErrorMessage(err))
            setValue("")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center mb-4">
                    <h1 className="text-2xl font-bold">Verificación en dos pasos</h1>
                    <FieldDescription>
                        {mode === "code"
                            ? "Ingresa el código de 6 dígitos de tu app autenticadora."
                            : "Ingresa uno de tus códigos de recuperación."}
                    </FieldDescription>
                </div>

                <Field>
                    {mode === "code" ? (
                        <div className="flex justify-center">
                            <InputOTP maxLength={6} value={value} onChange={setValue} disabled={isSubmitting} autoFocus>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    ) : (
                        <>
                            <FieldLabel htmlFor="recovery_code">Código de recuperación</FieldLabel>
                            <Input
                                id="recovery_code"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                disabled={isSubmitting}
                                autoFocus
                                required
                            />
                        </>
                    )}
                    {error && <FieldError>{error}</FieldError>}
                </Field>

                <label className="flex items-center gap-2 text-sm justify-center cursor-pointer">
                    <Checkbox
                        checked={rememberDevice}
                        onCheckedChange={(checked) => setRememberDevice(checked === true)}
                        disabled={isSubmitting}
                    />
                    No pedir código en este dispositivo
                </label>

                <Field>
                    <Button type="submit" className="w-full" disabled={isSubmitting || !value}>
                        {isSubmitting && <IconLoader className="animate-spin" />}
                        Verificar
                    </Button>
                </Field>

                <div className="flex flex-col items-center gap-2">
                    <button
                        type="button"
                        className="text-sm underline underline-offset-2"
                        onClick={() => {
                            setMode((prev) => (prev === "code" ? "recovery" : "code"))
                            setValue("")
                            setError(null)
                        }}
                        disabled={isSubmitting}
                    >
                        {mode === "code" ? "Usar un código de recuperación" : "Usar el código de la app"}
                    </button>
                    <button
                        type="button"
                        className="text-sm text-muted-foreground underline underline-offset-2"
                        onClick={onBackToLogin}
                        disabled={isSubmitting}
                    >
                        Volver al inicio de sesión
                    </button>
                </div>
            </FieldGroup>
        </form>
    )
}
