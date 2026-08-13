"use client"

import { useState, useEffect } from 'react';
import { IntegrationsService, ScopeCatalogModule, ApiClientItem } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { showToast } from '@/components/sonner/CustomToaster';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, X, Loader2, Info } from 'lucide-react';

interface CreateApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateApiKeyModal({ isOpen, onClose, onSuccess }: CreateApiKeyModalProps) {
  const [name, setName] = useState('');
  const [scopesCatalog, setScopesCatalog] = useState<ScopeCatalogModule[]>([]);
  const [isLoadingScopes, setIsLoadingScopes] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{ apiKey: string; secret: string } | null>(null);
  const [copiedField, setCopiedField] = useState<'apiKey' | 'secret' | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setIsLoadingScopes(true);
      IntegrationsService.getScopesCatalog()
        .then(setScopesCatalog)
        .catch(() => setScopesCatalog([]))
        .finally(() => setIsLoadingScopes(false));
      setName('');
      setCreatedCredentials(null);
      setCopiedField(null);
      setErrors({});
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "El nombre es requerido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast(
        "Asegúrate de completar todos los campos obligatorios e intenta de nuevo.",
        "error",
        "Revisa los campos obligatorios"
      );
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      const res = await IntegrationsService.createApiClient({ name });
      setCreatedCredentials({ apiKey: res.api_client.api_key, secret: res.secret });
      onSuccess();
      showToast("API Key creada exitosamente", "success");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        showToast(
          error.response.data?.message || "Tu cuenta ya tiene una API Key activa. Revócala antes de crear una nueva.",
          "error"
        );
        onSuccess(); // refresca el listado para reflejar la API Key activa existente
      } else {
        showToast("Error al crear API Key", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (field: 'apiKey' | 'secret') => {
    const value = field === 'apiKey' ? createdCredentials?.apiKey : createdCredentials?.secret;
    if (value) {
      navigator.clipboard.writeText(value);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold">Nueva API Key</h3>
          {!createdCredentials && (
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {createdCredentials ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-medium mb-2">Llaves de integración creadas</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Por favor guarda estas credenciales ahora. <strong>El secreto no volverá a mostrarse por razones de seguridad.</strong>
              </p>

              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">API Key</label>
                  <div className="flex items-center gap-2 bg-muted p-4 rounded-md border border-border">
                    <code className="flex-1 text-left break-all">{createdCredentials.apiKey}</code>
                    <Button variant="outline" size="sm" onClick={() => handleCopy('apiKey')} className="bg-white hover:bg-gray-100 cursor-pointer">
                      {copiedField === 'apiKey' ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copiar
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Secreto</label>
                  <div className="flex items-center gap-2 bg-muted p-4 rounded-md border border-border">
                    <code className="flex-1 text-left break-all">{createdCredentials.secret}</code>
                    <Button variant="outline" size="sm" onClick={() => handleCopy('secret')} className="bg-white hover:bg-gray-100 cursor-pointer">
                      {copiedField === 'secret' ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <form id="create-api-key-form" onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre de la integración</label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                  }}
                  placeholder="Ej. Integración SAP"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permisos heredados de tu cuenta</label>
                <p className="text-xs text-muted-foreground mb-2">
                  Esta integración tendrá automáticamente los siguientes permisos, según los módulos activos de tu cuenta. No se pueden elegir manualmente.
                </p>
                <div className="border border-border rounded-md p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {isLoadingScopes ? (
                    <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando permisos...
                    </div>
                  ) : scopesCatalog.length === 0 ? (
                    <div className="flex items-start gap-2 text-sm text-muted-foreground py-2">
                      <Info className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>Tu cuenta no tiene módulos activos todavía. Aun así puedes crear la API Key, pero quedará sin permisos hasta que actives un módulo — contacta a soporte si esto no es lo esperado.</span>
                    </div>
                  ) : (
                    scopesCatalog.map(module => (
                      <div key={module.code} className="space-y-2">
                        <h4 className="font-semibold text-primary">{module.name}</h4>
                        <div className="pl-4 space-y-3">
                          {module.capabilities.map(cap => (
                            <div key={cap.code}>
                              <h5 className="text-sm font-medium text-foreground mb-1">{cap.name}</h5>
                              <div className="pl-4 flex flex-wrap gap-2">
                                {cap.scopes.map(scope => (
                                  <Badge key={scope.id} variant="outline" className="font-normal">
                                    {scope.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </form>
          )}
        </div>

        <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
          {createdCredentials ? (
            <Button onClick={onClose} variant="default" className="cursor-pointer">Cerrar</Button>
          ) : (
            <>
              <Button onClick={onClose} variant="outline" type="button" disabled={isLoading} className="cursor-pointer hover:bg-gray-100">Cancelar</Button>
              <Button form="create-api-key-form" type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading ? 'Creando...' : 'Crear API Key'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
