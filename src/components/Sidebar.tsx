import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { MenuItem } from './MenuItem'
import { LogoHorizontal } from './LogoHorizontal'
import { LogoDC } from './LogoDC'
import {
  Plus,
  Users,
  X,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown
} from 'lucide-react'

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
                    ml-2 pl-4 border-l-2 border-gray-200 mt-1 space-y-1 overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isMenuOpen
                      ? 'max-h-[500px] opacity-100'
                      : 'max-h-0 opacity-0'}
                  `}
                >
                  {item.submenu?.map(sub => (
                    <div
                      key={sub.path}
                      className="relative group"
                      onMouseEnter={() => setHoveredSubItem(sub.path)}
                      onMouseLeave={() => setHoveredSubItem(null)}
                    >
                      <Link
                        href={sub.path}
                        className={`flex items-center px-2 py-1 text-sm text-gray-700 rounded transition-colors
                          ${hoveredSubItem === sub.path ? 'bg-[#F4F7FB]' : ''}
                        `}
                        style={{ minHeight: '32px' }}
                        onClick={() => onNavigate(sub.path)}
                      >
                        {/* Solo texto, sin icono */}
                        <span className="flex-1">{sub.label}</span>
                        {/* Botón "+" solo para "Factura de venta" y solo en hover */}
                        {sub.label === "Factura de venta" && hoveredSubItem === sub.path && (
                          <button
                            type="button"
                            className="ml-2 p-1 rounded hover:bg-teal-100 transition-colors"
                            style={{ background: 'transparent' }}
                            onClick={e => {
                              e.preventDefault();
                              e.stopPropagation();
                              onNavigate('NuevaFacturaView');
                            }}
                          >
                            <Plus className="w-4 h-4 text-teal-500" />
                          </button>
                        )}
                      </Link>
                    </div>
                  ))}
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
  onToggleMobileMenu
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
  const workspaceBtnRef = useRef<HTMLButtonElement>(null)
  const isSidebarExpanded = !isCollapsed || (isCollapsed && isHovered)

  // Cierra el dropdown si se hace click fuera
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        workspaceBtnRef.current &&
        !workspaceBtnRef.current.contains(event.target as Node)
      ) {
        setShowWorkspaceDropdown(false)
      }
    }
    if (showWorkspaceDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWorkspaceDropdown])

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
          ${isSidebarExpanded ? 'w-64' : 'w-16'}
          flex flex-col
        `}
        onMouseEnter={() => { if (isCollapsed) setIsHovered(true) }}
        onMouseLeave={() => { if (isCollapsed) setIsHovered(false) }}
      >
        {/* Botón cerrar mobile */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* HEADER SUPERIOR */}
        <div className={`flex flex-col gap-2 px-4 pt-4 pb-2 bg-white ${!isSidebarExpanded ? 'items-center px-0 pt-2 pb-2' : ''}`}>
          {/* Logo y collapse/expand button */}
          <div className={`flex items-center w-full ${!isSidebarExpanded ? 'justify-center' : 'justify-between'}`}>
            {isSidebarExpanded ? (
              <>
                <LogoHorizontal />
                {/* Collapse/Expand button justo al lado del logo, solo visible en desktop */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    setIsHovered(false);
                    if (typeof onToggleCollapse === 'function') {
                      onToggleCollapse();
                    }
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg hidden lg:flex ml-2"
                  aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
                  type="button"
                >
                  {isCollapsed
                    ? <PanelLeftClose className="w-5 h-5" />
                    : <PanelLeftOpen className="w-5 h-5" />
                  }
                </button>
              </>
            ) : (
              <LogoDC />
            )}
          </div>
          {/* Tooltip estilo burbuja con flecha (opcional, solo si quieres mantenerlo) */}
          <div
            className={`
              absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-[#232B3A] text-white text-xs font-semibold shadow-lg z-50
              opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
              transition-opacity
              flex items-center
            `}
            style={{
              whiteSpace: 'nowrap',
              top: '100%',
              marginTop: 12,
            }}
          >
            {isSidebarExpanded ? "Ocultar menú" : "Mostrar menú"}
            <span
              className="absolute left-1/2 -translate-x-1/2 -top-2 w-3 h-3"
              style={{ pointerEvents: 'none' }}
            >
              <svg width="16" height="8" viewBox="0 0 16 8" className="mx-auto block">
                <polygon points="8,8 0,0 16,0" fill="#232B3A" />
              </svg>
            </span>
          </div>
        </div>
        {/* Línea divisoria horizontal debajo del header/logo */}
        <div className="border-b border-gray-200 w-full" />
        {/* Empresa y usuario solo si expandido */}
        {isSidebarExpanded && (
          <div className="w-full relative px-2"> {/* Agrega px-2 para separar de los lados */}
            <button
              ref={workspaceBtnRef}
              className={`
                flex items-center gap-3 bg-white rounded-lg px-3 py-2 mt-2 w-full border border-gray-200
                hover:border-teal-400 transition
                ${showWorkspaceDropdown ? 'ring-2 ring-teal-200 border-teal-400' : ''}
              `}
              style={{ maxWidth: '100%', width: '100%' }} // Asegura que no sobresalga
              onClick={() => setShowWorkspaceDropdown((v) => !v)}
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={showWorkspaceDropdown}
            >
              <div className="w-9 h-9 bg-[#E6F6F3] rounded-full flex items-center justify-center">
                <LogoDC className="h-5" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-sm leading-tight truncate">Alegra Contabilidad</div>
                <div className="text-xs text-gray-500 truncate">Andrés Leones</div>
              </div>
              <ChevronsUpDown className="w-4 h-4 text-gray-400" />
            </button>
            {/* Dropdown: abre a la derecha */}
            {showWorkspaceDropdown && (
              <div
                className="absolute left-full top-0 ml-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50"
                tabIndex={-1}
              >
                <div className="px-4 pt-3 pb-1 text-xs font-semibold text-gray-500">
                  Tus espacios de trabajo
                </div>
                <div className="px-4 pb-2 text-xs text-gray-400 truncate">
                  LEONES PALACIO AND...
                </div>
                <ul className="py-1">
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 gap-2 rounded-lg bg-[#F4F7FB] text-teal-900 font-semibold"
                      tabIndex={0}
                    >
                      <span className="w-7 h-7 bg-[#E6F6F3] rounded-lg flex items-center justify-center">
                        <LogoDC className="h-4" />
                      </span>
                      <span className="flex-1 text-left">
                        Alegra Contabilidad
                        <div className="text-xs font-normal text-gray-500 leading-tight">
                          Facturación, reportes, ingresos y más.
                        </div>
                      </span>
                      <Check className="w-4 h-4 text-teal-500" />
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center w-full px-4 py-2 gap-2 rounded-lg hover:bg-gray-100 text-gray-900"
                      tabIndex={0}
                    >
                      <span className="w-7 h-7 bg-[#E6F6F3] rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-teal-500" />
                      </span>
                      <span className="flex-1 text-left">
                        Espacio Contador
                        <div className="text-xs font-normal text-gray-500 leading-tight">
                          Gestión de múltiples clientes.
                        </div>
                      </span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
        {/* MENU */}
        <nav className={`p-2 flex-1 overflow-y-auto flex flex-col ${!isSidebarExpanded ? 'items-center px-0' : ''}`}>
          {/* INICIO y BANDEJA DE ENTRADA */}
          <div>
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
          <div className={`my-2 border-t border-gray-200 ${!isSidebarExpanded ? 'mx-auto w-8' : ''}`} />
          {/* Resto del menú principal */}
          <div className={`flex-1 flex flex-col ${!isSidebarExpanded ? 'items-center' : ''}`}>
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
          {/* Descubre más soluciones, solo si expandido */}
          {/* {isSidebarExpanded && (
            <div className="border-t border-gray-200">
              <div className="text-xs font-semibold text-gray-500 px-3 pt-3 pb-1">
                Descubre más soluciones
              </div>
              <div>
                <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-[#8CA0B3] font-normal">
                  <FileText className="w-4 h-4" /> Nómina
                </button>
                <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-[#8CA0B3] font-normal">
                  <ShoppingBag className="w-4 h-4" /> POS
                </button>
                <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-[#8CA0B3] font-normal">
                  <Users className="w-4 h-4" /> Portal de clientes
                </button>
                <button className="w-full px-3 py-2 text-sm hover:bg-gray-100 rounded flex items-center gap-2 text-[#8CA0B3] font-normal">
                  <TrendingUp className="w-4 h-4" /> Alegra ventas
                </button>
              </div>
            </div>
          )} */}
        </nav>
      </div>
    </>
  )
}