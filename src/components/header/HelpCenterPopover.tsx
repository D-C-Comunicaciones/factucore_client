import React, { useState, useEffect } from 'react';
import { Search, Sparkles, HeadphonesIcon, TrendingUp, X, ExternalLink } from 'lucide-react';
import { AuthService } from '@/lib/auth';

interface HelpCenterPopoverProps {
  onClose: () => void;
}

export function HelpCenterPopover({ onClose }: HelpCenterPopoverProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'resources'>('ai');
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const company = AuthService.getCompany<any>();
    if (company?.company_name) {
      setCompanyName(company.company_name);
    }
  }, []);

  return (
    <>
      {/* Overlay opcional para cerrar al hacer clic afuera (puedes quitarlo si no lo quieres) */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-screen w-[400px] bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h2 className="text-[17px] font-semibold text-gray-900">Centro de ayuda</h2>
          <div className="flex items-center gap-3">
            <button className="text-gray-500 hover:text-gray-700 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5">
          <button
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'ai'
              ? 'border-primary text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('ai')}
          >
            Asistente IA <span className="ml-1 px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded uppercase">Beta</span>
          </button>
          <button
            className={`flex-1 pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'resources'
              ? 'border-primary text-gray-900'
              : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            onClick={() => setActiveTab('resources')}
          >
            Recursos
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'ai' ? (
            <div className="flex flex-col">

              {/* Top Green Section */}
              <div className="bg-primary/5 px-6 pt-8 pb-10 flex flex-col items-center text-center">
                <Sparkles className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-[17px] font-semibold text-gray-900 mb-1">Buenos días.</h3>
                <p className="text-[15px] text-gray-700 mb-5">¿Cómo podemos ayudarte hoy?</p>

                <div className="relative w-full shadow-sm rounded-lg overflow-hidden">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cómo crear una factura..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Need more help */}
              <div className="px-5 py-4">
                <button className="w-full bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100 rounded-xl p-4 text-left group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HeadphonesIcon className="w-4 h-4 text-gray-700" />
                      <span className="font-semibold text-gray-900 text-[14px]">¿Necesitas más ayuda? 🔥</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    Nuestro equipo está listo para acompañarte en lo que necesites.
                  </p>
                </button>
              </div>

              {/* Tendencias */}
              <div className="px-5 pb-5">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <h4 className="font-medium text-gray-700 text-sm">Tendencias</h4>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="border border-gray-200 rounded-xl p-4 text-left hover:border-primary/50 transition-colors group flex flex-col h-full">
                    <Sparkles className="w-4 h-4 text-primary mb-2" />
                    <span className="font-medium text-gray-900 text-[13px] mb-1">Factucore IA</span>
                    <p className="text-[12px] text-gray-500 flex-1 mb-3">Tu Asistente Inteligente en Factucore.</p>
                    <div className="text-primary text-[13px] font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Ver resultados <span className="text-[10px]">→</span>
                    </div>
                  </button>

                  <button className="border border-gray-200 rounded-xl p-4 text-left hover:border-primary/50 transition-colors group flex flex-col h-full">
                    <svg className="w-4 h-4 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <span className="font-medium text-gray-900 text-[13px] mb-1">Facturación electrónica</span>
                    <p className="text-[12px] text-gray-500 flex-1 mb-3">Requisitos y pasos</p>
                    <div className="text-primary text-[13px] font-medium flex items-center gap-1 group-hover:gap-2 transition-all mt-auto">
                      Ver resultados <span className="text-[10px]">→</span>
                    </div>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 text-sm">
              Próximamente: Recursos y tutoriales
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-white mt-auto">
          <div>
            <h5 className="font-semibold text-[13px] text-gray-900 mb-0.5">ID de soporte</h5>
            <p className="text-[12px] text-gray-500">Para generarlo, debes configurar la identificación de {companyName || "tu empresa"}.</p>
          </div>
          <button className="flex items-center gap-1.5 text-primary bg-primary/10 px-3 py-1.5 rounded-md text-[12px] font-medium hover:bg-primary/20 transition-colors whitespace-nowrap ml-3">
            <ExternalLink className="w-3.5 h-3.5" />
            Configurar
          </button>
        </div>

      </div>
    </>
  );
}
