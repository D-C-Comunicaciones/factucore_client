"use client"

import { useState } from "react"
import { Plus, MoreVertical, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { UserInfoPanel } from "@/components/users/UserInfoPanel"
import type { RoleName } from "@/data/roles"

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
}

const VALID_ROLES: RoleName[] = ["Administrador", "Contador", "Vendedor", "Asistente"]

export default function UsersPage() {
    const { user } = useAuth()
    const [showInfoDialog, setShowInfoDialog] = useState(false)

    const currentUser = {
        name: user?.name || "Usuario",
        email: user?.email || "",
        role: (VALID_ROLES.includes(user?.level as RoleName) ? (user?.level as RoleName) : "Administrador"),
    }

    return (
        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto py-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
                    <p className="text-sm text-muted-foreground">
                        Crea nuevos usuarios y asigna roles para administrar sus permisos.
                    </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <Button className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-1" />
                        Crear usuario
                    </Button>
                </div>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white px-5 py-4">
                <div className="flex items-center gap-3">
                    <svg className="size-6 shrink-0" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-gray-200" strokeWidth="3" />
                        <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            fill="none"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="3"
                            strokeDasharray={`${(1 / 3) * 97.4} 97.4`}
                            strokeLinecap="round"
                            transform="rotate(-90 18 18)"
                        />
                    </svg>
                    <p className="text-sm text-foreground">
                        <span className="font-semibold">1/3 Usuarios invitados</span>{" "}
                        <span className="text-muted-foreground">Haz crecer tu equipo creando mas usuarios.</span>
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <h2 className="text-base font-semibold text-foreground">Usuarios activos</h2>

                <div className="rounded-lg border border-gray-100 bg-white overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-muted-foreground">
                                <th className="font-medium py-3 px-4">Usuario</th>
                                <th className="font-medium py-3 px-4">Rol</th>
                                <th className="w-10 py-3 px-4" />
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                onClick={() => setShowInfoDialog(true)}
                                className="hover:bg-gray-50 cursor-pointer"
                            >
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-medium text-white">
                                            {getInitials(currentUser.name) || "U"}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">
                                                {currentUser.name}{" "}
                                                <span className="text-primary font-normal">(Tú)</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <Badge variant="outline" className="font-normal border-transparent bg-primary/10 text-primary">
                                        {currentUser.role}
                                    </Badge>
                                </td>
                                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                <MoreVertical className="w-4 h-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-40 bg-popover border border-border">
                                            <DropdownMenuItem
                                                onClick={() => setShowInfoDialog(true)}
                                                className="hover:bg-primary/10 hover:text-primary transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Vista previa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <UserInfoPanel open={showInfoDialog} onClose={() => setShowInfoDialog(false)} user={currentUser} />
        </div>
    )
}
