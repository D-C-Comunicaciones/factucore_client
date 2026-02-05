"use client"

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Header } from '@/components/header/Header';
import { useAuth } from '@/contexts/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Home, FileText, ShoppingBag, Users, Package, Building2, BarChart3, CheckSquare, Settings, ArrowDownLeft, Inbox } from 'lucide-react';
import type { SidebarMenuItem } from '@/components/sidebar/Sidebar';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    // Sidebar/Menu state
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    // Handlers
    const onToggleMenu = useCallback((menu: string) => {
        setExpandedMenus((prev) => {
            const isCurrentlyExpanded = prev[menu];
            if (isCurrentlyExpanded) {
                return { ...prev, [menu]: false };
            }
            return { [menu]: true };
        });
    }, []);

    const onNavigate = useCallback((view: string) => {
        setIsMobileMenuOpen(false);
        router.push(view);
    }, [router]);

    const onHoverSubmenu = useCallback((key: string | null) => {
        setHoveredSubmenu(key);
    }, []);

    const onToggleCollapse = useCallback(() => {
        setIsCollapsed((prev) => !prev);
    }, []);

    const onToggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
    }, []);

    const onToggleUserMenu = useCallback(() => {
        setShowUserMenu((prev) => !prev);
    }, []);

    const onHoverChange = useCallback((isHovered: boolean) => {
        setIsSidebarHovered(isHovered);
    }, []);

    // Manejar resize del window - DEBE ESTAR ANTES del early return
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth >= 1024 && isMobileMenuOpen) {
                setIsMobileMenuOpen(false);
            }
        };

        setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobileMenuOpen]);

    // Auth check - DEBE ESTAR DESPUÉS de todos los otros hooks
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
        return null;
    }
    if (!isAuthenticated) {
        return null;
    }

    // Menú dinámico
    const menuItems: SidebarMenuItem[] = [
        { icon: Home, label: 'Inicio', path: '/dashboard' },
        { icon: Inbox, label: 'Bandeja de entrada', path: '/bandeja' },
        {
            icon: ArrowDownLeft,
            label: 'Ingresos',
            path: '/ingresos',
            expandable: true,
            submenu: [
                { icon: FileText, label: 'Factura de venta', path: '/invoices' },
                { icon: FileText, label: 'Facturas de venta recurrentes', path: '/ingresos/facturas-recurrentes' },
                { icon: FileText, label: 'Pagos recibidos', path: '/ingresos/pagos-recibidos' },
                { icon: FileText, label: 'Devoluciones en ventas', path: '/ingresos/devoluciones' },
                { icon: FileText, label: 'Notas débito', path: '/ingresos/notas-debito' },
                { icon: FileText, label: 'Cotizaciones', path: '/ingresos/cotizaciones' },
                { icon: FileText, label: 'Remisiones', path: '/ingresos/remisiones' }
            ]
        },
        {
            icon: ShoppingBag,
            label: 'Gastos',
            path: '/gastos',
            expandable: true,
            submenu: [
                { icon: FileText, label: 'Facturas de compra', path: '/gastos/facturas-compra' },
                { icon: FileText, label: 'Documento soporte', path: '/gastos/documento-soporte' },
                { icon: FileText, label: 'Notas de ajuste', path: '/gastos/notas-ajuste' },
                { icon: FileText, label: 'Pagos', path: '/gastos/pagos' },
                { icon: FileText, label: 'Pagos recurrentes', path: '/gastos/pagos-recurrentes' },
                { icon: FileText, label: 'Notas débito', path: '/gastos/notas-debito' },
                { icon: FileText, label: 'Órdenes de compra', path: '/gastos/ordenes-compra' },
                { icon: FileText, label: 'Recepción de comprobantes', path: '/gastos/recepcion-comprobantes' }
            ]
        },
        { icon: Users, label: 'Contactos', path: '/contactos', expandable: true, submenu: [] },
        {
            icon: Package,
            label: 'Inventario',
            path: '/inventario',
            expandable: true,
            submenu: [
                { icon: FileText, label: 'Ítems de venta', path: '/inventario/items-venta' },
                { icon: FileText, label: 'Valor de inventario', path: '/inventario/valor' },
                { icon: FileText, label: 'Ajustes de inventario', path: '/inventario/ajustes' },
                { icon: FileText, label: 'Gestión de ítems', path: '/inventario/gestion-items' },
                { icon: FileText, label: 'Listas de precios', path: '/inventario/listas-precios' },
                { icon: FileText, label: 'Bodegas', path: '/inventario/bodegas' },
                { icon: FileText, label: 'Categorías', path: '/inventario/categorias' },
                { icon: FileText, label: 'Atributos', path: '/inventario/atributos' }
            ]
        },
        { icon: Building2, label: 'Bancos', path: '/bancos', expandable: true, submenu: [] },
        { icon: FileText, label: 'Contabilidad', path: '/contabilidad', expandable: true, submenu: [] },
        { icon: BarChart3, label: 'Reportes', path: '/reportes' },
        { icon: CheckSquare, label: 'Mis tareas', path: '/tareas' },
        { icon: Settings, label: 'Configuración', path: '/config' },
    ];

    // Responsive sidebar width
    const sidebarWidth = (isCollapsed && !isSidebarHovered) ? 48 : 256;

    // Responsive margin for main content
    const mainStyle = {
        marginLeft: windowWidth < 1024 ? 0 : sidebarWidth,
        width: windowWidth < 1024 ? '100%' : `calc(100% - ${sidebarWidth}px)`,
    };

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen w-full bg-gray-100">
                <Sidebar
                    menuItems={menuItems}
                    expandedMenus={expandedMenus}
                    onToggleMenu={onToggleMenu}
                    onNavigate={onNavigate}
                    hoveredSubmenu={hoveredSubmenu}
                    onHoverSubmenu={onHoverSubmenu}
                    isCollapsed={isCollapsed}
                    onToggleCollapse={onToggleCollapse}
                    isMobileMenuOpen={isMobileMenuOpen}
                    onToggleMobileMenu={onToggleMobileMenu}
                    onHoverChange={onHoverChange}
                />
                <main
                    className="flex flex-col min-h-screen transition-all duration-300"
                    style={mainStyle}
                >
                    <Header
                        showUserMenu={showUserMenu}
                        onToggleUserMenu={onToggleUserMenu}
                        onToggleSidebar={onToggleMobileMenu}
                        isSidebarCollapsed={isCollapsed}
                        onToggleSidebarCollapse={onToggleCollapse}
                    />
                    <div className="flex flex-1 flex-col items-center px-2 md:px-4">
                        <div className="w-full max-w-10xl rounded-xl p-4 md:p-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}