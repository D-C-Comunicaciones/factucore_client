import { MessageCircle, Sparkles } from 'lucide-react';

interface NewTaskDrawerProps {
  onClose: () => void;
}

export function NewTaskDrawer({ onClose }: NewTaskDrawerProps) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/30">
      <div className="w-[500px] bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-white">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <button className="flex items-center gap-1.5 hover:text-foreground">✓ Marcar como finalizada</button>
            <span>...</span>
            <span>🔗</span>
          </div>
          <button
            onClick={onClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium py-1.5 px-3 rounded-md flex items-center gap-1.5 transition-colors"
          >
            →| Cerrar
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <input
            type="text"
            placeholder="Escribe el nombre de la tarea"
            className="w-full text-2xl font-bold text-foreground placeholder:text-muted-foreground focus:outline-none mb-8"
          />

          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>📅</span><span className="w-32">Fecha de entrega</span><span className="text-foreground">Sin fecha</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>👤</span><span className="w-32">Responsable</span><span className="text-foreground">Sin responsable</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>↓</span><span className="w-32">Prioridad</span>
              <span className="px-2 py-0.5 border border-border rounded text-foreground text-xs">Baja</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <span>☺</span><span className="w-32">Estado</span>
              <span className="px-2 py-0.5 border border-border rounded text-foreground text-xs">Por hacer</span>
            </div>
          </div>

          {/* Descripción */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm">
              <span>✏</span><span>Descripción</span>
            </div>
            <div className="border border-border rounded-lg min-h-[150px] p-3 flex flex-col justify-between">
              <textarea className="w-full resize-none focus:outline-none text-sm placeholder:text-muted-foreground" rows={4} />
              <div className="flex items-center gap-3 text-muted-foreground border-t border-border pt-2 mt-2">
                <span className="text-xs">Normal text ▾</span>
                <span className="font-bold cursor-pointer hover:text-foreground">B</span>
                <span className="italic cursor-pointer hover:text-foreground">I</span>
                <span className="line-through cursor-pointer hover:text-foreground">A</span>
                <span className="cursor-pointer hover:text-foreground">...</span>
              </div>
            </div>
            <div className="mt-3">
              <button className="w-8 h-8 border border-dashed border-border rounded flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">+</button>
            </div>
          </div>

          {/* Comentarios */}
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="p-3 border-b border-border font-medium text-sm bg-white">Comentarios</div>
            <div className="p-3 flex justify-between items-center bg-muted/20">
              <span className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full cursor-pointer hover:bg-primary/20 transition-colors">
                Recientes ↓
              </span>
              <Sparkles className="w-4 h-4 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
            </div>
            <div className="p-8 flex flex-col items-center justify-center text-muted-foreground min-h-[150px]">
              <MessageCircle className="w-8 h-8 mb-2" />
              <span className="text-sm">Aún no hay comentarios</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
