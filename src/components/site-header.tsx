"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname, useRouter } from "next/navigation"
import { Fragment } from "react"
import { IconHome } from "@tabler/icons-react"

const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: "Inicio",
  companies: "Empresas",
  // Agrega más rutas aquí si necesitas
}

export function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()

  // Generate breadcrumb items from pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  // Create breadcrumb items with proper labels
  const breadcrumbItems = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/")
    const label = BREADCRUMB_LABELS[segment] || (segment.charAt(0).toUpperCase() + segment.slice(1))
    const isLast = index === pathSegments.length - 1

    return {
      href,
      label,
      isLast,
    }
  })

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border border-b rounded-t-lg shadow-sm transition-[width,height] ease-linear mx-4 mt-4 bg-background border-b-gray-200 dark:border-b-gray-800">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <button
                type="button"
                className="flex items-center gap-1 hover:text-primary transition-colors"
                onClick={() => router.push("/dashboard")}
                style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
              >
                <IconHome size={18} />
                <span>Inicio</span>
              </button>
            </BreadcrumbItem>
            {breadcrumbItems
              .filter(item => item.href !== "/dashboard")
              .map((item, index, arr) => (
                <Fragment key={item.href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
        </div>
      </div>
    </header>
  )
}
