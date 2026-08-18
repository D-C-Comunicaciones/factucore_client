"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Plus,
  HelpCircle,
  Grid3x3,
  ChevronDown,
} from "lucide-react";
import { UserMenu } from "../UserMenu";
import { HelpCenterPopover } from "./HelpCenterPopover";
import { SolutionsPopover } from "./SolutionsPopover";
import { AccountSwitcher } from "./AccountSwitcher";
import { NotificationBell } from "./NotificationBell";
import { AuthService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ArrowDownToLine,
  CreditCard,
  FileText,
  FileBox,
  FileDown,
  ShoppingCart,
  Tag,
  Users,
  FileSignature,
  MoreHorizontal
} from "lucide-react";

interface HeaderProps {
  showUserMenu: boolean;
  onToggleUserMenu: () => void;
  onToggleSidebar: () => void;
  userName?: string;
}

export function Header({
  showUserMenu,
  onToggleUserMenu,
  onToggleSidebar,
  userName,
}: HeaderProps) {
  const initial = userName?.charAt(0).toUpperCase() || "?";
  const [activePopover, setActivePopover] = useState<'help' | 'solutions' | 'account' | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const company = AuthService.getCompany<any>();
    setCompanyName(company?.company_name || userName || "Mi Empresa");
  }, [userName]);

  const togglePopover = (popover: 'help' | 'solutions' | 'account') => {
    if (showUserMenu) {
      onToggleUserMenu();
    }
    setActivePopover(prev => prev === popover ? null : popover);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 md:px-4 flex items-center justify-between sticky top-0 z-30 h-14">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-1 md:gap-2 flex-1">

        {/* Mobile menu */}
        <button
          onClick={onToggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3 h-3 md:w-4 md:h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar (Cmd/Ctrl + K)"
            onClick={() => setSearchOpen(true)}
            readOnly
            className="w-full pl-7 md:pl-8 pr-3 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
          />
        </div>

        {/* Quick Create Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-lg hidden md:block outline-none">
              <Plus className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-md">
            <DropdownMenuItem onClick={() => router.push('/payment/new')} className="cursor-pointer focus:bg-gray-100">
              <ArrowDownToLine className="mr-2 h-4 w-4 text-gray-500" />
              <span>Ingreso</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/gastos/new')} className="cursor-pointer focus:bg-gray-100">
              <CreditCard className="mr-2 h-4 w-4 text-gray-500" />
              <span>Gasto</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={() => router.push('/invoices/new')} className="cursor-pointer focus:bg-gray-100">
              <FileText className="mr-2 h-4 w-4 text-gray-500" />
              <span>Facturas de venta</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/remissions/new')} className="cursor-pointer focus:bg-gray-100">
              <FileBox className="mr-2 h-4 w-4 text-gray-500" />
              <span>Remisión</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/purchase-orders/new')} className="cursor-pointer focus:bg-gray-100">
              <ShoppingCart className="mr-2 h-4 w-4 text-gray-500" />
              <span>Orden de compra recibida</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/supplier-invoices/new')} className="cursor-pointer focus:bg-gray-100">
              <FileDown className="mr-2 h-4 w-4 text-gray-500" />
              <span>Factura de proveedor</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/expenses/purchase-orders/new')} className="cursor-pointer focus:bg-gray-100">
              <ShoppingCart className="mr-2 h-4 w-4 text-gray-500" />
              <span>Orden de compra</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={() => router.push('/items/new')} className="cursor-pointer focus:bg-gray-100">
              <Tag className="mr-2 h-4 w-4 text-gray-500" />
              <span>Ítem de venta</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem onClick={() => router.push('/contacts/new')} className="cursor-pointer focus:bg-gray-100">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span>Contacto</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/quotes/new')} className="cursor-pointer focus:bg-gray-100">
              <FileSignature className="mr-2 h-4 w-4 text-gray-500" />
              <span>Cotización</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer focus:bg-gray-100">
                <MoreHorizontal className="mr-2 h-4 w-4 text-gray-500" />
                <span>Otros</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-white border border-gray-200 shadow-md">
                <DropdownMenuItem onClick={() => router.push('/other/new')} className="cursor-pointer focus:bg-gray-100">
                  <span>Otras opciones</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-1 md:gap-1">

        <div className="relative hidden md:block">
          <button
            onClick={() => togglePopover('help')}
            className="p-1 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-gray-700" />
          </button>

          {activePopover === 'help' && (
            <HelpCenterPopover onClose={() => setActivePopover(null)} />
          )}
        </div>

        <NotificationBell />

        <div className="relative hidden sm:block">
          <button
            onClick={() => togglePopover('solutions')}
            className="p-1 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <Grid3x3 className="w-4 h-4 text-gray-700" />
          </button>

          {activePopover === 'solutions' && (
            <SolutionsPopover onClose={() => setActivePopover(null)} />
          )}
        </div>

        {/* ACCOUNT SWITCHER (Pill Button) */}
        <div className="relative">
          <div
            onClick={() => togglePopover('account')}
            className={`flex items-center gap-2 px-2.5 py-1.5 bg-[#F8F9FA] rounded-xl cursor-pointer transition-colors border ${activePopover === 'account' ? 'border-[#2E8B82]' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 bg-[#D5DFFE] rounded-full flex items-center justify-center text-[#1E3A8A] text-[13px] font-medium border border-[#B4C6FC]">
              {companyName.charAt(0).toUpperCase()}
            </div>

            {/* Nombre */}
            <span className="text-[14px] font-medium text-[#001D4A] hidden md:block max-w-[100px] truncate">
              {companyName}
            </span>

            <ChevronDown className="w-4 h-4 text-[#001D4A] hidden md:block" />
          </div>

          {activePopover === 'account' && (
            <AccountSwitcher
              onClose={() => setActivePopover(null)}
              userName={userName || "Usuario"}
            />
          )}
        </div>

        {/* USER MENU */}
        <div className="relative hidden md:block ml-1">
          <button
            onClick={() => {
              setActivePopover(null);
              onToggleUserMenu();
            }}
            className="w-8 h-8 bg-[#EBF0FF] border-2 border-[#A5C0FE] rounded-full flex items-center justify-center text-[#1E3A8A] text-[14px] font-bold transition-all hover:bg-[#D5DFFE]"
          >
            {initial}
          </button>

          {showUserMenu && (
            <UserMenu onClose={onToggleUserMenu} />
          )}
        </div>

      </div>

      <CommandDialog open={searchOpen} onOpenChange={(open) => { setSearchOpen(open); if (!open) setSearchQuery(""); }} hideClose contentClassName="bg-white text-gray-900 border-none rounded-xl overflow-hidden max-w-2xl shadow-2xl p-0 gap-0 font-[Inter,Roboto,sans-serif]">
        <div className="p-3 pb-0">
          <div className="flex items-center px-3 border border-primary rounded-lg bg-gray-50 transition-colors">
            <Search className="w-5 h-5 text-gray-400 mr-2 shrink-0" />
            <input
              autoFocus
              className="flex h-11 w-full bg-transparent py-3 text-sm outline-none text-gray-900 placeholder:text-gray-400 font-[Inter,Roboto,sans-serif]"
              placeholder="escribe tu búsqueda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <kbd className="hidden sm:inline-block bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-[10px] text-gray-700 shrink-0">ESC</kbd>
          </div>
        </div>

        <div className="h-[340px] overflow-y-auto hide-scrollbar">
          {searchQuery.trim() === "" ? (
            <div className="h-full flex items-center justify-center text-sm text-gray-400">escribe tu busqueda</div>
          ) : (
            <CommandList className="bg-white max-h-none h-auto p-2 overflow-visible">
              <CommandEmpty className="text-gray-400 py-6 text-center text-sm">No se encontraron resultados.</CommandEmpty>

              <CommandGroup className="[&_[cmdk-group-heading]]:hidden">
                {[
                  // Ingresos
                  { parent: "Ingresos", title: "Factura de venta", path: "/invoices", keywords: ["ingresos", "facturas", "venta", "ventas", "facturacion", "invoices"] },
                  { parent: "Ingresos", title: "Pagos recibidos", path: "/payments", keywords: ["ingresos", "pagos", "recibidos", "cobros", "abonos", "payments"] },
                  { parent: "Ingresos", title: "Devoluciones en venta", path: "/returns", keywords: ["ingresos", "devoluciones", "venta", "retornos", "returns"] },
                  { parent: "Ingresos", title: "Notas débito", path: "/debit-notes", keywords: ["ingresos", "notas", "debito", "debitos", "debit-notes"] },
                  { parent: "Ingresos", title: "Cotizaciones", path: "/quotes", keywords: ["ingresos", "cotizaciones", "presupuestos", "quotes"] },
                  { parent: "Ingresos", title: "Remisiones", path: "/remissions", keywords: ["ingresos", "remisiones", "despachos", "entregas", "remissions"] },
                  { parent: "Ingresos", title: "Órdenes de compra recibidas", path: "/purchase-orders", keywords: ["ingresos", "ordenes", "compra", "recibidas", "clientes", "purchase-orders"] },

                  // Gastos
                  { parent: "Gastos", title: "Facturas de compra", path: "/gastos/facturas-compra", keywords: ["gastos", "compras", "facturas", "proveedores"] },
                  { parent: "Gastos", title: "Documento soporte", path: "/gastos/documento-soporte", keywords: ["gastos", "soporte", "documento", "no obligados"] },
                  { parent: "Gastos", title: "Notas de ajuste", path: "/gastos/notas-ajuste", keywords: ["gastos", "notas", "ajuste", "correcciones"] },
                  { parent: "Gastos", title: "Pagos", path: "/gastos/pagos", keywords: ["gastos", "pagos", "egresos", "desembolsos"] },
                  { parent: "Gastos", title: "Pagos recurrentes", path: "/gastos/pagos-recurrentes", keywords: ["gastos", "pagos", "recurrentes", "suscripciones"] },
                  { parent: "Gastos", title: "Notas débito", path: "/gastos/notas-debito", keywords: ["gastos", "notas", "debito", "devoluciones compra"] },
                  { parent: "Gastos", title: "Órdenes de compra", path: "/expenses/purchase-orders", keywords: ["gastos", "ordenes", "compra", "pedidos"] },
                  { parent: "Gastos", title: "Recepción de comprobantes", path: "/gastos/recepcion-comprobantes", keywords: ["gastos", "recepcion", "comprobantes", "xml", "dian"] },

                  // Contactos
                  { parent: "Contactos", title: "Gestión de contactos", path: "/contacts", keywords: ["contactos", "clientes", "proveedores", "contacts", "terceros"] },

                  // Inventario
                  { parent: "Inventario", title: "Items de Venta", path: "/items", keywords: ["inventario", "items", "productos", "servicios", "articulos", "venta"] },
                  { parent: "Inventario", title: "Valor de inventario", path: "/inventario/valor", keywords: ["inventario", "valor", "costos", "kardex"] },
                  { parent: "Inventario", title: "Ajustes de inventario", path: "/inventario/ajustes", keywords: ["inventario", "ajustes", "entradas", "salidas"] },
                  { parent: "Inventario", title: "Gestión de items", path: "/inventario/gestion", keywords: ["inventario", "gestion", "items", "articulos"] },
                  { parent: "Inventario", title: "Listas de precios", path: "/inventario/precios", keywords: ["inventario", "listas", "precios", "tarifas"] },
                  { parent: "Inventario", title: "Bodegas", path: "/inventario/bodegas", keywords: ["inventario", "bodegas", "almacenes", "depositos"] },
                  { parent: "Inventario", title: "Categorías", path: "/inventario/categorias", keywords: ["inventario", "categorias", "grupos", "familias"] },
                  { parent: "Inventario", title: "Atributos", path: "/inventario/atributos", keywords: ["inventario", "atributos", "variantes", "tallas", "colores"] },

                  // Bancos
                  { parent: "Bancos", title: "Gestión de bancos", path: "/bancos", keywords: ["bancos", "cuentas", "conciliacion", "banks", "dinero", "caja"] },

                  // Contabilidad
                  { parent: "Contabilidad", title: "Asientos contables", path: "/contabilidad", keywords: ["contabilidad", "asientos", "libro diario", "accounting", "puc"] },

                  // Reportes
                  { parent: "Reportes", title: "Mis reportes", path: "/reports", keywords: ["reportes", "informes", "estadísticas", "ventas", "gastos", "reports"] },

                  // Mis tareas
                  { parent: "Mis tareas", title: "Lista de pendientes", path: "/tasks", keywords: ["tareas", "tasks", "pendientes", "actividades", "to-do"] },

                  // Configuración
                  { parent: "Configuración", title: "Ajustes del sistema", path: "/configuration", keywords: ["configuracion", "ajustes", "empresa", "settings", "usuarios", "perfil"] }
                ].map((item, index) => (
                  <CommandItem
                    key={index}
                    value={`${item.parent} ${item.title} ${item.keywords.join(" ")}`}
                    onSelect={() => {
                      router.push(item.path);
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="cursor-pointer text-gray-900 data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-900 flex-col items-start px-3 py-3 rounded-md mb-1"
                  >
                    <span className="font-bold text-[15px] mb-1">{item.parent}</span>
                    <span className="text-[13px] text-gray-500 font-normal">{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          )}
        </div>

        <div className="flex items-center justify-between px-4 py-3 text-[11px] text-gray-700 bg-primary/10 rounded-b-xl">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <kbd className="bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-[10px] text-gray-700">↵</kbd> para seleccionar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-[10px] text-gray-700">↓</kbd>
              <kbd className="bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-[10px] text-gray-700">↑</kbd> para navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="bg-primary/20 border border-primary/30 px-1.5 py-0.5 rounded text-[10px] text-gray-700">esc</kbd> para cerrar
            </span>
          </div>
          <span className="flex items-center gap-1.5 text-gray-700 shrink-0">
            Búsqueda por
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/factucore_logo_horizontal.webp" alt="Factucore" className="h-5 object-contain" />
          </span>
        </div>
      </CommandDialog>
    </header>
  );
}