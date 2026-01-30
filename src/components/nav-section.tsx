"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavSectionItem {
  title: string
  url: string
  icon: Icon
}

interface NavSectionProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  title?: string
  items: NavSectionItem[]
  onItemClick?: (e: React.MouseEvent, url: string) => void
}

export function NavSection({ title, items, onItemClick, ...props }: NavSectionProps) {
  return (
    <SidebarGroup {...props}>
      {title && <SidebarGroupLabel>{title}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={item.url}
                  onClick={onItemClick ? (e) => onItemClick(e, item.url) : undefined}
                  className="flex items-center gap-2"
                >
                  <item.icon className="!size-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
