import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export function NewQuoteFooter({
    onNavigate,
    onSaveAction,
    loadingGuardar,
    onPreview,
}: {
    onNavigate: () => void;
    onSaveAction: (action: "DRAFT" | "SEND" | "SEND_EMAIL" | "PRINT" | "CREATE_NEW") => void;
    loadingGuardar?: boolean;
    onPreview?: () => void;
}) {
    return (
        <div className="sticky bottom-0 z-30 pt-6">
        <div className="bg-white border border-border rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] p-6">
            <div className="flex items-center justify-end gap-3">
                <Button
                    variant="outline"
                    onClick={onPreview}
                    className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted hover:border-border cursor-pointer transition-colors flex items-center gap-2"
                >
                    <Eye className="w-4 h-4" />
                    Vista previa
                </Button>

                <Button
                    onClick={() => onSaveAction("SEND")}
                    disabled={loadingGuardar}
                    className="px-6 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
                >
                    {loadingGuardar ? "Guardando..." : "Guardar"}
                </Button>
            </div>
        </div>
        </div>
    );
}
