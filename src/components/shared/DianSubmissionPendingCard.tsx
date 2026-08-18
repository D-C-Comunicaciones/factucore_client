import { Loader2, AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DianSubmissionPendingCardProps {
    status: "QUEUED" | "PROCESSING" | "FAILED";
    timedOut: boolean;
    documentLabel: string;
    onCheckNow: () => void;
    onRetry?: () => void;
    isRetrying?: boolean;
}

export function DianSubmissionPendingCard({
    status,
    timedOut,
    documentLabel,
    onCheckNow,
    onRetry,
    isRetrying,
}: DianSubmissionPendingCardProps) {
    if (status === "FAILED") {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 flex flex-col items-center text-center gap-3">
                <AlertTriangle className="w-8 h-8 text-red-500" />
                <div>
                    <p className="font-medium text-slate-800">No se pudo procesar {documentLabel}</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">
                        Ocurrió un error técnico al validar el documento ante la DIAN (no es un rechazo de la DIAN).
                        Puedes intentar reenviarlo o contactar a soporte si el problema persiste.
                    </p>
                </div>
                {onRetry && (
                    <Button size="sm" onClick={onRetry} disabled={isRetrying} className="mt-2 cursor-pointer">
                        {isRetrying ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <RotateCw className="w-4 h-4 mr-2" />
                        )}
                        Reintentar envío
                    </Button>
                )}
            </div>
        );
    }

    if (timedOut) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6 flex flex-col items-center text-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <div>
                    <p className="font-medium text-slate-800">Esto está tardando más de lo normal</p>
                    <p className="text-sm text-slate-500 mt-1 max-w-md">
                        {documentLabel} se sigue procesando en el servidor. Puedes seguir navegando y volver más
                        tarde para revisar el estado.
                    </p>
                </div>
                <Button size="sm" variant="outline" onClick={onCheckNow} className="cursor-pointer">
                    Verificar ahora
                </Button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <div>
                <p className="font-medium text-slate-800">Validando ante la DIAN...</p>
                <p className="text-sm text-slate-500 mt-1">
                    Estamos procesando {documentLabel}. Esto puede tardar unos segundos.
                </p>
            </div>
        </div>
    );
}
