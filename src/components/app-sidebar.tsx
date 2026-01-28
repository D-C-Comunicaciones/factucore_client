"use client"

import * as React from "react"
import {
  IconDashboard,
  IconFolder,
  IconHelp,
  IconSearch,
  IconSettings,
  IconUsers,
  IconShield,
  IconShieldCheck,
  IconBuilding,
  IconCreditCard,
} from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"

import { NavDispatch } from "@/components/nav-dispatch"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="p-4 pb-2">
        <Link href="/dashboard" className="flex items-center justify-center w-full mb-2">
          <div className="relative w-full h-16">
            <Image
              src="/img/logo-horizontal.png"
              alt="D&C IDEM Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Sección principal */}
        <NavMain items={data.navMain} />

        {/* Sección Despacho */}
        <NavDispatch title="Despacho" items={data.navDespacho} />

        {/* Sección Configuración */}
        <NavDispatch title="Configuración" items={data.navConfiguration} />

        {/* Sección secundaria */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
