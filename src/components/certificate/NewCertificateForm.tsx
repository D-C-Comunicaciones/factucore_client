"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, UploadCloud, FileType2, KeyRound, FileKey } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { certificatesApi } from "@/lib/certificates";
import { showToast } from "@/components/sonner/CustomToaster";
import { queryClient } from "@/lib/queryClient";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useQuery } from "@tanstack/react-query";

interface NewCertificateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  hideCardStyles?: boolean;
  extraFooterAction?: React.ReactNode;
}

export function NewCertificateForm({ onSuccess, onCancel, hideCardStyles, extraFooterAction }: NewCertificateFormProps = {}) {
  const router = useRouter();

  const [method, setMethod] = React.useState<"file" | "base64">("file");
  const [file, setFile] = React.useState<File | null>(null);
  const [base64, setBase64] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isDragging, setIsDragging] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const [errors, setErrors] = React.useState<{ file?: boolean; base64?: boolean; password?: boolean }>({});
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: response } = useQuery({
    queryKey: ["certificate"],
    queryFn: () => certificatesApi.getCertificate(),
  });
  const existingCertificate = response?.data?.certificate || null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".p12") || droppedFile.name.endsWith(".pfx")) {
        setFile(droppedFile);
        setErrors((prev) => ({ ...prev, file: false }));
      } else {
        showToast("Solo se permiten archivos .p12 o .pfx", "error");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith(".p12") || selectedFile.name.endsWith(".pfx")) {
        setFile(selectedFile);
        setErrors((prev) => ({ ...prev, file: false }));
      } else {
        showToast("Solo se permiten archivos .p12 o .pfx", "error");
      }
    }
  };

  const handleSave = async () => {
    const isFileMissing = method === "file" && !file;
    const isBase64Missing = method === "base64" && !base64.trim();
    const isCertMissing = isFileMissing || isBase64Missing;
    const isPasswordMissing = !password;

    const newErrors = {
      file: isFileMissing,
      base64: isBase64Missing,
      password: isPasswordMissing
    };

    setErrors(newErrors);

    if (isCertMissing && isPasswordMissing) {
      showToast("El certificado y su contraseña son requeridos.", "error");
      return;
    }

    if (isCertMissing) {
      showToast(method === "file" ? "Debe seleccionar un archivo de certificado." : "Debe ingresar el certificado en base64.", "error");
      return;
    }

    if (isPasswordMissing) {
      showToast("La contraseña del certificado es requerida.", "error");
      return;
    }

    if (existingCertificate) {
      setIsConfirmModalOpen(true);
    } else {
      executeSave();
    }
  };

  const executeSave = async () => {

    setIsSaving(true);
    try {
      let payload;

      if (method === "file") {
        payload = new FormData();
        payload.append("certificate_file", file!);
        payload.append("password", password);
      } else {
        payload = {
          certificate_base64: base64.trim(),
          password: password
        };
      }

      await certificatesApi.createCertificate(payload);
      showToast("Certificado creado exitosamente", "success");

      // Invalidate the query so the list updates
      queryClient.invalidateQueries({ queryKey: ["certificate"] });

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/certificates");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Error al crear el certificado.";
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

        <Tabs value={method} onValueChange={(v) => setMethod(v as "file" | "base64")}>
          <TabsList className="mb-4">
            <TabsTrigger value="file">Archivo (.p12 / .pfx)</TabsTrigger>
            <TabsTrigger value="base64">Base64</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="mt-0">
            <div className="space-y-4">
              <label className="text-sm font-semibold text-[#123159]">
                Archivo del certificado <span className="text-primary">*</span>
              </label>

              <input
                type="file"
                accept=".p12,.pfx"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <div
                className={`w-full h-40 rounded-xl border-2 flex flex-col items-center justify-center gap-3 text-muted-foreground select-none cursor-pointer overflow-hidden relative transition-colors ${errors.file
                    ? "border-red-500 bg-red-50 border-solid"
                    : isDragging
                      ? "border-primary bg-primary/5 border-dashed"
                      : file
                        ? "border-green-500 bg-green-50 border-dashed"
                        : "border-border/50 bg-[#f8fafc] hover:bg-muted/50 border-dashed"
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {file ? (
                  <>
                    <FileKey className="w-10 h-10 text-green-500" />
                    <span className="text-sm font-medium text-green-700">
                      {file.name}
                    </span>
                    <span className="text-xs text-green-600">
                      Haz clic o arrastra para cambiar
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className={`w-10 h-10 ${errors.file ? "text-red-500" : "text-border"}`} />
                    <span className={`text-sm text-center leading-tight ${errors.file ? "text-red-600" : ""}`}>
                      Arrastra tu archivo aquí o <b>haz clic para seleccionar</b>
                    </span>
                    <span className={`text-xs ${errors.file ? "text-red-400" : "text-gray-400"}`}>
                      Sólo formato .p12 o .pfx
                    </span>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="base64" className="mt-0">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#123159]">
                Certificado en formato Base64 <span className="text-primary">*</span>
              </label>
              <textarea
                rows={6}
                className={`${baseInput} ${errors.base64 ? "border-red-500 focus:border-red-500 focus:ring-red-500/40 bg-red-50/50" : ""} resize-none font-mono text-xs`}
                placeholder="MIACAQMwgAYJKoZIhvcNAQcBoIAkgASCA+gwgD..."
                value={base64}
                onChange={(e) => {
                  setBase64(e.target.value);
                  setErrors(prev => ({ ...prev, base64: false }));
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-[#123159] flex items-center gap-2">
            <KeyRound className="w-4 h-4" />
            Contraseña del certificado <span className="text-primary">*</span>
          </label>
          <input
            type="password"
            className={`${baseInput} ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/40 bg-red-50/50" : ""} h-10`}
            placeholder="Ingresa la contraseña..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors(prev => ({ ...prev, password: false }));
            }}
          />
        </div>

      </div>

      <div className="px-6 py-4 border-t border-border/40 bg-[#f8fafc] flex items-center justify-end gap-3 rounded-b-2xl">
        {extraFooterAction}
        <Button
          type="button"
          variant="outline"
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
          disabled={isSaving}
          onClick={() => {
            if (onCancel) {
              onCancel();
            } else {
              router.push('/certificates');
            }
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-white shadow-md active:scale-95 cursor-pointer"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar certificado"
          )}
        </Button>
      </div>

      <AlertDialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Reemplazar certificado existente?</AlertDialogTitle>
            <AlertDialogDescription>
              Ya existe un certificado digital registrado ({existingCertificate?.subject?.CN || existingCertificate?.name}), emitido por ({existingCertificate?.issuer?.CN || 'Desconocido'}) con {existingCertificate?.days_remaining} días restantes. Si continúas, este certificado será reemplazado por el nuevo que estás intentando guardar y ya no podrás facturar usando el anterior. ¿Deseas continuar?
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
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
