import { Filter } from 'lucide-react';

interface TaskFiltersPopupProps {
  isOpen: boolean;
  onToggle: () => void;
  activeFilterTab: string;
  onTabChange: (tab: string) => void;
  activeFilters: string[];
  onToggleFilter: (filter: string) => void;
  onClearFilters: () => void;
}

const FILTER_TABS = ['Prioridad', 'Asignado a', 'Estado'];
const PRIORITY_OPTIONS = ['Muy alta', 'Alta', 'Media', 'Baja'];
const ASSIGNEE_OPTIONS = ['Sin responsable', 'Andrés Leones'];
const STATUS_OPTIONS = ['Por hacer', 'En progreso', 'Hecho'];

export function TaskFiltersPopup({
  isOpen,
  onToggle,
  activeFilterTab,
  onTabChange,
  activeFilters,
  onToggleFilter,
  onClearFilters,
}: TaskFiltersPopupProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <Filter className="w-4 h-4" />
        Filtros
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[400px] bg-white rounded-lg shadow-lg border border-border z-50">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-foreground text-base">Filtros</h3>
          </div>
          <div className="flex h-[200px]">
            {/* Tabs */}
            <div className="w-1/3 border-r border-border py-2 flex flex-col">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => onTabChange(tab)}
                  className={`text-left px-4 py-2 text-sm font-medium transition-colors ${
                    activeFilterTab === tab
                      ? 'bg-muted/50 text-foreground'
                      : 'text-muted-foreground hover:bg-muted/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Options */}
            <div className="w-2/3 p-4 flex flex-col gap-3">
              {(() => {
                const options =
                  activeFilterTab === 'Prioridad' ? PRIORITY_OPTIONS
                  : activeFilterTab === 'Asignado a' ? ASSIGNEE_OPTIONS
                  : STATUS_OPTIONS;
                return options.map(opt => (
                  <label key={opt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(opt)}
                      onChange={() => onToggleFilter(opt)}
                      className="rounded border-input text-primary focus:ring-primary w-4 h-4"
                    />
                    <span className="text-sm text-foreground">{opt}</span>
                  </label>
                ));
              })()}
            </div>
          </div>

          <div className="p-4 border-t border-border flex justify-center">
            <button
              onClick={onClearFilters}
              disabled={activeFilters.length === 0}
              className={`font-medium text-sm py-2 px-6 rounded-md transition-colors ${
                activeFilters.length > 0
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-primary/20 text-muted-foreground cursor-not-allowed'
              }`}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
