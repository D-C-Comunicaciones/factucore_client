"use client"

import { useState, useEffect } from 'react';
import { IntegrationsService } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { showToast } from '@/components/sonner/CustomToaster';
import { Copy, Check, X } from 'lucide-react';

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateWebhookModal({ isOpen, onClose, onSuccess }: CreateWebhookModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [eventTypes, setEventTypes] = useState<Record<string, string>>({});
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      IntegrationsService.getEventTypes().then(setEventTypes).catch(() => {});
      setName('');
      setUrl('');
      setSelectedEvents([]);
      setCreatedSecret(null);
      setCopied(false);
    }
  }, [isOpen]);

  const handleToggleEvent = (code: string) => {
    setSelectedEvents(prev => 
      prev.includes(code) ? prev.filter(e => e !== code) : [...prev, code]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return showToast("El nombre es requerido", "error");
    if (!url.startsWith('https://')) return showToast("La URL debe ser segura (https://)", "error");

    setIsLoading(true);
    try {
      const res = await IntegrationsService.createWebhook({ name, url, event_types: selectedEvents });
      setCreatedSecret(res.secret);
      onSuccess();
      showToast("Webhook creado exitosamente", "success");
    } catch (error) {
      showToast("Error al crear Webhook", "error");
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
          <h3 className="text-xl font-semibold">Nuevo Webhook</h3>
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
              <h4 className="text-lg font-medium mb-2">¡Webhook creado!</h4>
              <p className="text-sm text-muted-foreground mb-6">
                Por favor guarda este secreto de firma ahora. Tu servidor lo necesitará para verificar el origen de las peticiones mediante HMAC-SHA256. <strong>No volverá a mostrarse.</strong>
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
            <form id="create-webhook-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Nombre de referencia"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Mi ERP"
                  required
                />
                <Field
                  label="URL del Webhook (debe iniciar con https://)"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://mi-api.com/webhooks"
                  type="url"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Eventos a suscribir</label>
                <div className="border border-border rounded-md p-4 max-h-[300px] overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {Object.entries(eventTypes).map(([code, title]) => (
                      <label key={code} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/30 p-1 rounded">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedEvents.includes(code)}
                          onChange={() => handleToggleEvent(code)}
                        />
                        <span>{title}</span>
                      </label>
                    ))}
                    {Object.keys(eventTypes).length === 0 && <p className="text-sm text-muted-foreground">Cargando eventos...</p>}
                  </div>
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
              <Button form="create-webhook-form" type="submit" disabled={isLoading}>
                {isLoading ? 'Creando...' : 'Crear Webhook'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
