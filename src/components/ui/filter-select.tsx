"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export interface FilterSelectOption {
    value: string
    label: string
}

export interface FilterSelectProps {
    value?: string
    onValueChange: (value: string) => void
    options: FilterSelectOption[]
    placeholder?: string
    className?: string
    contentClassName?: string
    disabled?: boolean
}

export function FilterSelect({
    value,
    onValueChange,
    options,
    placeholder = "Seleccionar",
    className,
    contentClassName,
    disabled = false,
}: FilterSelectProps) {
    const [open, setOpen] = React.useState(false)
    const selectedOption = options.find((o) => o.value === value)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-lg border border-foreground/20 bg-white px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-50 h-9 cursor-pointer",
                        className
                    )}
                >
                    <span className={cn("truncate text-left", !selectedOption && "text-muted-foreground")}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <ChevronDown className="size-4 opacity-50 shrink-0" />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={4}
                className={cn(
                    "min-w-[var(--radix-popover-trigger-width)] w-auto max-w-[400px] p-1 bg-white border border-border rounded-xl shadow-xl",
                    contentClassName
                )}
            >
                <div className="flex flex-col">
                    {options.map((option) => {
                        const selected = value === option.value
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onValueChange(option.value)
                                    setOpen(false)
                                }}
                                className={cn(
                                    "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm text-left cursor-pointer transition-colors",
                                    selected ? "bg-primary/5 text-primary" : "hover:bg-primary/5 hover:text-primary"
                                )}
                            >
                                <span className="truncate">{option.label}</span>
                                {selected && <Check className="size-4 shrink-0 text-primary" />}
                            </button>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}
