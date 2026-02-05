import { ChevronRight } from 'lucide-react';
import { SidebarMenuItem } from './Sidebar';

interface MenuItemProps {
  item: SidebarMenuItem;
  isExpanded?: boolean;
  onToggle?: () => void;
  onNavigate: (view: string) => void;
  hoveredSubmenu: string | null;
  onHoverSubmenu: (key: string | null) => void;
  isCollapsed?: boolean;
}

export function MenuItem({
  item,
  isExpanded = false,
  isCollapsed = false,
}: MenuItemProps) {
  const Icon = item.icon;
  const isActive = typeof window !== 'undefined' && window.location.pathname === item.path;

  return (
    <div className={`relative ${isCollapsed ? 'mx-0' : 'mx-1.5 mr-[1.125rem]'}`}>
      {isActive && !isCollapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-teal-500 rounded-r" />
      )}
      <button
        className={`
          w-full flex items-center gap-2 rounded-lg transition-colors border-none bg-transparent cursor-pointer
          ${isCollapsed ? 'justify-center p-2 min-h-[36px]' : 'p-1.5 px-2.5 min-h-[32px]'}
          ${isActive ? 'bg-gray-100' : 'hover:bg-gray-100'}
        `}
      >
        <Icon className={`flex-shrink-0 ${isCollapsed ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${isActive ? 'text-gray-900' : 'text-gray-500'}`} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left text-[13px] text-gray-700">{item.label}</span>
            {item.expandable && (
              <ChevronRight
                className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            )}
          </>
        )}
      </button>
    </div>
  );
}