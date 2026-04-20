"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IconLoader, IconUser } from "@tabler/icons-react"
import Image from "next/image"
import { envs } from "@/config/env"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    try {
      await login(email, password)
      // Redirige solo después de login exitoso
      router.replace("/dashboard")
    } catch (error: any) {
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
    <div className="bg-sidebar flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <Card className="overflow-hidden p-0">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form onSubmit={handleSubmit} className="p-6 md:p-8">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center mb-6">
                  <div className="relative w-48 h-16 mb-4">
                    <Image
                      src="/img/logo-horizontal.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                  <h1 className="text-2xl font-bold">Bienvenido de vuelta</h1>
                  <p className="text-muted-foreground text-balance">
                    Ingresa con tu cuenta de usuario
                  </p>
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
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </Field>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillTestUser}
                  disabled={isLoading}
                  className="w-full"
                >
                  <IconUser className="size-4" />
                  Usar usuario de prueba
                </Button>

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

            <div className="bg-muted relative hidden md:block">
              <img
                src="/img/software.jpg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/30 to-transparent backdrop-blur-[2px]" />
            </div>
          </CardContent>
        </Card>

        <FieldDescription className="px-6 text-center mt-6">
          Si continua con el inicio de sesión, acepta nuestros{" "}
          <a href="#" className="underline">Términos de Servicio</a>{" "}
          y <a href="#" className="underline">Política de Privacidad</a>.
        </FieldDescription>
      </div>
    </div>
  )
}
