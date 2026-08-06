"use client"

import { useEffect, useState } from 'react';
import { ApiClientItem, IntegrationsService } from '@/services/integrations.service';
import { Button } from '@/components/ui/button';
import { Plus, Key, RotateCcw, Ban, CheckCircle, Eye } from 'lucide-react';
import { showToast } from '@/components/sonner/CustomToaster';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
// Placeholder for Modals that will be implemented next
import { CreateApiKeyModal } from './CreateApiKeyModal';
import { RotateSecretModal } from './RotateSecretModal';

export function ApiKeysTab() {
  const [apiClients, setApiClients] = useState<ApiClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [rotateClient, setRotateClient] = useState<ApiClientItem | null>(null);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await IntegrationsService.getApiClients();
      setApiClients(data);
    } catch (error) {
      showToast("Error al cargar API Keys", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleRevoke = async (id: number) => {
    try {
      await IntegrationsService.revokeApiClient(id);
      showToast("API Key revocada exitosamente", "success");
      fetchClients();
    } catch (error) {
      showToast("Error al revocar API Key", "error");
    }
  };

  const handleReactivate = async (id: number) => {
    try {
      await IntegrationsService.reactivateApiClient(id);
      showToast("API Key reactivada exitosamente", "success");
      fetchClients();
    } catch (error) {
      showToast("Error al reactivar API Key", "error");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">API Keys</h2>
          <p className="text-sm text-muted-foreground">Gestiona las credenciales de acceso para tus integraciones.</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva API Key
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium rounded-tl-md">Nombre</th>
              <th className="px-4 py-3 font-medium">API Key</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Último uso</th>
              <th className="px-4 py-3 font-medium rounded-tr-md text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">Cargando...</td>
              </tr>
            ) : apiClients.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted-foreground">No hay API Keys registradas.</td>
              </tr>
            ) : (
              apiClients.map(client => (
                <tr key={client.id} className="border-b last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{client.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{client.api_key}</td>
                  <td className="px-4 py-3">
                    <Badge variant={client.is_active ? 'default' : 'destructive'}>
                      {client.is_active ? 'Activa' : 'Revocada'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {client.last_used_at ? dayjs(client.last_used_at).format('DD/MM/YYYY HH:mm') : 'Nunca'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setRotateClient(client)} title="Rotar Secreto">
                        <RotateCcw className="w-4 h-4 text-primary" />
                      </Button>
                      {client.is_active ? (
                        <Button variant="ghost" size="sm" onClick={() => handleRevoke(client.id)} title="Revocar">
                          <Ban className="w-4 h-4 text-destructive" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => handleReactivate(client.id)} title="Reactivar">
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

      <CreateApiKeyModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSuccess={fetchClients} 
      />

      {rotateClient && (
        <RotateSecretModal 
          isOpen={!!rotateClient} 
          apiClient={rotateClient}
          onClose={() => setRotateClient(null)} 
          onSuccess={fetchClients} 
        />
      )}
    </div>
  );
}
