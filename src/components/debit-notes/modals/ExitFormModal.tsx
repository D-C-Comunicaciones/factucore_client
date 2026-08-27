import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ExitFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ExitFormModal({ isOpen, onClose, onConfirm }: ExitFormModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-xl shadow-lg bg-white">
                <DialogHeader className="px-6 py-4 border-b border-slate-100 flex flex-row items-center justify-between">
                    <DialogTitle className="text-lg font-semibold text-slate-800">Salir del formulario</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-6 text-sm text-slate-600">
                    Perderás todo el progreso de la nota débito. <strong>¿Deseas continuar?</strong>
                </div>
                <div className="px-6 py-4 flex justify-end gap-3 bg-slate-50/50 border-t border-slate-100">
                    <button type="button" onClick={onClose} className="cursor-pointer px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
                        Continuar editando
                    </button>
                    <button type="button" onClick={onConfirm} className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                        Salir
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
