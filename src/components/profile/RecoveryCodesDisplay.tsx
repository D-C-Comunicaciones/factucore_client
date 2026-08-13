"use client"

import { Button } from "@/components/ui/button"
import { showToast } from "@/components/sonner/CustomToaster"
import { Copy, Download } from "lucide-react"

interface RecoveryCodesDisplayProps {
    codes: string[]
    onAcknowledge: () => void
}

export function RecoveryCodesDisplay({ codes, onAcknowledge }: RecoveryCodesDisplayProps) {
    const handleCopyAll = async () => {
        try {
            await navigator.clipboard.writeText(codes.join("\n"))
            showToast("Códigos copiados", "success")
        } catch {
            showToast("No se pudieron copiar los códigos", "error")
        }
    }

    const handleDownload = () => {
        const blob = new Blob([codes.join("\n")], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "codigos-de-respaldo.txt"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-3">
                Guarda estos códigos en un lugar seguro. No podrás verlos de nuevo, solo regenerarlos.
            </div>

            <div className="grid grid-cols-2 gap-2 rounded-md border p-4 font-mono text-sm">
                {codes.map((code) => (
                    <span key={code}>{code}</span>
                ))}
            </div>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCopyAll} className="cursor-pointer flex-1">
                    <Copy className="size-4" />
                    Copiar todos
                </Button>

                <Button type="button" variant="outline" onClick={handleDownload} className="cursor-pointer flex-1">
                    <Download className="size-4" />
                    Descargar en txt
                </Button>

                <Button type="button" onClick={onAcknowledge} className="cursor-pointer flex-1">
                    Ya las guardé
                </Button>
            </div>
        </div>
    )
}
