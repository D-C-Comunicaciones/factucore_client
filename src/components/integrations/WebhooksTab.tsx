"use client"

import { useEffect, useState } from 'react';
import { WebhookEndpoint, IntegrationsService } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Plus, RotateCcw, Ban, CheckCircle, Activity } from 'lucide-react';
import { showToast } from '@/components/sonner/CustomToaster';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import dayjs from 'dayjs';

// Placeholders for modals
import { CreateWebhookModal } from './CreateWebhookModal';
import { WebhookDeliveriesModal } from './WebhookDeliveriesModal';

export function WebhooksTab() {
  const [webhooks, setWebhooks] = useState<WebhookEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deliveriesWebhook, setDeliveriesWebhook] = useState<WebhookEndpoint | null>(null);

  const fetchWebhooks = async () => {
    setIsLoading(true);
    try {
      const data = await IntegrationsService.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      showToast("Error al cargar Webhooks", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleRevoke = async (id: number) => {
    try {
      await IntegrationsService.revokeWebhook(id);
      showToast("Webhook revocado exitosamente", "success");
      fetchWebhooks();
    } catch (error) {
      showToast("Error al revocar Webhook", "error");
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await IntegrationsService.reactivateWebhook(id);
      showToast("Webhook reactivado exitosamente", "success");
      fetchWebhooks();
    } catch (error) {
      showToast("Error al reactivar Webhook", "error");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Webhooks</h2>
          <p className="text-sm text-muted-foreground">Configura URLs para recibir notificaciones en tiempo real sobre eventos de tu cuenta.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Webhook
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium rounded-tl-md">Nombre</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Suscripciones</th>
              <th className="px-4 py-3 font-medium rounded-tr-md text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-52" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-5 w-20 rounded" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-8 w-20 ml-auto" /></td>
                </tr>
              ))
            ) : webhooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No hay Webhooks registrados.</td>
              </tr>
            ) : (
              webhooks.map(hook => (
                <tr key={hook.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{hook.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{hook.url}</td>
                  <td className="px-4 py-3">
                    <Badge variant={hook.is_active ? 'default' : 'destructive'}>
                      {hook.is_active ? 'Activo' : 'Revocado'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className="bg-muted px-2 py-1 rounded text-xs">{hook.subscriptions?.length || 0} eventos</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setDeliveriesWebhook(hook)} title="Historial de entregas">
                        <Activity className="w-4 h-4 text-primary" />
                      </Button>
                      {hook.is_active ? (
                        <Button variant="ghost" size="sm" onClick={() => handleRevoke(hook.id)} title="Revocar">
                          <Ban className="w-4 h-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleReactivate(hook.id)} title="Reactivar">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateWebhookModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchWebhooks} 
      />

      {deliveriesWebhook && (
        <WebhookDeliveriesModal 
          isOpen={!!deliveriesWebhook} 
          webhook={deliveriesWebhook}
          onClose={() => setDeliveriesWebhook(null)} 
        />
      )}
    </div>
  );
}
