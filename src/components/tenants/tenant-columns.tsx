"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { IconDotsVertical } from "@tabler/icons-react"
import type { Tenant } from "@/types/tenant"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface TenantColumnsProps {
    onToggleStatus: (id: number) => Promise<void>
    onEdit: (tenant: Tenant) => void
    onDelete: (id: number) => void
}

export function createTenantColumns({
    onToggleStatus,
    onEdit,
    onDelete,
}: TenantColumnsProps): ColumnDef<Tenant>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Seleccionar todas"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Seleccionar fila"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue("name")}</div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="text-muted-foreground">{row.getValue("email")}</div>
            ),
        },
        {
            accessorKey: "status",
            header: "Estado",
            cell: ({ row }) => {
                const status = row.original.status
                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={status === "active"}
                            onCheckedChange={() => onToggleStatus(row.original.id)}
                        />
                        <Badge variant={status === "active" ? "default" : "secondary"}>
                            {status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                    </div>
                )
            },
        },
        {
            accessorKey: "created_at",
            header: "Fecha de creación",
            cell: ({ row }) => {
                const date = new Date(row.getValue("created_at"))
                return <div>{date.toLocaleDateString("es-ES")}</div>
            },
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                            size="icon"
                        >
                            <IconDotsVertical />
                            <span className="sr-only">Abrir menú</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onToggleStatus(row.original.id)}
                        >
                            {row.original.status === "active" ? "Desactivar" : "Activar"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            variant="destructive"
                            onClick={() => onDelete(row.original.id)}
                        >
                            Eliminar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ]
}
