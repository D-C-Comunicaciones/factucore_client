"use client"

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Header } from '@/components/header/Header';
import { useAuth } from '@/contexts/auth-context';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
    Home, FileText, ShoppingBag, Users, Package,
    Building2, BarChart3, CheckSquare, Settings,
    ArrowDownLeft, Inbox, Tags, Layers, Warehouse, Sliders, ClipboardList, ListTree
} from 'lucide-react';
import type { SidebarMenuItem } from '@/components/sidebar/Sidebar';

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
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

    // AUTH
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) return null;

    // MENU
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
                { icon: FileText, label: 'Pagos recibidos', path: '/ingresos/pagos-recibidos' },
                { icon: FileText, label: 'Devoluciones en venta', path: '/ingresos/devoluciones-venta' },
                { icon: FileText, label: 'Notas débito', path: '/ingresos/notas-debito' },
                { icon: FileText, label: 'Cotizaciones', path: '/ingresos/cotizaciones' },
                { icon: FileText, label: 'Remisiones', path: '/ingresos/remisiones' },
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
                { icon: ShoppingBag, label: 'Órdenes de compra', path: '/gastos/ordenes-compra' },
                { icon: ShoppingBag, label: 'Recepción de comprobantes', path: '/gastos/recepcion-comprobantes' },
            ]
        },
        { icon: Users, label: 'Contactos', path: '/contacts' },
        {
            icon: Package,
            label: 'Inventario',
            path: '/inventario',
            expandable: true,
            submenu: [
                { icon: Package, label: 'Items de Venta', path: '/items' },
                { icon: BarChart3, label: 'Valor de inventario', path: '/inventario/valor' },
                { icon: Sliders, label: 'Ajustes de inventario', path: '/inventario/ajustes' },
                { icon: ClipboardList, label: 'Gestión de items', path: '/inventario/gestion' },
                { icon: Tags, label: 'Listas de precios', path: '/inventario/precios' },
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
    ];

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
                    />

                    <main className="px-4 md:px-6 py-4 max-w-[1400px] mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </TooltipProvider>
    );
}