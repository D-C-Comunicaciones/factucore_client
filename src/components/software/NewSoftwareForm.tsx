"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Hash, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { softwaresApi } from "@/lib/softwares";
import { showToast } from "@/components/sonner/CustomToaster";
import { queryClient } from "@/lib/queryClient";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";

interface NewSoftwareFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  hideCardStyles?: boolean;
  extraFooterAction?: React.ReactNode;
}

export function NewSoftwareForm({ onSuccess, onCancel, hideCardStyles, extraFooterAction }: NewSoftwareFormProps = {}) {
  const router = useRouter();

  const [identifier, setIdentifier] = React.useState("");
  const [pin, setPin] = React.useState("");
  
  const [isSaving, setIsSaving] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<{ identifier?: boolean; pin?: boolean }>({});

  const { data: response } = useQuery({
    queryKey: ["software"],
    queryFn: () => softwaresApi.getSoftware(),
  });
  const existingSoftware = response?.data?.software || null;

  const handleSave = async () => {
    const isIdentifierMissing = !identifier.trim();
    const isPinMissing = !pin.trim();

    const newErrors = {
      identifier: isIdentifierMissing,
      pin: isPinMissing
    };
    
    setErrors(newErrors);

    if (isIdentifierMissing && isPinMissing) {
      showToast("El identificador y el PIN son requeridos.", "error");
      return;
    }

    if (isIdentifierMissing) {
      showToast("Debe ingresar el identificador del software.", "error");
      return;
    }

    if (isPinMissing) {
      showToast("Debe ingresar el PIN del software.", "error");
      return;
    }

    if (existingSoftware) {
      setIsConfirmModalOpen(true);
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        software_identifier: identifier.trim(),
        software_pin: pin.trim()
      };

      await softwaresApi.createSoftware(payload);
      showToast("Software creado exitosamente", "success");
      
      queryClient.invalidateQueries({ queryKey: ["software"] });
      
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/software");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear el software.";
      showToast(errorMessage, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const baseInput = "w-full bg-white px-3 py-2 text-sm border border-foreground/20 rounded-md shadow-none text-foreground transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40 outline-none";

  const containerClass = hideCardStyles 
    ? "" 
    : "bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm max-w-2xl mx-auto";

  return (
    <div className={containerClass}>
      <div className="p-6 space-y-6">

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#123159] flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Identificador del software <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            className={`${baseInput} ${errors.identifier ? "border-red-500 focus:border-red-500 focus:ring-red-500/40 bg-red-50/50" : ""} h-10`}
            placeholder="Ej: ecfeacc0-7060-4049-9207-5ba1f2ae9259"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              setErrors(prev => ({ ...prev, identifier: false }));
            }}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#123159] flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            PIN del software <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            className={`${baseInput} ${errors.pin ? "border-red-500 focus:border-red-500 focus:ring-red-500/40 bg-red-50/50" : ""} h-10`}
            placeholder="Ej: 12345"
            value={pin}
            onChange={(e) => {
              setPin(e.target.value);
              setErrors(prev => ({ ...prev, pin: false }));
            }}
          />
        </div>
        
      </div>
      
      <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex items-center justify-end gap-3 rounded-b-2xl">
        {extraFooterAction}
        <Button
          type="button"
          variant="outline"
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          disabled={isSaving}
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push('/software');
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar software"
          )}
        </Button>
      </div>

      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reemplazar software existente?</AlertDialogTitle>
            <AlertDialogDescription>
              Ya existe un software registrado ({existingSoftware?.name || "Software Propio"}). Si continúas, será reemplazado por el nuevo que estás intentando guardar. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                setIsConfirmModalOpen(false);
                executeSave();
              }}
            >
              Reemplazar software
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
