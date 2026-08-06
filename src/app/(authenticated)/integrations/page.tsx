"use client"

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeysTab } from '@/components/integrations/ApiKeysTab';
import { WebhooksTab } from '@/components/integrations/WebhooksTab';

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-[1200px] mx-auto py-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Integraciones</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra las API Keys y Webhooks para conectar otros sistemas con tu cuenta.
        </p>
      </div>

      <Tabs defaultValue="api-keys" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>
        <TabsContent value="api-keys">
          <ApiKeysTab />
        </TabsContent>
        <TabsContent value="webhooks">
          <WebhooksTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
