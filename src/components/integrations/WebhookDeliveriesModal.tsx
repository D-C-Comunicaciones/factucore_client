"use client"

import { useState, useEffect } from 'react';
import { WebhookEndpoint, WebhookDelivery, IntegrationsService } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { X, RefreshCw, CheckCircle, XCircle, AlertCircle, Clock, Ban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';

interface WebhookDeliveriesModalProps {
  isOpen: boolean;
  webhook: WebhookEndpoint;
  onClose: () => void;
}

export function WebhookDeliveriesModal({ isOpen, webhook, onClose }: WebhookDeliveriesModalProps) {
  const [deliveries, setDeliveries] = useState<WebhookDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchDeliveries = async (pageNum: number) => {
    setIsLoading(true);
    try {
      const res = await IntegrationsService.getWebhookDeliveries(webhook.id, pageNum);
      // Assuming response is paginated: { data: [...], current_page: 1, last_page: 5 } or similar.
      // If it's a direct array, we'll just handle it. We will assume standard Laravel pagination wrapping.
      const data = res.data?.data || res.data || res || [];
      const isLastPage = res.data?.current_page >= res.data?.last_page;
      
      if (pageNum === 1) {
        setDeliveries(data);
      } else {
        setDeliveries(prev => [...prev, ...data]);
      }
      setHasMore(!isLastPage && data.length === 25);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setPage(1);
      fetchDeliveries(1);
    }
  }, [isOpen, webhook.id]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchDeliveries(nextPage);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Éxito</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Fallido</Badge>;
      case 'exhausted':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200"><Ban className="w-3 h-3 mr-1" /> Agotado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold">Historial de Entregas</h3>
            <p className="text-sm text-muted-foreground">{webhook.name} - {webhook.url}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fetchDeliveries(1)}>
              <RefreshCw className="w-4 h-4 mr-2" /> Refrescar
            </Button>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-0 overflow-y-auto flex-1 bg-muted/10">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-white border-b sticky top-0 shadow-sm z-10">
              <tr>
                <th className="px-6 py-3 font-medium">Estado</th>
                <th className="px-6 py-3 font-medium">HTTP Code</th>
                <th className="px-6 py-3 font-medium">Intento</th>
                <th className="px-6 py-3 font-medium">Fecha de Petición</th>
                <th className="px-6 py-3 font-medium">Detalle Error</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && page === 1 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">Cargando historial...</td>
                </tr>
              ) : deliveries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-muted-foreground">No hay entregas registradas para este webhook.</td>
                </tr>
              ) : (
                deliveries.map(d => (
                  <tr key={d.id} className="border-b last:border-0 bg-white hover:bg-muted/30">
                    <td className="px-6 py-4">{getStatusBadge(d.status)}</td>
                    <td className="px-6 py-4 font-mono text-xs">{d.http_status_code || '-'}</td>
                    <td className="px-6 py-4">{d.attempt}</td>
                    <td className="px-6 py-4 text-muted-foreground">{dayjs(d.requested_at).format('DD/MM/YYYY HH:mm:ss')}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-xs text-destructive" title={d.error_message || ''}>
                      {d.error_message || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {hasMore && (
            <div className="flex justify-center p-4 bg-white border-t">
              <Button variant="outline" size="sm" onClick={loadMore} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Cargar más'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
