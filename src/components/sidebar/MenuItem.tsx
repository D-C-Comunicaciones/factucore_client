import { ChevronRight, Plus } from 'lucide-react';
import { SidebarMenuItem } from './Sidebar';

interface MenuItemProps {
  item: SidebarMenuItem
  isExpanded: boolean
  isActive?: boolean
  onNavigate: (path: string) => void
  isCollapsed: boolean
  isExpandable?: boolean
  onToggle?: () => void
}

export function MenuItem({
  item,
  isExpanded = false,
  isCollapsed = false,
  isActive = false,
  onNavigate,
  isExpandable = false,
  onToggle
}: MenuItemProps) {

  const Icon = item.icon;
  const showPlus = item.label === "Contactos";

  return (
    <div className={`${isCollapsed ? 'mx-0' : 'mx-1.5 mr-[1.125rem]'}`}>

      {/* INDICADOR IZQUIERDO */}
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-primary rounded-r" />
      )}

      {/* ITEM */}
      <div
        onClick={() => {
          if (isExpandable) {
            onToggle?.();
          } else {
            onNavigate(item.path);
          }
        }}
        className={`
          relative group w-full flex items-stretch
          rounded-md overflow-hidden
          cursor-pointer transition-colors

          ${isCollapsed
            ? 'justify-center h-10'
            : 'h-8'
          }

          ${isActive
            ? 'bg-primary/10'
            : 'hover:bg-primary/10'
          }
        `}
      >
        {/* CONTENIDO IZQUIERDA */}
        <div className="flex items-center gap-2 flex-1 px-2">

          {/* ICONO */}
          <Icon
            className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
          />

          {!isCollapsed && (
            <span className="flex-1 text-[12px] leading-none text-foreground">
              {item.label}
            </span>
          )}
        </div>

        {/* BOTÓN + (DERECHA COMPLETA) */}
        {showPlus && !isCollapsed && (
          <button
            type="button"
            className="
              flex items-center justify-center
              h-full w-10

              opacity-0 group-hover:opacity-100
              transition-all

              hover:bg-primary/20
            "
            onClick={(e) => {
              e.stopPropagation();
              onNavigate('/contacts/new');
            }}
          >
            <Plus className="w-4 h-4 text-primary" />
          </button>
        )}

        {/* CHEVRON */}
        {isExpandable && !isCollapsed && (
          <div className="flex items-center pr-2">
            <ChevronRight
              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''
                }`}
            />
          </div>
        )}
      </div>
    </div>
  );
}