"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ResolutionForm } from "@/components/resolution/ResolutionForm";
import { useResolutions } from "@/hooks/useResolutions";
import { ResolutionsService } from "@/lib/resolutions";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Resolution } from "@/lib/resolutions";

export default function EditResolutionPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const { updateResolution, isUpdating } = useResolutions();

  const { data: resolutionData, isLoading } = useQuery({
    queryKey: ["resolution", id],
    queryFn: async () => {
      const res: any = await ResolutionsService.getResolution(id);
      const payload = res.data;
      return payload?.data?.resolution || payload?.resolution || payload?.data || payload;
    },
    enabled: !!id,
  });

  const handleSubmit = async (data: Partial<Resolution>) => {
    try {
      await updateResolution({ id, data });
      showToast("Numeración actualizada con éxito", "success");
      router.push("/resolutions");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Ocurrió un error al actualizar la numeración", "error");
    }
  };

  if (!isLoading && !resolutionData) {
    return (
      <div className="w-full min-h-screen text-foreground p-8 flex justify-center items-center">
        No se encontró la numeración.
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="page-title mb-2">Editar numeración</h1>
          <p className="page-subtitle text-sm text-gray-500">
            Actualiza los datos de tu numeración.
          </p>
        </div>

        <ResolutionForm
          initialData={resolutionData}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          isLoadingData={isLoading}
        />

      </div>
    </div>
  );
}
