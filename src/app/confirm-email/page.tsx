"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogoHorizontal } from "@/components/logos/LogoHorizontal"
import { Button } from "@/components/ui/button"
import { IconLoader } from "@tabler/icons-react"
import { CheckCircle2 } from "lucide-react"
import { AuthFlowService } from "@/lib/authFlow"
import { extractErrorMessage } from "@/lib/errors"

export default function ConfirmEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const token = searchParams.get("token") || ""

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState("")

    useEffect(() => {
        if (!email || !token) {
            setStatus("error")
            setMessage("El enlace de confirmación es inválido o ha expirado.")
            return
        }

        AuthFlowService.confirmEmail({ email, token })
            .then((res) => {
                setStatus("success")
                setMessage(res.message || "Tu correo electrónico fue actualizado. Inicia sesión con tu nuevo correo.")
            })
            .catch((error) => {
                setStatus("error")
                setMessage(extractErrorMessage(error) || "El enlace de confirmación es inválido o ha expirado.")
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="bg-sidebar flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden">
                    <CardContent className="px-8 py-6">
                        <div className="flex flex-col items-center gap-1 text-center mb-6">
                            <div className="mb-4 flex justify-center">
                                <LogoHorizontal className="h-14 w-auto" />
                            </div>
                            <h1 className="text-2xl font-bold">Confirmar cambio de correo</h1>
                        </div>

                        {status === "loading" && (
                            <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                                <IconLoader className="animate-spin" />
                                <span>Confirmando tu correo...</span>
                            </div>
                        )}

                        {status === "success" && (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <CheckCircle2 className="size-10 text-primary" />
                                <p className="text-sm text-muted-foreground">{message}</p>
                                <Button className="w-full" onClick={() => router.replace("/login")}>
                                    Ir a iniciar sesión
                                </Button>
                            </div>
                        )}

                        {status === "error" && (
                            <div className="flex flex-col items-center gap-4 py-6 text-center">
                                <p className="text-sm text-muted-foreground">{message}</p>
                                <Link href="/configuration/security" className="text-sm underline underline-offset-2">
                                    Volver a Acceso a tu cuenta
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
