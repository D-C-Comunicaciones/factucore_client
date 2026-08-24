"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader, IconUser } from "@tabler/icons-react"
import Image from "next/image"
import { envs } from "@/config/env"
import { Eye, EyeOff } from "lucide-react"
import { LogoHorizontal } from "@/components/logos/LogoHorizontal"
import { TwoFactorChallengeForm } from "@/components/auth/TwoFactorChallengeForm"
import { AccountNotActivatedNotice } from "@/components/auth/AccountNotActivatedNotice"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [twoFactorChallenge, setTwoFactorChallenge] = useState<{ token: string; expiresIn: number } | null>(null)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)

  // Mantener el tamaño original para el login
  useEffect(() => {
    document.documentElement.classList.add('scale-default')
    return () => {
      document.documentElement.classList.remove('scale-default')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      const result = await login(email, password)
      if (result?.requires2fa) {
        setTwoFactorChallenge({ token: result.challengeToken, expiresIn: result.expiresIn })
        return
      }
      // Redirige solo después de login exitoso
      router.replace("/dashboard")
    } catch (error: any) {
      if (error?.reason === "unverified_email") {
        setUnverifiedEmail(email)
        return
      }
      setError(error?.message || "Login error")
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestUser = () => {
    setEmail(envs.testUserEmail || "")
    setPassword(envs.testUserPassword || "")
  }

  return (
    <div className="bg-sidebar flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid items-stretch !p-0 !pb-0 md:grid-cols-2 min-h-[560px]">
            {twoFactorChallenge ? (
              <div className="px-8 py-5 md:px-8 md:py-6 flex flex-col justify-center">
                <TwoFactorChallengeForm
                  challengeToken={twoFactorChallenge.token}
                  onSuccess={() => router.replace("/dashboard")}
                  onBackToLogin={() => setTwoFactorChallenge(null)}
                />
              </div>
            ) : unverifiedEmail ? (
              <div className="px-8 py-5 md:px-8 md:py-6 flex flex-col justify-center">
                <AccountNotActivatedNotice
                  email={unverifiedEmail}
                  onBackToLogin={() => setUnverifiedEmail(null)}
                />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-8 py-5 md:px-8 md:py-6">
                <FieldGroup>
                  <div className="flex flex-col items-center gap-1 text-center mb-4">
                    <div className="mb-4 flex justify-center">
                      <LogoHorizontal className="h-14 md:h-30 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold">Ingresa a tu cuenta</h1>
                  </div>

                  <Field>
                    <FieldLabel htmlFor="email">Correo Electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </Field>

                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <Link
                        href="/forgot-password"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="pr-10"
                        placeholder="••••••••"
                      />

                      {/* 👁️ BOTÓN */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(prev => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </Field>

                  {process.env.NODE_ENV === "development" && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={fillTestUser}
                      disabled={isLoading}
                      className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    >
                      <IconUser className="size-4 text-gray-600" />
                      Usar usuario de prueba
                    </Button>
                  )}

                  <Field>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <IconLoader className="animate-spin" />}
                      Iniciar sesión
                    </Button>
                  </Field>
                  {error && (
                    <div className="text-red-600 text-sm text-center mt-2">{error}</div>
                  )}
                </FieldGroup>
              </form>
            )}

            <div className="relative hidden md:block min-h-full">
              <Image
                src="/img/login_img.webp"
                alt="Login"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-white/30" />
            </div>
          </CardContent>
        </Card>{/*  */}
      </div>
    </div>
  )
}
