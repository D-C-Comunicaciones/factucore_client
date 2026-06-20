"use client";

import { useRouter } from "next/navigation";
import { ResolutionForm } from "@/components/resolution/ResolutionForm";
import { useResolutions } from "@/hooks/useResolutions";
import { showToast } from "@/components/sonner/CustomToaster";
import type { Resolution } from "@/lib/resolutions";

export default function NewResolutionPage() {
  const router = useRouter();
  const { createResolution, isUpdating } = useResolutions();

  const handleSubmit = async (data: Partial<Resolution>) => {
    try {
      await createResolution(data);
      showToast("Numeración creada con éxito", "success");
      router.push("/resolutions");
    } catch (error: any) {
      showToast(error.response?.data?.message || "Ocurrió un error al crear la numeración", "error");
    }
  };

  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="page-title mb-2">Nueva numeración</h1>
          <p className="page-subtitle text-sm text-gray-500">
            Crea una numeración para organizar y tener el control de tus documentos.{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Saber más
            </a>
          </p>
        </div>

        <ResolutionForm onSubmit={handleSubmit} isLoading={isUpdating} />

      </div>
    </div>
  );
}
