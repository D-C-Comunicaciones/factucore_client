import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { InfinityIcon } from "lucide-react"

type Plan = {
  id: number
  name: string
  description: string
  is_unlimited: boolean
  has_unlimited_documents: boolean
  has_unlimited_users: boolean
  has_unlimited_amount: boolean
  max_documents: number
  max_users: number
  max_amount: string
  price: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

type Usage = {
  documents_count: number
  invoices_total: string
  users_count: number
  plan_max_documents: number
  plan_max_users: number
  plan_max_amount: string
  documents_percent: number | null
  amount_percent: number | null
  users_percent: number | null
  is_unlimited_documents: boolean
  is_unlimited_users: boolean
  is_unlimited_amount: boolean
  invoices_count: number
  customers_count: number
}

export type TenantWithCompanyName = {
  id: string
  created_at: string
  updated_at: string
  company_name: string
  nit: string
  email: string
  is_active: boolean
  plan_id: number
  database: string | null
  documents_count: number
  invoices_total: string
  users_count: number
  phone: string
  address: string
  city?: string
  country?: string
  tenancy_db_name: string
  municipality?: {
    id: number
    name: string
    code: string
    department?: {
      id: number
      name: string
      code: string
      country?: {
        id: number
        name: string
        code: string
      }
    }
  }
  type_document_identification?: {
    id: number
    name: string
    code: string
  } | null
}

interface TenantDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tenant: TenantWithCompanyName | null
  usage?: Usage
  plan?: Plan
}

function getDisplayValue(
  value: number | string,
  isUnlimited: boolean,
  label: string
): string {
  if (isUnlimited) return "Ilimitado"
  if (typeof value === "number" && value === 0) return "0"
  if (typeof value === "string" && value === "0.00") return "0"
  return label === "monto"
    ? `$${Number(value).toLocaleString("es-CO")}`
    : value.toString()
}

function getPercent(value: number | null): number {
  return typeof value === "number" && !isNaN(value) && value !== null ? Math.max(0, value) : 0
}

