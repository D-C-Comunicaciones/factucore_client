import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';

interface ChangeTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function ChangeTypeModal({ isOpen, onClose, onConfirm }: ChangeTypeModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <DialogTitle className="text-xl">Cambiar tipo de nota y reiniciar</DialogTitle>
                    </div>
                    <DialogDescription className="pt-4 text-base text-slate-600">
                        Ten en cuenta que si eliges otro tipo de nota crédito, vas a perder el progreso de los datos diligenciados en este documento.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                        Seguir sin cambios
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-slate-500 transition-colors cursor-pointer"
                    >
                        Cambiar tipo de nota
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
