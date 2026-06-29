import React from "react";
import { CloudUpload } from "lucide-react";

interface ContactDetailAttachmentsProps {
    contact: any;
}

export function ContactDetailAttachments({ contact }: ContactDetailAttachmentsProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-12 flex flex-col items-center justify-center text-center">
                <CloudUpload className="w-10 h-10 text-slate-600 mb-4" />
                <h3 className="text-[15px] font-bold text-[#0F2843] mb-2">Arrastrar y soltar archivos</h3>
                <p className="text-sm text-slate-500 mb-4">Tu archivo debe pesar menos de 2 MB</p>
                <button className="text-primary font-medium text-sm hover:text-primary/90 transition-colors">
                    O seleccionar desde tu ordenador
                </button>
            </div>
        </div>
    );
}
