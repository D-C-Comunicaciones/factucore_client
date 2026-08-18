import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function NewInternalPurchaseOrderFooter({
  onCancel,
  onSave,
  loading,
  saveLabel = "Guardar",
}: {
  onCancel: () => void;
  onSave: () => void;
  loading?: boolean;
  saveLabel?: string;
}) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg font-medium border border-border bg-white text-foreground hover:bg-muted hover:border-border cursor-pointer transition-colors"
        >
          Cancelar
        </Button>

        <Button
          onClick={onSave}
          disabled={loading}
          className="px-6 py-2.5 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 mr-1 animate-spin" />}
          {loading ? "Guardando..." : saveLabel}
        </Button>
      </div>
    </div>
  );
}
