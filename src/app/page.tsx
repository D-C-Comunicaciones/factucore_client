"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
// Importa el componente Progress de shadcn/ui
import { Progress } from "@/components/ui/progress"

export default function RootPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (!isLoading) {
            // Simula la animación de progreso antes de redirigir
            let interval: NodeJS.Timeout
            if (progress < 100) {
                interval = setInterval(() => {
                    setProgress((prev) => Math.min(prev + 5, 100))
                }, 40)
            } else {
                // Redirige después de completar el progreso
                if (isAuthenticated) {
                    router.push("/dashboard")
                } else {
                    router.push("/login")
                }
            }
            return () => clearInterval(interval)
        }
    }, [isAuthenticated, isLoading, progress, router])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 lg:px-6">
            {/* Logo centrado */}
            <div className="relative flex items-center justify-center mb-8" style={{ width: 200, height: 200 }}>
                {/* Barra de progreso circular superpuesta */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <Progress
                        value={progress}
                        className="w-[180px] h-[180px] rounded-full"
                        // Puedes personalizar los colores aquí si tu Progress lo permite
                        style={{
                            // Azul y amarillo según el logo
                            "--progress-bar": "#0056A6",
                            "--progress-bg": "#FFD600",
                        } as React.CSSProperties}
                    />
                </div>
                {/* Porcentaje en el centro */}
                <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold text-[#0056A6]">
                    {progress}%
                </span>
            </div>
        </div>
    )
}