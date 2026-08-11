"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { IconLoader } from "@tabler/icons-react"

interface AuthLinkStatusProps {
    status: "loading" | "valid" | "invalid"
    expiredMessage: string
    children: ReactNode
}

export function AuthLinkStatus({ status, expiredMessage, children }: AuthLinkStatusProps) {
    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-muted-foreground">
                <IconLoader className="animate-spin" />
                <span>Verificando enlace...</span>
            </div>
        )
    }

    if (status === "invalid") {
        return (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">{expiredMessage}</p>
                <Link href="/login" className="text-sm underline underline-offset-2">
                    Volver a iniciar sesión
                </Link>
            </div>
        )
    }

    return <>{children}</>
}
