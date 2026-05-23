import { Phone, MessageCircle } from 'lucide-react';

interface TaskSettingsModalProps {
  onClose: () => void;
}

export function TaskSettingsModal({ onClose }: TaskSettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            Configuración <span className="text-primary">"Mis Tareas"</span>
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-lg leading-none">✕</button>
        </div>
        <div className="p-6">
          <p className="text-sm text-foreground mb-6">Administra las configuraciones relacionadas con tus tareas.</p>
          <div className="border border-border rounded-lg p-5">
            <div className="bg-[#25D366]/10 w-10 h-10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
            </div>
            <h3 className="font-semibold text-foreground text-base mb-2">Vinculación de WhatsApp</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Configura tu número WhatsApp y convierte cada mensaje en una tarea para tu equipo.
            </p>
            <button className="bg-[#25D366]/20 text-[#25D366] font-medium text-sm py-2 px-4 rounded-md flex items-center gap-2 hover:bg-[#25D366]/30 transition-colors">
              <Phone className="w-4 h-4" /> Vincular
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
