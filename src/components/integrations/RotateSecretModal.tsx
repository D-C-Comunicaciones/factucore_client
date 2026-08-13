"use client"

import { useState } from 'react';
import { IntegrationsService, ApiClientItem } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { showToast } from '@/components/sonner/CustomToaster';
import { Copy, Check, X, AlertTriangle } from 'lucide-react';

interface RotateSecretModalProps {
  isOpen: boolean;
  apiClient: ApiClientItem;
  onClose: () => void;
  onSuccess: () => void;
}

export function RotateSecretModal({ isOpen, apiClient, onClose, onSuccess }: RotateSecretModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [newSecret, setNewSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRotate = async () => {
    setIsLoading(true);
    try {
      const secret = await IntegrationsService.rotateApiClientSecret(apiClient.id);
      setNewSecret(secret);
      onSuccess();
      showToast("Secreto rotado exitosamente", "success");
    } catch (error) {
      showToast("Error al rotar el secreto", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (newSecret) {
      navigator.clipboard.writeText(newSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Rotar Secreto</h3>
          {!newSecret && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6">
          {newSecret ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-medium mb-2">Nuevo secreto generado</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Por favor guarda este nuevo secreto ahora. El anterior ya no funcionará.
              </p>
              
              <div className="flex items-center gap-2 bg-muted p-4 rounded-md border border-border">
                <code className="flex-1 text-left break-all">{newSecret}</code>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copiar
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-medium mb-2">¿Estás seguro?</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Vas a generar un nuevo secreto para <strong>{apiClient.name}</strong>. El secreto actual dejará de funcionar inmediatamente.
              </p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          {newSecret ? (
            <Button onClick={onClose} variant="default">Cerrar</Button>
          ) : (
            <>
              <Button onClick={onClose} variant="outline" disabled={isLoading}>Cancelar</Button>
              <Button onClick={handleRotate} variant="destructive" disabled={isLoading}>
                {isLoading ? 'Rotando...' : 'Sí, rotar secreto'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
