"use client";

import {
  Menu,
  Search,
  Plus,
  HelpCircle,
  Bell,
  Grid3x3,
  ChevronDown,
} from "lucide-react";
import { UserMenu } from "../UserMenu";

interface HeaderProps {
  showUserMenu: boolean;
  onToggleUserMenu: () => void;
  onToggleSidebar: () => void;
  userName?: string;
}

export function Header({
  showUserMenu,
  onToggleUserMenu,
  onToggleSidebar,
  userName,
}: HeaderProps) {
  const initial = userName?.charAt(0).toUpperCase() || "?";

  return (
    <header className="w-full bg-white border-b border-gray-200 px-3 md:px-4 flex items-center justify-between sticky top-0 z-30 h-14">

      {/* IZQUIERDA */}
      <div className="flex items-center gap-1 md:gap-2 flex-1">

        {/* Mobile menu */}
        <button
          onClick={onToggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3 h-3 md:w-4 md:h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full pl-7 md:pl-8 pr-3 py-1 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-ring/60"
          />
        </div>

        <button className="p-1 hover:bg-gray-100 rounded-lg hidden md:block">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-1 md:gap-1">

        <button className="p-1 hover:bg-gray-100 rounded-lg hidden md:block">
          <HelpCircle className="w-4 h-4" />
        </button>

        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <Bell className="w-4 h-4" />
        </button>

        <button className="p-1 hover:bg-gray-100 rounded-lg hidden sm:block">
          <Grid3x3 className="w-4 h-4" />
        </button>

        {/* USER MENU */}
        <div className="relative">

          {/* Trigger */}
          <div
            onClick={onToggleUserMenu}
            className="flex items-center gap-1 px-1 md:px-2 py-1 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            {/* Avatar */}
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
              {initial}
            </div>

            {/* Nombre */}
            <span className="text-xs font-medium hidden md:block">
              {userName}
            </span>

            {/* Flecha (si la quieres quitar, borra esta línea) */}
            <ChevronDown className="w-3 h-3 hidden md:block" />
          </div>

          {/* Dropdown */}
          {showUserMenu && (
            <UserMenu onClose={onToggleUserMenu} />
          )}
        </div>

        {/* Segundo avatar opcional */}
        <button className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-semibold hidden md:flex">
          A
        </button>

      </div>
    </header>
  );
}