"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { NewSoftwareForm } from "./NewSoftwareForm";

interface NewSoftwareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewSoftwareModal({ open, onOpenChange }: NewSoftwareModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-2xl bg-white"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-[#f8fafc]">
          <DialogTitle className="text-base font-bold text-[#123159]">Nuevo Software</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 bg-white">
          <NewSoftwareForm 
            onSuccess={() => onOpenChange(false)}
            onCancel={() => onOpenChange(false)}
            hideCardStyles
            extraFooterAction={
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  router.push('/software/new');
                }}
                className="text-primary hover:text-primary/80 text-sm font-semibold flex items-center gap-1 transition-colors mr-auto"
              >
                Ir a formulario avanzado
              </button>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
