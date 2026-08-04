"use client";

import { MessageSquare } from "lucide-react";

export function SaveBeforeCommentsWarning() {
    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg p-8 flex flex-col items-center justify-center text-center mt-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <p className="text-gray-500 text-sm font-medium">
                Guarda primero para poder agregar comentarios.
            </p>
        </div>
    );
}
