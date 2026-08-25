"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { RoleListItem } from "@/types/roles"

interface RoleListboxProps {
    roles: RoleListItem[]
    selectedIds: Set<number>
    onToggle: (id: number) => void
    disabled?: boolean
    className?: string
}

export function RoleListbox({ roles, selectedIds, onToggle, disabled = false, className }: RoleListboxProps) {
    return (
        <div
            role="listbox"
            aria-multiselectable="true"
            className={cn(
                "flex max-h-56 flex-col overflow-y-auto rounded-md border border-gray-200 bg-white divide-y divide-gray-100",
                className
            )}
        >
            {roles.length === 0 && (
                <p className="px-3 py-4 text-sm text-muted-foreground">No hay roles disponibles.</p>
            )}
            {roles.map((role) => {
                const selected = selectedIds.has(role.id)
                return (
                    <button
                        key={role.id}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        disabled={disabled}
                        onClick={() => onToggle(role.id)}
                        className={cn(
                            "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                            selected ? "bg-primary/5 text-primary" : "text-foreground hover:bg-gray-50"
                        )}
                    >
                        <span className="flex flex-col">
                            <span className="font-medium">{role.name}</span>
                            {role.description && (
                                <span className="text-xs text-muted-foreground line-clamp-1">{role.description}</span>
                            )}
                        </span>
                        {selected && <Check className="w-4 h-4 shrink-0 text-primary" />}
                    </button>
                )
            })}
        </div>
    )
}
