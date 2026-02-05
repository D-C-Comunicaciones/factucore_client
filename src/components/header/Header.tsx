import { Menu, Search, Plus, HelpCircle, Bell, Grid3x3, ChevronDown } from 'lucide-react';
import { UserMenu } from '../UserMenu';
import { ThemeToggle } from '@/components/ui/theme-toggle';

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
}: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-2 md:px-3 py-1 flex items-center justify-between sticky top-0 z-30 h-12">
      <div className="flex items-center gap-1 md:gap-2 flex-1">
        {/* Mobile menu button */}
        <button
          onClick={onToggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="w-3 h-3 md:w-4 md:h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-7 md:pl-8 pr-3 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-lg hidden md:block">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-1 md:gap-1">
        <button className="p-1 hover:bg-gray-100 rounded-lg hidden md:block">
          <HelpCircle className="w-4 h-4" />
        </button>
        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <Bell className="w-4 h-4" />
        </button>
        {/* <ThemeToggle /> */}
        <button className="p-1 hover:bg-gray-100 rounded-lg hidden sm:block">
          <Grid3x3 className="w-4 h-4" />
        </button>
        <button
          onClick={onToggleUserMenu}
          className="flex items-center gap-1 px-1 md:px-2 py-1 hover:bg-gray-100 rounded-lg relative"
        >
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            L
          </div>
          <span className="text-xs font-medium hidden md:block">LEONES...</span>
          <ChevronDown className="w-3 h-3 hidden md:block" />

          {showUserMenu && <UserMenu onClose={() => onToggleUserMenu()} />}
        </button>
        <button className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-semibold hidden md:flex">
          A
        </button>
      </div>
    </header>
  );
}