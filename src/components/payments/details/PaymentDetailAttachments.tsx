import React from "react";
import { Download, FileText, Image as ImageIcon } from "lucide-react";

interface Attachment {
  id: string | number;
  name: string;
  url: string;
  type: string;
}

interface PaymentDetailAttachmentsProps {
  attachments: Attachment[];
}

export function PaymentDetailAttachments({ attachments }: PaymentDetailAttachmentsProps) {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  const getIcon = (type: string) => {
    if (type.includes("image")) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    return <FileText className="w-5 h-5 text-slate-500" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-4">
      <h3 className="text-[15px] font-semibold text-slate-800 mb-4">Archivos adjuntos</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attachments.map((file) => (
          <div key={file.id} className="flex items-center p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors group">
            <div className="mr-3">
              {getIcon(file.type)}
            </div>
            <div className="flex-1 min-w-0 mr-4">
              <p className="text-sm font-medium text-slate-700 truncate" title={file.name}>
                {file.name}
              </p>
            </div>
            <a 
              href={file.url}
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
              title="Descargar"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
