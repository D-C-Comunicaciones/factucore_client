import React, { useState } from 'react'
import Link from 'next/link'
import { MenuItem } from './MenuItem'
import { LogoHorizontal } from '../logos/LogoHorizontal'
import { Plus, X, ArrowDownLeft, ArrowUpRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { CollapseButton } from './CollapseButton'
import { WorkspaceSelector } from './WorkspaceSelector'
import { usePathname } from "next/navigation";
import { Logo } from '../logos/Logo'

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
  const pathname = usePathname();

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
        const isActive =
          item.path === "/"
            ? pathname === "/"
            : pathname === item.path || pathname.startsWith(item.path + "/")
        if (item.expandable) {
          return (
            <div key={menuKey}>
              {/* HEADER */}
              <div
                className="block w-full"
                onMouseEnter={() => onHoverSubmenu(menuKey)}
                onMouseLeave={() => onHoverSubmenu(null)}
                role="button"
                tabIndex={0}
                aria-expanded={isMenuOpen}
              >
                <MenuItem
                  item={{ ...item, icon: menuIcon }}
                  isExpanded={isMenuOpen}
                  isActive={isActive}
                  onNavigate={onNavigate}
                  isCollapsed={!isExpanded}
                  showLabel={isExpanded}
                  isExpandable={true}
                  onToggle={() => onToggleMenu(menuKey)}
                />
              </div>

              {/* SUBMENU SOLO SI EL SIDEBAR ESTÁ EXPANDIDO */}
              {isExpanded && (
                <div
                  className={`
                    ml-6 pl-3 pr-0 mr-[1.125rem] border-l border-sidebar-border mt-1 space-y-1 overflow-hidden
                    transition-all duration-150 ease-in-out
                    ${isMenuOpen
                      ? 'max-h-[500px] opacity-100'
                      : 'max-h-0 opacity-0'}
                  `}
                >
                  {item.submenu?.map(sub => {
                    const isActive = pathname.startsWith(sub.path);

                    return (
                      <div
                        key={sub.path}
                        className={`
                          relative group flex items-stretch
                          rounded-md overflow-hidden
                          transition-colors
                          ${isActive ? 'bg-background' : 'hover:bg-background'}
                          h-[30px]
                        `}
                      >
                        {/* Línea azul */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r" />
                        )}

                        {/* TEXTO */}
                        <Link
                          href={sub.path}
                          className="flex items-center flex-1 h-full text-[14px] leading-tight px-2 overflow-hidden"
                        >
                          <span className="flex-1 text-foreground truncate">
                            {sub.label}
                          </span>
                        </Link>

                        {/* BOTÓN + */}
                        {(sub.label === "Factura de venta" ||
                          sub.label === "Items de Venta" ||
                          sub.label === "Bodegas" ||
                          sub.label === "Categorías" ||
                          sub.label === "Listas de precios" ||
                          sub.label === "Ajustes de inventario" ||
                          sub.label === "Facturas de compra" ||
                          sub.label === "Documento soporte" ||
                          sub.label === "Notas de ajuste" ||
                          sub.label === "Pagos" ||
                          sub.label === "Pagos recurrentes" ||
                          sub.label === "Notas débito" ||
                          sub.label === "Órdenes de compra" ||
                          sub.label === "Pagos recibidos" ||
                          sub.label === "Devoluciones en venta" ||
                          sub.label === "Cotizaciones" ||
                          sub.label === "Remisiones") && (
                            <Link
                              href={sub.path + '/new'}
                              className="
                              flex items-center justify-center w-10 h-full
                              opacity-0 group-hover:opacity-100
                              transition-all
                              hover:bg-primary/20
                              cursor-pointer
                            "
                              onClick={(e) => {
                                e.stopPropagation();
                                if (sub.path) onNavigate(sub.path + '/new');
                              }}
                            >
                              <Plus className="w-4 h-4 text-primary" />
                            </Link>
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
              isExpanded={isMenuOpen}
              isActive={isActive}
              isCollapsed={!isExpanded}
              onNavigate={onNavigate}
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
  const isSidebarExpanded = isMobileMenuOpen || !isCollapsed || (isCollapsed && isHovered)

  // Reset hover state when collapse status changes to ensure immediate visual feedback
  React.useEffect(() => {
    setIsHovered(false);
    onHoverChange?.(false);
  }, [isCollapsed, onHoverChange]);

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
      {/* OVERLAY MOBILE */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden transition-opacity"
          onClick={onToggleMobileMenu}
        />
      )}

      <div
        className={`
    fixed top-0 left-0 z-40
    h-screen bg-white border-r border-sidebar-border
    transition-[width] duration-100 ease-in-out
    ${isSidebarExpanded ? 'w-64' : 'w-14'}
    ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    flex flex-col
  `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Botón cerrar mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden absolute top-3 right-3 p-2 hover:bg-primary/10 rounded-lg z-20"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* HEADER SUPERIOR */}
        <div className="flex items-center h-14 border-b border-sidebar-border pl-3 pr-4">
          {isSidebarExpanded ? (
            <div className="flex items-center justify-between w-full">

              <LogoHorizontal className="h-30 max-w-[190px] object-contain" />

              <div className="hidden lg:block">
                <CollapseButton
                  isCollapsed={isCollapsed}
                  onToggleCollapse={onToggleCollapse}
                />
              </div>

            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Logo className="h-30 max-w-[50px] object-contain" />
            </div>
          )}
        </div>
        {/* Empresa y usuario solo si expandido */}
        {/*isSidebarExpanded && <WorkspaceSelector />*/}

        {/* Línea divisoria después del workspace */}
        {isSidebarExpanded && (
          <div className="w-full border-b border-sidebar-border mt-2" />
        )}

        {/* MENU */}
        <nav className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className={`flex flex-col ${!isSidebarExpanded ? 'items-center px-0' : 'pl-2 pr-0'} py-0`}>
              {/* INICIO y BANDEJA DE ENTRADA */}
              <div className={isSidebarExpanded ? 'space-y-0.5 mt-2' : 'space-y-0 mt-2'}>
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
              <div className={`flex flex-col ${!isSidebarExpanded ? 'items-center' : 'space-y-0'}`}>
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
      </div >
    </>
  )
}