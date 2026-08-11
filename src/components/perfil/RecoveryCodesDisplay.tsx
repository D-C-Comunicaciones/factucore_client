"use client"

import { Button } from "@/components/ui/button"
import { showToast } from "@/components/sonner/CustomToaster"
import { Copy } from "lucide-react"

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

            <Button type="button" variant="outline" onClick={handleCopyAll} className="w-fit">
                <Copy className="size-4" />
                Copiar todos
            </Button>

            <Button type="button" onClick={onAcknowledge} className="w-fit">
                Ya las guardé
            </Button>
        </div>
    )
}
