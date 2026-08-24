"use client"

import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { LogoHorizontal } from "@/components/logos/LogoHorizontal"
import { AccountNotActivatedNotice } from "@/components/auth/AccountNotActivatedNotice"

export default function AccountNotActivatedPage() {
    return (
        <Suspense fallback={null}>
            <AccountNotActivatedContent />
        </Suspense>
    )
}

function AccountNotActivatedContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    return (
        <div className="bg-sidebar flex min-h-screen items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Card className="overflow-hidden">
                    <CardContent className="px-8 py-6">
                        <div className="mb-4 flex justify-center">
                            <LogoHorizontal className="h-14 w-auto" />
                        </div>

                        {email ? (
                            <AccountNotActivatedNotice
                                email={email}
                                onBackToLogin={() => router.replace("/login")}
                            />
                        ) : (
                            // Se llegó acá sin el query param ?email= (ej. URL escrita a mano) —
                            // no hay a quién reenviarle nada, así que se manda de vuelta al login.
                            <div className="flex flex-col items-center gap-4 text-center">
                                <p className="text-sm text-muted-foreground">
                                    No pudimos identificar la cuenta. Vuelve a intentar iniciar sesión.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => router.replace("/login")}
                                    className="text-sm underline underline-offset-2"
                                >
                                    Volver a iniciar sesión
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
