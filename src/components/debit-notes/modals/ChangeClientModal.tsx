import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ChangeClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ChangeClientModal({ isOpen, onClose, onConfirm }: ChangeClientModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md p-6 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                <DialogHeader className="flex flex-row items-center justify-between mb-2">
                    <DialogTitle className="text-lg font-semibold text-slate-800">Cambiar cliente y reiniciar</DialogTitle>
                </DialogHeader>
                <div className="text-sm text-slate-600 mb-6">
                    Ten en cuenta que si eliges otro cliente, vas a perder el progreso de los datos diligenciados en esta nota débito.
                </div>
                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                        Seguir sin cambios
                    </button>
                    <button type="button" onClick={onConfirm} className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        Cambiar cliente
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
