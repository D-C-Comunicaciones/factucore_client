"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SoftwareList } from "@/components/software/SoftwareList";
import { NewSoftwareModal } from "@/components/software/NewSoftwareModal";
import { softwaresApi } from "@/lib/softwares";
import { useQuery } from "@tanstack/react-query";

export default function SoftwarePage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data: response, isLoading } = useQuery({
    queryKey: ["software"],
    queryFn: () => softwaresApi.getSoftware(),
  });
  const software = response?.data?.software || null;
  return (
    <div className="w-full min-h-screen text-foreground">
      <div className="w-full max-w-[1100px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
        
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="page-title mb-0 text-2xl font-bold text-[#123159]">Software</h1>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Nuevo Software
            </Button>
          </div>
          <p className="page-subtitle mb-0 text-sm text-gray-500">
            Configura el identificador y PIN de tu software propio para facturación electrónica.
          </p>
        </div>

        {/* LIST */}
        <SoftwareList software={software} loading={isLoading} />
        
        {/* MODAL */}
        <NewSoftwareModal open={isModalOpen} onOpenChange={setIsModalOpen} />
      </div>
    </div>
  );
}
