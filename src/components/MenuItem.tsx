import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

type SubmenuType = string | { label: string; path: string; icon: React.ElementType };

interface MenuItemProps {
  item: {
    icon: React.ElementType;
    label: string;
    path: string;
    expandable?: boolean;
    submenu?: SubmenuType[];
  };
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (view: string) => void;
  hoveredSubmenu: string | null;
  onHoverSubmenu: (key: string | null) => void;
  isCollapsed?: boolean;
}

export function MenuItem({
  item,
  isExpanded,
  onToggle,
  isCollapsed = false
}: MenuItemProps) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Verifica si este item específico está activo (coincidencia exacta)
  const isDirectlyActive = currentPath === item.path;
  
  // Verifica si algún submenú está activo
  const hasActiveSubmenu = React.useMemo(() => {
    if (!item.expandable || !item.submenu || typeof window === 'undefined') {
      return false;
    }
    
    return item.submenu.some(sub => {
      const subPath = typeof sub === 'string' ? sub : sub.path;
      return currentPath === subPath || currentPath.startsWith(subPath + '/');
    });
  }, [item.expandable, item.submenu, currentPath]);

  // El menú está activo solo si:
  // 1. Es directamente activo Y no es expandible (items normales como Inicio)
  // 2. Tiene un submenú activo (items expandibles como Ingresos)
  const isMenuActive = (isDirectlyActive && !item.expandable) || hasActiveSubmenu;

  return (
    <div className="relative mx-2">
      {isMenuActive && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r" />
      )}
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-2 rounded-lg transition-colors
          ${isCollapsed ? 'justify-center px-1 py-2' : 'px-3 py-2'}
          ${isMenuActive ? 'bg-gray-100' : 'hover:bg-gray-100'}
        `}
        title={isCollapsed ? item.label : undefined}
        style={{ minHeight: isCollapsed ? '32px' : '36px' }}
      >
        <item.icon className={`flex-shrink-0 ${isMenuActive ? 'text-gray-900' : 'text-gray-400'} ${isCollapsed ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left text-sm text-gray-700">{item.label}</span>
            {item.expandable && (
              isExpanded ?
                <ChevronUp className="w-4 h-4 text-gray-700" /> :
                <ChevronDown className="w-4 h-4 text-gray-700" />
            )}
          </>
        )}
      </button>
    </div>
  );
}