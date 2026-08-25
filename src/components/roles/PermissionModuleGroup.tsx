"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { getModuleLabel } from "@/data/permission-modules"
import type { Permission } from "@/types/permissions"

interface PermissionModuleGroupProps {
    module: string
    permissions: Permission[]
    selectedIds: Set<number>
    rejectedIds?: Set<number>
    disabled?: boolean
    onToggle: (permissionId: number) => void
    onToggleAll: (permissionIds: number[], checked: boolean) => void
    defaultOpen?: boolean
}

export function PermissionModuleGroup({
    module,
    permissions,
    selectedIds,
    rejectedIds,
    disabled = false,
    onToggle,
    onToggleAll,
    defaultOpen = true,
}: PermissionModuleGroupProps) {
    const [open, setOpen] = useState(defaultOpen)
    const permissionIds = permissions.map((p) => p.id)
    const allChecked = permissionIds.length > 0 && permissionIds.every((id) => selectedIds.has(id))
    const someChecked = permissionIds.some((id) => selectedIds.has(id))

    return (
        <div className="rounded-lg border border-gray-100 overflow-hidden">
            <div
                role="button"
                tabIndex={0}
                onClick={() => setOpen((o) => !o)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setOpen((o) => !o)
                    }
                }}
                className="w-full flex items-center justify-between gap-3 bg-gray-50 px-4 py-3 text-left cursor-pointer"
            >
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-foreground">{getModuleLabel(module)}</span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs text-muted-foreground">
                        {permissions.length} {permissions.length === 1 ? "permiso" : "permisos"}
                    </span>
                </div>
                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <label className={`flex items-center gap-2 text-xs text-muted-foreground ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
                        <Checkbox
                            checked={allChecked ? true : someChecked ? "indeterminate" : false}
                            disabled={disabled}
                            onCheckedChange={(checked) => onToggleAll(permissionIds, checked === true)}
                        />
                        Seleccionar todos
                    </label>
                    {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
            </div>

            {open && (
                <div className="p-4 flex flex-col gap-3">
                    {permissions.map((permission) => {
                        const isRejected = rejectedIds?.has(permission.id)
                        return (
                            <label
                                key={permission.id}
                                className={`flex items-start gap-2 text-sm ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"} ${isRejected ? "text-destructive" : "text-muted-foreground"}`}
                            >
                                <Checkbox
                                    checked={selectedIds.has(permission.id)}
                                    disabled={disabled}
                                    onCheckedChange={() => onToggle(permission.id)}
                                    className={isRejected ? "border-destructive" : undefined}
                                />
                                <span>
                                    {permission.description || permission.name}
                                    {isRejected && (
                                        <span className="block text-xs text-destructive">
                                            No disponible en el Plan actual
                                        </span>
                                    )}
                                </span>
                            </label>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
