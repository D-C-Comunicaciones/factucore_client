import React from 'react';
import { useRouter } from 'next/navigation';
import { Settings, User, Lock, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface UserMenuProps {
  onClose: () => void;
}

export function UserMenu({ onClose }: UserMenuProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const name = user?.name || "Usuario";
  const email = user?.email || "";

  return (
    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar (inicial del primer nombre) */}
          <div className="w-12 h-12 bg-[#D5DFFE] rounded-full flex items-center justify-center text-[#1E3A8A] text-[18px] font-bold border border-[#B4C6FC] shrink-0">
            {name.trim().charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 text-[15px] leading-tight mb-0.5 truncate">
              {name}
            </div>
            <div className="text-[12px] text-gray-500 truncate mb-1">
              {email}
            </div>
            {/* Rol de usuario con inicial del rol */}
            {user?.level && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-5 h-5 min-w-[20px] min-h-[20px] bg-primary/10 text-primary rounded-full flex items-center justify-center text-[10px] font-bold border border-primary/20 shrink-0">
                  {user.level.trim().charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] font-medium text-gray-600 truncate">
                  {user.level}
                </span>
              </div>
            )}
          </div>
        </div>
        <button className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary/20 transition-colors w-fit">
          <ArrowUpRight className="w-3.5 h-3.5" />
          Configurar Identificación
        </button>
      </div>

      {/* FACTURACIÓN ESTADO */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-200">
        <span className="text-[14px] font-medium text-gray-800">
          Facturación electrónica
        </span>
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">
          Desactivada
        </span>
      </div>

      {/* ITEMS */}
      <div className="p-2 border-b border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
          <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="18" y="3" width="4" height="18"></rect>
            <rect x="10" y="8" width="4" height="13"></rect>
            <rect x="2" y="13" width="4" height="8"></rect>
          </svg>
          <span className="flex-1 text-left font-medium">Consumo del plan</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" />
        </button>

        <button
          onClick={() => { onClose(); router.push('/configuration'); }}
          className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          <span className="flex-1 text-left font-medium">Configuración</span>
        </button>

        <button
          onClick={() => { onClose(); router.push('/configuration/perfil'); }}
          className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
        >
          <User className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          <span className="flex-1 text-left font-medium">Mi perfil</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" />
        </button>

        <button
          onClick={() => { onClose(); router.push('/configuration/perfil?tab=seguridad'); }}
          className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors"
        >
          <Lock className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          <span className="flex-1 text-left font-medium">Seguridad</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" />
        </button>

        <button className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors">
          <div className="w-4 h-4 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          <span className="flex-1 text-left font-medium">Estado de las soluciones</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-500" />
        </button>
      </div>

      {/* FOOTER */}
      <div className="p-2">
        <button
          onClick={() => {
            onClose();
            logout();
          }}
          className="w-full flex items-center gap-3 px-3 h-9 text-[13px] text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
        >
          <LogOut className="w-4 h-4 text-gray-500 group-hover:text-gray-700" />
          <span className="flex-1 text-left font-medium">Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
}