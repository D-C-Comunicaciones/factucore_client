import { apiClient } from "@/lib/api-client";

export interface DateRangeExportResult {
    downloaded: boolean;
    message?: string;
}

const DEFAULT_NOT_FOUND_MESSAGE = "No se encontraron registros que exportar para el rango de fechas seleccionado.";

async function extractJsonMessage(blob: Blob): Promise<string> {
    try {
        const text = await blob.text();
        const parsed = JSON.parse(text);
        return parsed?.message || DEFAULT_NOT_FOUND_MESSAGE;
    } catch {
        return DEFAULT_NOT_FOUND_MESSAGE;
    }
}

function extractFilenameFromContentDisposition(contentDisposition?: string | null): string | null {
    if (!contentDisposition) return null;

    const utf8Match = contentDisposition.match(/filename\*=(?:UTF-8'')?["']?([^"';]+)["']?/i);
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1]);
        } catch {
            return utf8Match[1];
        }
    }

    const plainMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
    return plainMatch?.[1] || null;
}

/**
 * POSTea un rango { from, to } a un endpoint de exportación que responde con un JSON
 * (sin registros para el rango) o con el binario de un archivo Excel. Si es el binario,
 * dispara la descarga inmediatamente usando el nombre de archivo recibido en el header
 * Content-Disposition de la respuesta.
 */
export async function exportByDateRange(
    endpoint: string,
    from: string,
    to: string,
    fallbackFilename: string
): Promise<DateRangeExportResult> {
    const response = await apiClient.postBlobFull(endpoint, { from, to });
    const blob = response.data;

    if (blob.type && blob.type.toLowerCase().includes("json")) {
        return { downloaded: false, message: await extractJsonMessage(blob) };
    }

    const filename = extractFilenameFromContentDisposition(response.headers?.["content-disposition"]) || fallbackFilename;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { downloaded: true };
}
