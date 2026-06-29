"use client"

import { useState } from 'react';
import { CheckSquare, Settings, Plus, Search, List, KanbanSquare, ChevronDown, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { TaskSettingsModal } from '@/components/task/TaskSettingsModal';
import { NewTaskDrawer } from '@/components/task/NewTaskDrawer';
import { TaskFiltersPopup } from '@/components/task/TaskFiltersPopup';

export default function TasksPage() {
  const [view, setView] = useState<'lista' | 'tablero'>('lista');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState('Prioridad');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">Mis tareas</h1>
          </div>
          <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors">
            <Phone className="w-4 h-4" /> Vincular WhatsApp
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 border border-input rounded-md hover:bg-muted text-muted-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={() => setIsNewTaskOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-2 px-4 rounded-md flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" /> NUEVA TAREA
          </button>
        </div>
      </div>

      {/* WHATSAPP BANNER */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="bg-[#25D366] p-2.5 rounded-lg flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-base">Crea tus tareas con WhatsApp</h3>
              <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-md">Beta</span>
            </div>
            <p className="text-muted-foreground text-sm">Convierte las solicitudes de tus clientes en tareas fáciles de gestionar.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <button className="text-primary text-sm font-medium hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors">Probar luego</button>
          <button className="border border-input hover:bg-muted text-foreground text-sm font-medium py-2 px-4 rounded-md transition-colors">Vincular número</button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-border">
        {(['lista', 'tablero'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`flex items-center gap-2 pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${view === v ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          >
            {v === 'lista' ? <List className="w-4 h-4" /> : <KanbanSquare className="w-4 h-4" />}
            {v === 'lista' ? 'Lista' : 'Tablero'}
          </button>
        ))}
      </div>

      {/* FILTERS BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Buscar" className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <TaskFiltersPopup
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(v => !v)}
            activeFilterTab={activeFilterTab}
            onTabChange={setActiveFilterTab}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            onClearFilters={() => setActiveFilters([])}
          />
        </div>
        <button className="flex items-center gap-2 text-primary text-sm font-medium hover:bg-primary/10 px-3 py-1.5 rounded-md transition-colors">
          <Sparkles className="w-4 h-4" /> Tareas sugeridas
        </button>
      </div>

      {/* LIST VIEW */}
      {view === 'lista' && (
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-border bg-muted/30">
            <div className="col-span-2 text-xs font-semibold text-muted-foreground uppercase">Título</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">Fecha De Entrega</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">Responsable</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase">Estado</div>
          </div>
          <div className="divide-y divide-border">
            {[
              { label: 'Pendiente', emoji: null, color: '' },
              { label: 'En progreso', emoji: '⏳', color: '' },
              { label: 'Hecho', emoji: '✓', color: 'text-green-600' },
            ].map(({ label, emoji, color }) => (
              <div key={label} className="p-4">
                <div className={`flex items-center gap-2 font-medium text-foreground mb-3 ${color}`}>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  {emoji && <span>{emoji}</span>} {label} <span className="text-muted-foreground font-normal">(0)</span>
                </div>
                <button onClick={() => setIsNewTaskOpen(true)} className="ml-6 text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Nueva tarea
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOARD VIEW */}
      {view === 'tablero' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {[
            { label: 'Pendiente', emoji: null, color: 'border-t-primary' },
            { label: 'En progreso', emoji: '⏳', color: 'border-t-yellow-400' },
            { label: 'Hecho', emoji: '✓', color: 'border-t-green-500' },
          ].map(({ label, emoji, color }) => (
            <div key={label} className={`bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden border-t-2 ${color}`}>
              <div className="p-4 flex items-center justify-between border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  {emoji && <span>{emoji}</span>} {label} <span className="text-muted-foreground font-normal text-sm">(0)</span>
                </h3>
                <button onClick={() => setIsNewTaskOpen(true)} className="text-muted-foreground hover:text-foreground">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="p-3 bg-muted/20 min-h-[150px] flex items-center justify-center">
                <button onClick={() => setIsNewTaskOpen(true)} className="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                  Nueva tarea <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALS */}
      {isSettingsOpen && <TaskSettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isNewTaskOpen && <NewTaskDrawer onClose={() => setIsNewTaskOpen(false)} />}

    </div>
  );
}
