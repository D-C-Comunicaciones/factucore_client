import { ChevronRight, Plus } from 'lucide-react';
import { showToast } from '@/components/sonner/CustomToaster';
import { SidebarMenuItem } from './Sidebar';

interface MenuItemProps {
  item: SidebarMenuItem
  isExpanded: boolean
  isActive?: boolean
  onNavigate: (path: string) => void
  isCollapsed: boolean
  isExpandable?: boolean
  onToggle?: () => void
  showLabel?: boolean
}

export function MenuItem({
  item,
  isExpanded = false,
  isCollapsed = false,
  isActive = false,
  onNavigate,
  isExpandable = false,
  onToggle,
  showLabel
}: MenuItemProps) {
  const sidebarExpanded = showLabel !== undefined ? showLabel : !isCollapsed;

  const Icon = item.icon;
  const showPlus = item.label === "Contactos";

  return (
    <div className={`${isCollapsed && !showLabel ? 'mx-0' : 'mx-1.5 mr-[1.125rem]'}`}>

      <div
        onClick={(e) => {
          if (item.isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            showToast("Usted no tiene permiso para usar esta función, contacte con el administrador.", "error");
            return;
          }
          if (isExpandable) {
            onToggle?.();
          } else {
            onNavigate(item.path);
          }
        }}
        className={`
      relative group w-full flex items-stretch
      rounded-md overflow-hidden
      transition-colors

      ${isCollapsed && !showLabel ? 'justify-center h-10' : 'h-8'}
      ${isActive ? 'bg-background' : ''}
      ${item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-background'}
    `}
      >

        {/* ✅ INDICADOR BIEN POSICIONADO */}
        {isActive && sidebarExpanded && (
          <div className="absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r" />
        )}

        {/* CONTENIDO */}
        <div className={`flex items-center gap-2 flex-1 ${isCollapsed && !showLabel ? 'justify-center px-0' : 'px-2'}`}>
          <Icon className={`
            ${isCollapsed && !showLabel ? 'w-6 h-6' : 'w-4 h-4'} 
            transition-all duration-300
            ${isActive ? 'text-primary' : 'text-muted-foreground'}
          `} />

          <span
            className="flex-1 text-[15px] leading-none text-foreground overflow-hidden whitespace-nowrap transition-all duration-200"
            style={{
              maxWidth: sidebarExpanded ? '200px' : '0px',
              opacity: sidebarExpanded ? 1 : 0,
            }}
          >
            {item.label}
          </span>
        </div>

        {showPlus && sidebarExpanded && (
          <button
            type="button"
            className="
              flex items-center justify-center h-full w-10
              opacity-0 group-hover:opacity-100
              hover:bg-primary/20
              cursor-pointer
            "
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onNavigate('/contacts/new');
            }}
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}

        {isExpandable && sidebarExpanded && (
          <div className="flex items-center pr-2">
            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </div>
        )}

      </div>
    </div>);
}