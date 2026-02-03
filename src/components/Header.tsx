import React from 'react';
import { Menu, Search, Plus, HelpCircle, Bell, Grid3x3, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  showUserMenu: boolean;
  onToggleUserMenu: () => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onToggleSidebarCollapse: () => void;
}

export function Header({
  showUserMenu,
  onToggleUserMenu,
  onToggleSidebar,
  isSidebarCollapsed,
  onToggleSidebarCollapse
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-1.5 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 md:w-5 md:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-9 md:pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-1 md:gap-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg hidden md:block">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg hidden sm:block">
          <Grid3x3 className="w-5 h-5" />
        </button>
        <button
          onClick={onToggleUserMenu}
          className="flex items-center gap-2 px-2 md:px-3 py-2 hover:bg-gray-100 rounded-lg relative"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
            L
          </div>
          <span className="text-sm font-medium hidden md:block">LEONES...</span>
          <ChevronDown className="w-4 h-4 hidden md:block" />

          {showUserMenu && <UserMenu onClose={() => onToggleUserMenu()} />}
        </button>
        <button className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold hidden md:flex">
          A
        </button>
      </div>
    </header>
  );
}