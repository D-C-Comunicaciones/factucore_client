"use client"

import { useState, useEffect } from 'react';
import { IntegrationsService, ScopeCatalogModule, ApiClientItem } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/sonner/CustomToaster';
import { Copy, Check, X } from 'lucide-react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateApiKeyModal({ isOpen, onClose, onSuccess }: CreateApiKeyModalProps) {
  const [name, setName] = useState('');
  const [scopesCatalog, setScopesCatalog] = useState<ScopeCatalogModule[]>([]);
  const [selectedScopes, setSelectedScopes] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      IntegrationsService.getScopesCatalog().then(setScopesCatalog).catch(() => {});
      setName('');
      setSelectedScopes([]);
      setCreatedSecret(null);
      setCopied(false);
    }
  }, [isOpen]);

  const handleToggleScope = (id: number) => {
    setSelectedScopes(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("El nombre es requerido", "error");

    setIsLoading(true);
    try {
      const res = await IntegrationsService.createApiClient({ name, scope_ids: selectedScopes });
      setCreatedSecret(res.secret);
      onSuccess();
      showToast("API Key creada exitosamente", "success");
    } catch (error) {
      showToast("Error al crear API Key", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (createdSecret) {
      navigator.clipboard.writeText(createdSecret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Nueva API Key</h3>
          {!createdSecret && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {createdSecret ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-medium mb-2">¡API Key creada!</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Por favor guarda este secreto ahora. <strong>No volverá a mostrarse por razones de seguridad.</strong>
              </p>
              
              <div className="flex items-center gap-2 bg-muted p-4 rounded-md border border-border">
                <code className="flex-1 text-left break-all">{createdSecret}</code>
                <Button variant="outline" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                  Copiar
                </Button>
              </div>
            </div>
          ) : (
            <form id="create-api-key-form" onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de la integración</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Integración SAP"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permisos (Scopes)</label>
                <div className="border border-border rounded-md p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {scopesCatalog.map(module => (
                    <div key={module.code} className="space-y-2">
                      <h4 className="font-semibold text-primary">{module.name}</h4>
                      <div className="pl-4 space-y-3">
                        {module.capabilities.map(cap => (
                          <div key={cap.code}>
                            <h5 className="text-sm font-medium text-foreground mb-1">{cap.name}</h5>
                            <div className="pl-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {cap.scopes.map(scope => (
                                <label key={scope.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300"
                                    checked={selectedScopes.includes(scope.id)}
                                    onChange={() => handleToggleScope(scope.id)}
                                  />
                                  <span>{scope.name}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {scopesCatalog.length === 0 && <p className="text-sm text-muted-foreground">Cargando permisos...</p>}
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          {createdSecret ? (
            <Button onClick={onClose} variant="default">Cerrar</Button>
          ) : (
            <>
              <Button onClick={onClose} variant="outline" type="button" disabled={isLoading}>Cancelar</Button>
              <Button form="create-api-key-form" type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear API Key'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
