"use client"

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Header } from '@/components/header/Header';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/components/sonner/CustomToaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Home, FileText, ShoppingBag, Users, Package, Building2, BarChart3, CheckSquare, Settings, ArrowDownLeft, Inbox, Tags, Layers, Warehouse, Sliders, ClipboardList, ListTree, Puzzle } from 'lucide-react';
import type { SidebarMenuItem } from '@/components/sidebar/Sidebar';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    // STATE
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
    const [hoveredSubmenu, setHoveredSubmenu] = useState<string | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);
    const [windowWidth, setWindowWidth] = useState(0);

    // HANDLERS
    const onToggleMenu = useCallback((menu: string) => {
        setExpandedMenus(prev => {
            const isOpen = prev[menu];
            return { ...prev, [menu]: !isOpen };
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
        setIsCollapsed(prev => !prev);
    }, []);

    const onToggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(prev => !prev);
    }, []);

    const onToggleUserMenu = useCallback(() => {
        setShowUserMenu(prev => !prev);
    }, []);

    const onHoverChange = useCallback((isHovered: boolean) => {
        setIsSidebarHovered(isHovered);
    }, []);

    // RESIZE
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

    // AUTH & GUARD
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        } else if (!isLoading && isAuthenticated && user) {
            const pathname = window.location.pathname;
            const routeGuards = [
                { prefix: '/ingresos', module: 'billing' },
                { prefix: '/contacts', module: 'contacts' },
                { prefix: '/inventario', module: 'inventory' },
                { prefix: '/items', module: 'items' },
                { prefix: '/integrations', permission: 'integrations.view' }
            ];

            const match = routeGuards.find(g => pathname.startsWith(g.prefix));
            if (match) {
                if (match.module && !user?.modules?.includes(match.module)) {
                    showToast("Módulo inactivo para su cuenta", "error");
                    router.push('/dashboard');
                } else if (match.permission && !user?.permissions?.some(p => p.name === match.permission)) {
                    showToast("No tiene permisos para acceder a esta ruta", "error");
                    router.push('/dashboard');
                }
            }
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || !isAuthenticated) return null;

    // FUNCIONES DE VERIFICACIÓN
    const hasModule = useCallback((moduleCode?: string) => {
        if (!moduleCode) return true;
        return user?.modules?.includes(moduleCode) ?? true; // fallback to true if no modules array
    }, [user]);

    const hasPermission = useCallback((permission?: string) => {
        if (!permission) return true;
        return user?.permissions?.some(p => p.name === permission) ?? true;
    }, [user]);

    // MENU CONFIG
    const rawMenuItems: SidebarMenuItem[] = [
        { icon: Home, label: 'Inicio', path: '/dashboard' },
        { icon: Inbox, label: 'Bandeja de entrada', path: '/bandeja' },
        {
            icon: ArrowDownLeft,
            label: 'Ingresos',
            path: '/ingresos',
            expandable: true,
            moduleCode: 'billing',
            submenu: [
                { icon: FileText, label: 'Factura de venta', path: '/invoices' },
                { icon: FileText, label: 'Pagos recibidos', path: '/payments' },
                { icon: FileText, label: 'Devoluciones en venta', path: '/returns' },
                { icon: FileText, label: 'Notas débito', path: '/debit-notes', moduleCode: 'credit_notes' },
                { icon: FileText, label: 'Cotizaciones', path: '/quotes' },
                { icon: FileText, label: 'Remisiones', path: '/remissions' },
                { icon: FileText, label: 'Órd. de compra recibidas', path: '/purchase-orders' },
            ]
        },
        {
            icon: ShoppingBag,
            label: 'Gastos',
            path: '/gastos',
            expandable: true,
            submenu: [
                { icon: ShoppingBag, label: 'Facturas de compra', path: '/gastos/facturas-compra' },
                { icon: ShoppingBag, label: 'Documento soporte', path: '/gastos/documento-soporte' },
                { icon: ShoppingBag, label: 'Notas de ajuste', path: '/gastos/notas-ajuste' },
                { icon: ShoppingBag, label: 'Pagos', path: '/gastos/pagos' },
                { icon: ShoppingBag, label: 'Pagos recurrentes', path: '/gastos/pagos-recurrentes' },
                { icon: ShoppingBag, label: 'Notas débito', path: '/gastos/notas-debito' },
                { icon: ShoppingBag, label: 'Órdenes de compra', path: '/expenses/purchase-orders' },
                { icon: ShoppingBag, label: 'Recepción de comprobantes', path: '/gastos/recepcion-comprobantes' },
            ]
        },
        { icon: Users, label: 'Contactos', path: '/contacts', moduleCode: 'contacts' },
        {
            icon: Package,
            label: 'Inventario',
            path: '/inventario',
            expandable: true,
            moduleCode: 'inventory',
            submenu: [
                { icon: Package, label: 'Items de Venta', path: '/items', moduleCode: 'items' },
                { icon: BarChart3, label: 'Valor de inventario', path: '/inventario/valor' },
                { icon: Sliders, label: 'Ajustes de inventario', path: '/inventario/ajustes' },
                { icon: ClipboardList, label: 'Gestión de items', path: '/inventario/gestion', moduleCode: 'items' },
                { icon: Tags, label: 'Listas de precios', path: '/inventario/precios', moduleCode: 'items' },
                { icon: Warehouse, label: 'Bodegas', path: '/inventario/bodegas' },
                { icon: Layers, label: 'Categorías', path: '/inventario/categorias' },
                { icon: ListTree, label: 'Atributos', path: '/inventario/atributos' },
            ]
        },
        { icon: Building2, label: 'Bancos', path: '/bancos' },
        { icon: FileText, label: 'Contabilidad', path: '/contabilidad' },
        { icon: BarChart3, label: 'Reportes', path: '/reports' },
        { icon: CheckSquare, label: 'Mis tareas', path: '/tasks' },
        { icon: Settings, label: 'Configuración', path: '/configuration' },
        { icon: Puzzle, label: 'Integraciones', path: '/integrations', requiredPermission: 'integrations.view' },
    ];

    const menuItems = rawMenuItems
        .filter(item => hasModule(item.moduleCode))
        .map(item => {
            const isItemDisabled = !hasPermission(item.requiredPermission);
            let filteredSubmenu = item.submenu?.filter(sub => hasModule(sub.moduleCode));

            if (filteredSubmenu) {
                filteredSubmenu = filteredSubmenu.map(sub => ({
                    ...sub,
                    isDisabled: !hasPermission(sub.requiredPermission)
                }));
            }

            return {
                ...item,
                isDisabled: isItemDisabled,
                submenu: filteredSubmenu
            };
        });

    // 👉 ANCHO REAL DEL SIDEBAR (UNA SOLA FUENTE DE VERDAD)
    const sidebarWidth =
        windowWidth < 1024
            ? 0
            : (isCollapsed && !isSidebarHovered ? 56 : 256);

    return (
        <TooltipProvider delayDuration={0}>
            <div className="min-h-screen w-full bg-gray">

                {/* SIDEBAR */}
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

                {/* CONTENIDO */}
                <div
                    className="transition-all duration-300"
                    style={{ marginLeft: sidebarWidth }}
                >
                    <Header
                        showUserMenu={showUserMenu}
                        onToggleUserMenu={onToggleUserMenu}
                        onToggleSidebar={onToggleMobileMenu}
                        userName={user?.name}
                    />

                    <main className="px-4 md:px-6 py-4 max-w-[1400px] mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}