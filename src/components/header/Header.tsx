"use client";

import { useState, useEffect } from "react";
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
import { HelpCenterPopover } from "./HelpCenterPopover";
import { SolutionsPopover } from "./SolutionsPopover";
import { AccountSwitcher } from "./AccountSwitcher";
import { AuthService } from "@/lib/auth";

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
  const [activePopover, setActivePopover] = useState<'help' | 'solutions' | 'account' | null>(null);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const company = AuthService.getCompany<any>();
    setCompanyName(company?.company_name || userName || "Mi Empresa");
  }, [userName]);

  const togglePopover = (popover: 'help' | 'solutions' | 'account') => {
    if (showUserMenu) {
      onToggleUserMenu();
    }
    setActivePopover(prev => prev === popover ? null : popover);
  };

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

        <div className="relative hidden md:block">
          <button 
            onClick={() => togglePopover('help')}
            className="p-1 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-gray-700" />
          </button>
          
          {activePopover === 'help' && (
            <HelpCenterPopover onClose={() => setActivePopover(null)} />
          )}
        </div>

        <button className="p-1 hover:bg-gray-100 rounded-lg">
          <Bell className="w-4 h-4" />
        </button>

        <div className="relative hidden sm:block">
          <button 
            onClick={() => togglePopover('solutions')}
            className="p-1 hover:bg-gray-100 rounded-lg flex items-center justify-center transition-colors"
          >
            <Grid3x3 className="w-4 h-4 text-gray-700" />
          </button>
          
          {activePopover === 'solutions' && (
            <SolutionsPopover onClose={() => setActivePopover(null)} />
          )}
        </div>

        {/* ACCOUNT SWITCHER (Pill Button) */}
        <div className="relative">
          <div
            onClick={() => togglePopover('account')}
            className={`flex items-center gap-2 px-2.5 py-1.5 bg-[#F8F9FA] rounded-xl cursor-pointer transition-colors border ${activePopover === 'account' ? 'border-[#2E8B82]' : 'border-gray-200 hover:border-gray-300'}`}
          >
            {/* Avatar */}
            <div className="w-7 h-7 bg-[#D5DFFE] rounded-full flex items-center justify-center text-[#1E3A8A] text-[13px] font-medium border border-[#B4C6FC]">
              {companyName.charAt(0).toUpperCase()}
            </div>

            {/* Nombre */}
            <span className="text-[14px] font-medium text-[#001D4A] hidden md:block max-w-[100px] truncate">
              {companyName}
            </span>

            <ChevronDown className="w-4 h-4 text-[#001D4A] hidden md:block" />
          </div>

          {activePopover === 'account' && (
            <AccountSwitcher 
              onClose={() => setActivePopover(null)} 
              userName={userName || "Usuario"} 
            />
          )}
        </div>

        {/* USER MENU */}
        <div className="relative hidden md:block ml-1">
          <button 
            onClick={() => {
              setActivePopover(null);
              onToggleUserMenu();
            }}
            className="w-8 h-8 bg-[#EBF0FF] border-2 border-[#A5C0FE] rounded-full flex items-center justify-center text-[#1E3A8A] text-[14px] font-bold transition-all hover:bg-[#D5DFFE]"
          >
            {initial}
          </button>
          
          {showUserMenu && (
            <UserMenu onClose={onToggleUserMenu} />
          )}
        </div>

      </div>
    </header>
  );
}