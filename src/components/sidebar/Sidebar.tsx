import React, { useState } from 'react'
import Link from 'next/link'
import { MenuItem } from './MenuItem'
import { LogoHorizontal } from '../logos/LogoHorizontal'
import { LogoDC } from '../logos/LogoDC'
import { Plus, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollapseButton } from './CollapseButton'
import { WorkspaceSelector } from './WorkspaceSelector'

export interface SidebarMenuItem {
  icon: React.ElementType
  label: string
  path: string
  expandable?: boolean
  submenu?: SidebarMenuItem[]
}

interface SidebarProps {
  menuItems: SidebarMenuItem[]
  expandedMenus: Record<string, boolean>
  onToggleMenu: (menu: string) => void
  onNavigate: (view: string) => void
  hoveredSubmenu: string | null
  onHoverSubmenu: (key: string | null) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  isMobileMenuOpen: boolean
  onToggleMobileMenu: () => void
  onHoverChange?: (isHovered: boolean) => void
}

function SidebarMenuItems({
  menuItems,
  expandedMenus,
  onToggleMenu,
  onNavigate,
  hoveredSubmenu,
  onHoverSubmenu,
  isExpanded
}: {
  menuItems: SidebarMenuItem[]
  expandedMenus: Record<string, boolean>
  onToggleMenu: (menu: string) => void
  onNavigate: (view: string) => void
  hoveredSubmenu: string | null
  onHoverSubmenu: (key: string | null) => void
  isExpanded: boolean
}) {
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);

  return (
    <>
      {menuItems.map(item => {
        const menuKey = item.expandable
          ? `menu-${item.label}`
          : item.path

        const isMenuOpen = !!expandedMenus[menuKey]

        // Icono personalizado para Ingresos y Gastos
        let menuIcon = item.icon
        if (item.label === "Ingresos") menuIcon = ArrowDownLeft
        if (item.label === "Gastos") menuIcon = ArrowUpRight

        if (item.expandable) {
          return (
            <div key={menuKey}>
              {/* HEADER */}
              <div
                className="block w-full cursor-pointer"
                onClick={e => {
                  e.preventDefault()
                  e.stopPropagation()
                  onToggleMenu(menuKey)
                }}
                onMouseEnter={() => onHoverSubmenu(menuKey)}
                onMouseLeave={() => onHoverSubmenu(null)}
                role="button"
                tabIndex={0}
                aria-expanded={isMenuOpen}
              >
                <MenuItem
                  item={{ ...item, icon: menuIcon }}
                  isExpanded={isMenuOpen}
                  onToggle={() => { }}
                  onNavigate={() => { }}
                  hoveredSubmenu={hoveredSubmenu}
                  onHoverSubmenu={onHoverSubmenu}
                  isCollapsed={!isExpanded}
                />
              </div>

              {/* SUBMENU SOLO SI EL SIDEBAR ESTÁ EXPANDIDO */}
              {isExpanded && (
                <div
                  className={`
                    ml-6 pl-3 pr-0 mr-[1.125rem] border-l border-gray-200 mt-1 space-y-1 overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen
                      ? 'max-h-[500px] opacity-100'
                      : 'max-h-0 opacity-0'}
                  `}
                >
                  {item.submenu?.map(sub => {
                    const isActive = typeof window !== 'undefined' && window.location.pathname === sub.path;
                    return (
                      <div
                        key={sub.path}
                        className={`relative group flex items-center rounded-lg transition-colors
                          ${isActive ? 'bg-[#F4F7FB]' : hoveredSubItem === sub.path ? 'bg-[#F4F7FB]' : ''}
                        `}
                        onMouseEnter={() => setHoveredSubItem(sub.path)}
                        onMouseLeave={() => setHoveredSubItem(null)}
                        style={{ minHeight: '28px' }}
                      >
                        {/* Línea azul a la izquierda solo si está activo */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-teal-500 rounded-r" />
                        )}
                        <Link
                          href={sub.path}
                          className={`flex-1 flex items-center px-2 py-1 text-xs rounded-lg
                            ${isActive ? 'text-teal-900 font-semibold' : 'text-gray-700'}
                          `}
                          onClick={() => onNavigate(sub.path)}
                          style={{ minHeight: '28px' }}
                        >
                          <span className="flex-1">{sub.label}</span>
                        </Link>
                        {sub.label === "Factura de venta" && hoveredSubItem === sub.path && (
                          <button
                            type="button"
                            className="flex items-center justify-center h-7 w-7 mr-1 rounded transition-colors hover:bg-gray-200 cursor-pointer"
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              onNavigate('/invoices/new');
                            }}
                            title="Nueva factura de venta"
                          >
                            <Plus className="w-4 h-4 text-teal-500" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )
        }

        // ITEM NORMAL
        return (
          <Link
            key={menuKey}
            href={item.path}
            className="block"
            onClick={() => onNavigate(item.path)}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <MenuItem
              item={{ ...item, icon: menuIcon }}
              isExpanded={false}
              onToggle={() => { }}
              onNavigate={onNavigate}
              hoveredSubmenu={hoveredSubmenu}
              onHoverSubmenu={onHoverSubmenu}
              isCollapsed={!isExpanded}
            />
          </Link>
        )
      })}
    </>
  )
}

export function Sidebar({
  menuItems,
  expandedMenus,
  onToggleMenu,
  onNavigate,
  hoveredSubmenu,
  onHoverSubmenu,
  isCollapsed,
  onToggleCollapse,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onHoverChange
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const isSidebarExpanded = !isCollapsed || (isCollapsed && isHovered)

  const handleMouseEnter = () => {
    if (isCollapsed) {
      setIsHovered(true)
      onHoverChange?.(true)
    }
  }

  const handleMouseLeave = () => {
    if (isCollapsed) {
      setIsHovered(false)
      onHoverChange?.(false)
    }
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggleMobileMenu}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-white border-r border-gray-200
          transition-all duration-300
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isSidebarExpanded ? 'w-64' : 'w-12'}
          flex flex-col
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Botón cerrar mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden absolute top-3 right-3 p-2 hover:bg-gray-100 rounded-lg z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADER SUPERIOR */}
        <div className={`flex flex-col gap-1 px-2 pt-1 pb-0 bg-white ${!isSidebarExpanded ? 'items-center px-0 pt-1 pb-0' : ''}`}>
          {/* Logo y collapse/expand button */}
          <div className={`flex items-center w-full h-12 ${!isSidebarExpanded ? 'justify-center' : 'justify-between'}`}>
            {isSidebarExpanded ? (
              <>
                <div className="flex items-center h-12" style={{ marginTop: '-4px' }}>
                  <LogoHorizontal className="h-7" />
                </div>
                {/* Collapse/Expand button justo al lado del logo, solo visible en desktop */}
                <CollapseButton isCollapsed={isCollapsed} onToggleCollapse={onToggleCollapse} />
              </>
            ) : (
              <LogoDC />
            )}
          </div>
          
        </div>
        {/* Línea divisoria horizontal perfectamente alineada con el header */}
        <div
          className="absolute left-0 top-12 w-full border-b border-gray-200"
          style={{ zIndex: 2 }}
        />

        {/* Empresa y usuario solo si expandido */}
        {isSidebarExpanded && <WorkspaceSelector />}

        {/* Línea divisoria después del workspace */}
        {isSidebarExpanded && (
          <div className="w-full border-b border-gray-200 mt-2" />
        )}

        {/* MENU */}
        <nav className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className={`flex flex-col ${!isSidebarExpanded ? 'items-center px-0' : 'pr-2'} py-2`}>
              {/* INICIO y BANDEJA DE ENTRADA */}
              <div className={isSidebarExpanded ? 'space-y-0.5 mt-2' : 'space-y-1 mt-2'}>
                <SidebarMenuItems
                  menuItems={menuItems.slice(0, 2)}
                  expandedMenus={expandedMenus}
                  onToggleMenu={onToggleMenu}
                  onNavigate={onNavigate}
                  hoveredSubmenu={hoveredSubmenu}
                  onHoverSubmenu={onHoverSubmenu}
                  isExpanded={isSidebarExpanded}
                />
              </div>

              {/* Línea gris separadora */}
              <div className={`my-2 border-t border-gray-200 ${!isSidebarExpanded ? 'mx-auto w-8' : 'mx-2'}`} />

              {/* Resto del menú principal */}
              <div className={`flex flex-col ${!isSidebarExpanded ? 'items-center space-y-1' : 'space-y-0.5'}`}>
                <SidebarMenuItems
                  menuItems={menuItems.slice(2)}
                  expandedMenus={expandedMenus}
                  onToggleMenu={onToggleMenu}
                  onNavigate={onNavigate}
                  hoveredSubmenu={hoveredSubmenu}
                  onHoverSubmenu={onHoverSubmenu}
                  isExpanded={isSidebarExpanded}
                />
              </div>
            </div>
          </ScrollArea>
        </nav>
      </div>
    </>
  )
}