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
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import type { Plan } from "@/services/plan.service"

interface PlanDetailDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    plan: Plan | null
}

export function PlanDetailDialog({ open, onOpenChange, plan }: PlanDetailDialogProps) {
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
                <DialogHeader className="bg-gradient-to-r from-blue-900 to-blue-700 px-8 md:px-12 xl:px-20 py-8 md:py-10 rounded-t-[2rem]">
                    <DialogTitle className="text-white text-2xl md:text-3xl font-bold">
                        Detalles del Plan
                    </DialogTitle>
                    <DialogDescription asChild>
                        <div className="text-blue-100 text-sm md:text-base mt-2">
                            Información detallada del plan seleccionado.
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto px-4 md:px-12 xl:px-20 py-6 md:py-10 bg-white">
                    {plan ? (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">Nombre</div>
                                    <div className="font-semibold text-lg flex items-center gap-2 flex-wrap">
                                        {plan.name}
                                        {plan.is_active
                                            ? <Badge variant="secondary">Activo</Badge>
                                            : <Badge variant="destructive">Inactivo</Badge>
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">Precio</div>
                                    <Badge variant="outline">
                                        {plan.price === "0.00"
                                            ? "Gratuito"
                                            : `$${Number(plan.price).toLocaleString("es-CO")}`}
                                    </Badge>
                                </div>
                                <div className="md:col-span-2">
                                    <div className="mb-1 text-xs text-muted-foreground">Descripción</div>
                                    <div>{plan.description}</div>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">Máx. Documentos</div>
                                    <Badge variant="outline">
                                        {plan.has_unlimited_documents ? "Ilimitado" : plan.max_documents}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">Máx. Usuarios</div>
                                    <Badge variant="outline">
                                        {plan.has_unlimited_users ? "Ilimitado" : plan.max_users}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">Máx. Monto</div>
                                    <Badge variant="outline">
                                        {plan.has_unlimited_amount
                                            ? "Ilimitado"
                                            : `$${Number(plan.max_amount).toLocaleString("es-CO")}`}
                                    </Badge>
                                </div>
                                <div>
                                    <div className="mb-1 text-xs text-muted-foreground">¿Plan Ilimitado?</div>
                                    <Badge variant={plan.is_unlimited ? "secondary" : "outline"}>
                                        {plan.is_unlimited ? "Sí" : "No"}
                                    </Badge>
                                </div>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Documentos Ilimitados</div>
                                        <Badge variant={plan.has_unlimited_documents ? "secondary" : "outline"}>
                                            {plan.has_unlimited_documents ? "Sí" : "No"}
                                        </Badge>
                                    </div>
                                    <Switch checked={plan.has_unlimited_documents} disabled />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Usuarios Ilimitados</div>
                                        <Badge variant={plan.has_unlimited_users ? "secondary" : "outline"}>
                                            {plan.has_unlimited_users ? "Sí" : "No"}
                                        </Badge>
                                    </div>
                                    <Switch checked={plan.has_unlimited_users} disabled />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Monto Ilimitado</div>
                                        <Badge variant={plan.has_unlimited_amount ? "secondary" : "outline"}>
                                            {plan.has_unlimited_amount ? "Sí" : "No"}
                                        </Badge>
                                    </div>
                                    <Switch checked={plan.has_unlimited_amount} disabled />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div>
                                        <div className="mb-1 text-xs text-muted-foreground">Empresas activas</div>
                                        <Badge variant="outline">{plan.active_tenants_count}</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500">No hay datos para mostrar.</div>
                    )}
                </div>
                <div className="flex justify-end px-8 pb-8">
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    )
}
