"use client"

import { ReactNode, useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface CollapsibleSectionProps {
    title: string
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
    children: ReactNode
}

export function CollapsibleSection({ title, defaultOpen, open: openProp, onOpenChange, children }: CollapsibleSectionProps) {
    const [openState, setOpenState] = useState(!!defaultOpen)
    const open = openProp ?? openState

    useEffect(() => {
        if (openProp !== undefined) setOpenState(openProp)
    }, [openProp])

    const setOpen = (next: boolean) => {
        setOpenState(next)
        onOpenChange?.(next)
    }

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-gray-100 bg-white">
            <CollapsibleTrigger className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer">
                <span className="font-semibold text-foreground">{title}</span>
                <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6">
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}
