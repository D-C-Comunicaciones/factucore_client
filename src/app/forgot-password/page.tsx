"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader } from "@tabler/icons-react"
import { LogoHorizontal } from "@/components/logos/LogoHorizontal"
import { AuthFlowService } from "@/lib/authFlow"

const GENERIC_MESSAGE = "Si el correo existe, se enviará un enlace de recuperación."

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [sent, setSent] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await AuthFlowService.forgotPassword(email)
        } catch {
            // Nunca revelar si el correo existe o no, incluso ante un error de red.
        } finally {
            setIsSubmitting(false)
            setSent(true)
        }
    }

    return (
        <div className="bg-sidebar flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden">
                    <CardContent className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1 text-center mb-6">
                            <div className="mb-4 flex justify-center">
                                <LogoHorizontal className="h-14 w-auto" />
                            </div>
                            <h1 className="text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
                            <p className="text-sm text-muted-foreground">
                                Ingresa tu correo y te enviaremos un enlace para restablecerla.
                            </p>
                        </div>

                        {sent ? (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p className="text-sm">{GENERIC_MESSAGE}</p>
                                <Link href="/login" className="text-sm underline underline-offset-2">
                                    Volver a iniciar sesión
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="usuario@ejemplo.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        />
                                    </Field>

                                    <Field>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting && <IconLoader className="animate-spin" />}
                                            Enviar enlace de recuperación
                                        </Button>
                                    </Field>

                                    <div className="text-center">
                                        <Link href="/login" className="text-sm underline underline-offset-2">
                                            Volver a iniciar sesión
                                        </Link>
                                    </div>
                                </FieldGroup>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
