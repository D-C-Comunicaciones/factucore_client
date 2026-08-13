"use client"

import { Monitor, LogOut } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useDevices } from "@/hooks/profile/useDevices"
import { useRevokeDevice } from "@/hooks/profile/useRevokeDevice"

function formatRelativeTime(dateStr: string | null) {
    if (!dateStr) return "—"
    const date = new Date(dateStr)
    const diffMs = Date.now() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)

    if (diffMinutes < 1) return "Hace un momento"
    if (diffMinutes < 60) return `Hace ${diffMinutes} minuto${diffMinutes === 1 ? "" : "s"}`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours === 1 ? "" : "s"}`
    const diffDays = Math.floor(diffHours / 24)
    return `Hace ${diffDays} día${diffDays === 1 ? "" : "s"}`
}

export function ConnectedDevicesSection() {
    const { data: devicesRes, isLoading } = useDevices()
    const revokeDevice = useRevokeDevice()

    const devices = devicesRes?.data || []

    return (
        <div>
            <h2 className="text-sm font-semibold text-foreground text-left pb-3 mb-4 border-b">Dispositivos conectados</h2>

            {isLoading ? (
                <div className="flex flex-col">
                    {[0, 1].map((i) => (
                        <div key={i} className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-4 rounded-full" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                            <Skeleton className="h-4 w-20" />
                        </div>
                    ))}
                </div>
            ) : devices.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6">No hay dispositivos conectados.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-muted-foreground border-b">
                                <th className="py-2 pr-4 font-medium">Nombre del dispositivo</th>
                                <th className="py-2 pr-4 font-medium">Actividad reciente</th>
                                <th className="py-2 w-10" />
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device) => {
                                const isRevoking = revokeDevice.isPending && revokeDevice.variables === device.id
                                return (
                                    <tr key={device.id} className="border-b last:border-0">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-2">
                                                <Monitor className="size-4 text-muted-foreground" />
                                                <span>{device.device_name || "Dispositivo desconocido"}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4">
                                            {device.is_current ? (
                                                <span className="text-primary font-medium">Sesión actual</span>
                                            ) : (
                                                formatRelativeTime(device.last_used_at)
                                            )}
                                        </td>
                                        <td className="py-3 text-right">
                                            {!device.is_current && (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button
                                                                type="button"
                                                                onClick={() => revokeDevice.mutate(device.id)}
                                                                disabled={revokeDevice.isPending}
                                                                className="cursor-pointer text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                <LogOut className={`size-4 ${isRevoking ? "animate-spin" : ""}`} />
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-800 text-white p-2 text-xs">
                                                            Cerrar sesión en este dispositivo
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
