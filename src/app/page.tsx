"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function RootPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading) {
            if (isAuthenticated) {
                router.replace("/dashboard")
            } else {
                router.replace("/login")
            }
        }
    }, [isAuthenticated, isLoading, router])

    // The SplashScreen is rendered by AuthProvider on top of everything
    return null
}