function CircularProgressOrInfinity({
  percent,
  color,
  label,
  isUnlimited,
}: {
  percent: number | null
  color: string
  label: string
  isUnlimited?: boolean
}) {
  if (isUnlimited) {
    return (
      <div className="flex flex-col items-center">
        <div className="mb-2 flex items-center justify-center h-[72px] w-[72px] rounded-full bg-gray-100">
          <InfinityIcon className="text-blue-600 w-10 h-10" />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    )
  }
  const radius = 36
  const stroke = 6
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const safePercent = typeof percent === "number" && !isNaN(percent) && percent !== null ? Math.max(0, percent) : 0
  const strokeDashoffset = circumference - (safePercent / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg height={radius * 2} width={radius * 2} className="mb-2">
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset, transition: "stroke-dashoffset 0.5s" }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dy=".3em"
          fontSize="1.1rem"
          fill={color}
          fontWeight={700}
        >
          {safePercent}%
        </text>
      </svg>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export function TenantDetailsDialog({
  open,
  onOpenChange,
  tenant,
  usage,
  plan,
}: TenantDetailsDialogProps) {
  // Extrae datos anidados de municipio, departamento, país y tipo de documento
  const municipality = tenant?.municipality
  const department = municipality?.department
  const country = department?.country
  const typeDoc = tenant?.type_document_identification

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full
          max-w-[1400px]
          min-w-[320px]
          md:min-w-[700px]
          lg:min-w-[900px]
          xl:min-w-[1100px]
          max-h-[96vh]
          rounded-[2rem]
          border border-gray-200
          shadow-2xl
          bg-white/95
          p-0
          flex flex-col
          overflow-hidden
        "
      >
        <DialogHeader className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 md:px-12 xl:px-20 py-8 md:py-10 rounded-t-[2rem]">
          <DialogTitle className="text-white text-2xl md:text-3xl font-bold tracking-tight">
            Detalles de la empresa
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-blue-100 text-sm md:text-base mt-2">
              Información detallada de la empresa seleccionada.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-4 md:px-12 xl:px-20 py-6 md:py-10 bg-white">
          {tenant ? (
            <Accordion
              type="multiple"
              defaultValue={["general", "plan", "uso", "db"]}
              className="w-full space-y-10"
            >
              <AccordionItem value="general">
                <AccordionTrigger>Datos Generales</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-6">
                    {/* Razón social, tipo y número de documento */}
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Razón social</div>
                      <div className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                        {tenant.company_name}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Tipo de Documento</div>
                      <div>{typeDoc?.name || "NIT"}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Número de Documento</div>
                      <div>{tenant.nit}</div>
                    </div>
                    {/* País, Departamento, Municipio */}
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">País</div>
                      <div>
                        {country
                          ? `${country.name}${country.code ? ` - ${country.code}` : ""}`
                          : tenant.country || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Departamento</div>
                      <div>
                        {department
                          ? `${department.name}${department.code ? ` - ${department.code}` : ""}`
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Municipio</div>
                      <div>
                        {municipality
                          ? `${municipality.name}${municipality.code ? ` - ${municipality.code}` : ""}`
                          : tenant.city || "N/A"}
                      </div>
                    </div>
                    {/* Dirección, Email, Teléfono */}
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Dirección</div>
                      <div>{tenant.address || "N/A"}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Email</div>
                      <div className="font-mono break-all">{tenant.email}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Teléfono</div>
                      <div>{tenant.phone || "N/A"}</div>
                    </div>
                    {/* Estado de la empresa después de Teléfono */}
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Estado de la empresa</div>
                      <Badge variant={tenant.is_active ? "secondary" : "destructive"}>
                        {tenant.is_active ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                    {/* Creado, Actualizado */}
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Creado</div>
                      <div>{tenant.created_at}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Actualizado</div>
                      <div>{tenant.updated_at}</div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="plan">
                <AccordionTrigger>Plan</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 xl:grid-cols-5 gap-x-6 gap-y-6">
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Plan</div>
                      <div className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                        {plan?.name ?? "N/A"}
                        {plan?.is_active === false && (
                          <Badge variant="destructive">Inactivo</Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{plan?.description}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Precio</div>
                      <Badge variant="secondary">
                        {plan?.id === 0 || plan?.price === "0.00"
                          ? "Gratuito"
                          : plan?.price
                          ? `$${Number(plan.price).toLocaleString("es-CO")}`
                          : "N/A"}
                      </Badge>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Máx. Documentos</div>
                      <Badge variant="outline">
                        {plan?.has_unlimited_documents ? "Ilimitado" : plan?.max_documents ?? "N/A"}
                      </Badge>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Máx. Usuarios</div>
                      <Badge variant="outline">
                        {plan?.has_unlimited_users ? "Ilimitado" : plan?.max_users ?? "N/A"}
                      </Badge>
                    </div>
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Máx. Monto</div>
                      <Badge variant="outline">
                        {plan?.has_unlimited_amount
                          ? "Ilimitado"
                          : plan?.max_amount
                          ? `$${Number(plan.max_amount).toLocaleString("es-CO")}`
                          : "N/A"}
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="uso">
                <AccordionTrigger>Uso y Estadísticas</AccordionTrigger>
                <AccordionContent>
                  {usage && (
                    <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-8">
                      <div className="flex flex-col items-center">
                        <CircularProgressOrInfinity
                          percent={usage.documents_percent}
                          color="#2563eb"
                          label="Uso de documentos"
                          isUnlimited={usage.is_unlimited_documents}
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                          {usage.documents_count} de {usage.is_unlimited_documents ? "Ilimitado" : usage.plan_max_documents}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <CircularProgressOrInfinity
                          percent={usage.users_percent}
                          color="#f59e42"
                          label="Uso de usuarios"
                          isUnlimited={usage.is_unlimited_users}
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                          {usage.users_count} de {usage.is_unlimited_users ? "Ilimitado" : usage.plan_max_users}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <CircularProgressOrInfinity
                          percent={usage.amount_percent}
                          color="#22c55e"
                          label="Uso de monto"
                          isUnlimited={usage.is_unlimited_amount}
                        />
                        <div className="mt-2 text-xs text-muted-foreground">
                          ${Number(usage.invoices_total).toLocaleString("es-CO")} de {usage.is_unlimited_amount ? "Ilimitado" : `$${Number(usage.plan_max_amount).toLocaleString("es-CO")}`}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="mb-2 text-xs text-muted-foreground">Facturas emitidas</div>
                        <Badge variant="outline">{usage.invoices_count ?? 0}</Badge>
                        <div className="mb-2 mt-4 text-xs text-muted-foreground">Clientes</div>
                        <Badge variant="outline">{usage.customers_count ?? 0}</Badge>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="db">
                <AccordionTrigger>Base de Datos</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-12 gap-y-8">
                    <div>
                      <div className="mb-1 text-xs text-muted-foreground">Nombre del schema</div>
                      <Badge variant="secondary">{tenant.tenancy_db_name || "N/A"}</Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <div className="text-gray-500 text-center py-8">No hay datos para mostrar.</div>
          )}
        </div>
        <div className="flex justify-end bg-gray-50 px-4 md:px-20 py-8 rounded-b-[2rem]">
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
