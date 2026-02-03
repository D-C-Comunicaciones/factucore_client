import React from 'react';
import { ChevronDown, ChevronRight, ChevronUp, Plus } from 'lucide-react';

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
  onNavigate,
  hoveredSubmenu,
  onHoverSubmenu,
  isCollapsed = false
}: MenuItemProps) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center gap-3 px-3 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg text-sm transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        title={isCollapsed ? item.label : undefined}
      >
        <item.icon className="w-4 h-4 flex-shrink-0 text-gray-400" />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.label}</span>
            {item.expandable && (
              isExpanded ?
                <ChevronUp className="w-4 h-4" /> :
                <ChevronDown className="w-4 h-4" />
            )}
          </>
        )}
      </button>
    </div>
  );
}