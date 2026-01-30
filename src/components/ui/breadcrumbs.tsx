"use client"

import { useRouter } from "next/navigation"
import { IconHome } from "@tabler/icons-react"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const router = useRouter()
    return (
        <nav className="flex items-center gap-2 mb-4 text-muted-foreground text-sm" aria-label="Breadcrumb">
            {items.map((item, idx) => (
                <span key={item.label} className="flex items-center gap-1">
                    {idx === 0 ? (
                        <button
                            type="button"
                            className="flex items-center gap-1 hover:text-primary transition-colors"
                            onClick={() => item.href && router.push(item.href)}
                            style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                        >
                            <IconHome size={18} />
                            <span>{item.label}</span>
                        </button>
                    ) : (
                        <span className={item.href ? "hover:text-primary cursor-pointer" : ""} onClick={() => item.href && router.push(item.href)}>
                            {item.label}
                        </span>
                    )}
                    {idx < items.length - 1 && <span className="mx-1">/</span>}
                </span>
            ))}
        </nav>
    )
}
