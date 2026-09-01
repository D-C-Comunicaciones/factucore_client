import { ApiResponse } from "@/types/api";
import { apiClient } from "./api-client";

export interface ImportRow {
    nivel: number | null;
    codigo: string;
    nombre: string;
    elemento: string;
    naturaleza: "debito" | "credito";
    uso_cuenta: string;
    tipo_cuenta: "movimiento" | "mayor";
    ver_saldos_por_terceros: boolean;
}

export interface ImportWarning {
    message: string;
    column: string | null;
    /** 0-indexed positions into the parsed `rows` array that this warning flags. */
    rows: number[];
}

export interface ExistingAccountBalance {
    id: number;
    code: string;
    name: string;
    balance: number;
    has_movements: boolean;
}

export interface BalanceTransfer {
    old_account_id: number;
    new_code: string;
}

export interface UsageDefault {
    usage_code: string;
    new_code: string;
}

export const accountImportApi = {
    parse: async (file: File): Promise<ApiResponse<{ rows: ImportRow[]; warnings: ImportWarning[] }>> => {
        const formData = new FormData();
        formData.append("file", file);
        return apiClient.post<{ rows: ImportRow[]; warnings: ImportWarning[] }>("/catalogs/accounts/import/parse", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
    movements: async (): Promise<ApiResponse<{ accounts: ExistingAccountBalance[] }>> => {
        return apiClient.get<{ accounts: ExistingAccountBalance[] }>("/catalogs/accounts/import/movements");
    },
    execute: async (payload: {
        rows: ImportRow[];
        balance_transfers: BalanceTransfer[];
        usage_defaults: UsageDefault[];
    }): Promise<ApiResponse<{ imported: number }>> => {
        return apiClient.post<{ imported: number }>("/catalogs/accounts/import/execute", payload);
    },
};
