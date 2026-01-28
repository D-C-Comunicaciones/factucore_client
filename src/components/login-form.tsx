import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
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
                  placeholder="email@example.com"
                  required
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
                <Input id="password" type="password" placeholder="********" required />
              </Field>
              <Field>
                <Button type="submit">Iniciar sesión</Button>
              </Field>
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
      <FieldDescription className="px-6 text-center">
        Si continua con el inicio de sesión, acepta nuestros <a href="#">Términos de Servicio</a>{" "}
        y <a href="#">Política de Privacidad</a>.
      </FieldDescription>
    </div>
  )
}
