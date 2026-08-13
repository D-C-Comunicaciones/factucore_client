import React, { useEffect, useState } from 'react';
import { Search, X, Check, Calculator } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface AccountSwitcherProps {
  onClose: () => void;
  userName: string;
}

export function AccountSwitcher({ onClose, userName }: AccountSwitcherProps) {
  const [companyName, setCompanyName] = useState<string>("Usuario");
  const [companyInitial, setCompanyInitial] = useState<string>("?");

  useEffect(() => {
    const company = AuthService.getCompany<any>();
    const name = company?.company_name || userName;
    setCompanyName(name);
    setCompanyInitial(name.charAt(0).toUpperCase());
  }, [userName]);

  return (
    <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">

      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-transparent">
        <h3 className="text-[15px] font-semibold text-gray-900">Cambiar cuenta</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-4 border-b border-gray-100">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-gray-700"
          />
        </div>
      </div>

      {/* Tu espacio */}
      <div className="p-4 border-b border-gray-100">
        <h4 className="text-[13px] font-medium text-gray-500 mb-3">Tu espacio</h4>
        <button className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors text-left group">
          <div className="w-9 h-9 rounded-lg bg-[#2E8B82] flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h5 className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900">Espacio Contador</h5>
            <p className="text-[12px] text-gray-500">Gestiona tus clientes</p>
          </div>
        </button>
      </div>

      {/* Empresas */}
      <div className="p-4">
        <h4 className="text-[13px] font-medium text-gray-500 mb-3">Empresas</h4>
        <button className="w-full flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors text-left group">
          <div className="w-9 h-9 rounded-lg bg-indigo-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[14px] font-bold">{companyInitial}</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 min-w-0">
            <h5 className="text-[14px] font-medium text-gray-700 group-hover:text-gray-900 truncate">
              {companyName}
            </h5>
            <span className="text-[13px] text-gray-500 shrink-0">(Tú)</span>
          </div>
          <Check className="w-4 h-4 text-[#2E8B82] shrink-0" />
        </button>
      </div>

    </div>
  );
}
