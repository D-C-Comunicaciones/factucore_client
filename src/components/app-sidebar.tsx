"use client"

import * as React from "react"
import {
  IconDashboard,
  IconHelp,
  IconSettings,
  IconUsers,
  IconShield,
  IconShieldCheck,
  IconBuilding,
  IconCreditCard,
} from "@tabler/icons-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { NavSection } from "@/components/nav-section"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { NavUser } from "./nav-user"

function getUserFromLocalStorage() {
  if (typeof window === "undefined") return null
  try {
    const userStr = localStorage.getItem("auth_user")
    if (!userStr) return null
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

const data = {
  navMain: [
    {
      title: "Escritorio",
      url: "/dashboard",
      icon: IconDashboard,
    },
  ],
  navConfiguration: [
    { title: "Usuarios", url: "/users", icon: IconUsers },
    { title: "Roles", url: "/roles", icon: IconShield },
    { title: "Permisos", url: "/permissions", icon: IconShieldCheck },
  ],
  navDespacho: [
    { title: "Empresas", url: "/companies", icon: IconBuilding },
    { title: "Planes", url: "/plans", icon: IconCreditCard },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Obtener usuario de localStorage
  const user = React.useMemo(() => {
    if (typeof window === "undefined") {
      return {
        name: "",
        email: "",
        avatar: "",
        role: "",
      }
    }
    const data = getUserFromLocalStorage()
    return data
      ? {
        name: data.name,
        email: data.email,
        avatar: "/img/avatars/afleones.jpeg", // Puedes personalizar esto si tienes avatar en el backend
        role: data.level || "", // Usa el campo level como rol
      }
      : {
        name: "Usuario",
        email: "",
        avatar: "/img/avatars/afleones.jpeg",
        role: "",
      }
  }, [])

  const router = useRouter()

  // Helper para navegación SPA
  function handleNavClick(e: React.MouseEvent, url: string) {
    e.preventDefault()
    router.push(url)
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 pb-2">
        <a
          href="/dashboard"
          className="flex items-center justify-center w-full mb-2"
          onClick={e => handleNavClick(e, "/dashboard")}
        >
          <div className="relative w-full h-16">
            <Image
              src="/img/logo-horizontal.png"
              alt="D&C IDEM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </a>
      </SidebarHeader>

      <SidebarContent>
        <NavSection
          items={data.navMain}
          onItemClick={handleNavClick}
        />
        <NavSection
          title="Despacho"
          items={data.navDespacho}
          onItemClick={handleNavClick}
        />
        <NavSection
          title="Configuración"
          items={data.navConfiguration}
          onItemClick={handleNavClick}
        />
        <NavSection
          items={data.navSecondary}
          className="mt-auto"
          onItemClick={handleNavClick}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
