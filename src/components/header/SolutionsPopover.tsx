import React from 'react';
import { Calculator, Users, MonitorSmartphone, Settings, Check } from 'lucide-react';

interface SolutionsPopoverProps {
  onClose: () => void;
}

export function SolutionsPopover({ onClose }: SolutionsPopoverProps) {
  return (
    <div className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
      
      {/* Mis soluciones */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-xs font-medium text-gray-500 mb-3">Mis soluciones</h3>
        
        <div className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg border border-primary/20 bg-white flex items-center justify-center shrink-0">
            <Calculator className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-primary">Contabilidad</h4>
            <p className="text-xs text-gray-500 truncate">Contabiliza, factura y controla tu stock.</p>
          </div>
          <Check className="w-4 h-4 text-primary shrink-0 mt-1" />
        </div>
      </div>

      {/* Descubre más */}
      <div className="p-4 pb-2 border-b border-gray-100">
        <h3 className="text-xs font-medium text-gray-500 mb-3">Descubre más</h3>
        
        <div className="space-y-1">
          <div className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-lg border border-primary/20 bg-white flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-primary">Nómina</h4>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-medium rounded-md border border-green-200">Probar gratis</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">Emite fácil la nómina de tu equipo.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-lg border border-primary/20 bg-white flex items-center justify-center shrink-0">
              <MonitorSmartphone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-medium text-primary">POS</h4>
                <span className="px-2 py-0.5 bg-green-50 text-green-700 text-[11px] font-medium rounded-md border border-green-200">Probar gratis</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">Vende y factura electrónicamente.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50/50">
        <button className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors py-1.5">
          <Settings className="w-4 h-4" />
          Administrar mis soluciones
        </button>
      </div>

    </div>
  );
}
