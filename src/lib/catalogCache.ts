import type { ApiResponse } from "@/types/api";

const CATALOG_CACHE_PREFIX = "facturacion-catalog";

const canUseStorage = () => typeof window !== "undefined";

const getStorageKey = (key: string) => `${CATALOG_CACHE_PREFIX}:${key}`;

export const readCatalogCache = <T>(key: string): ApiResponse<T> | null => {
    if (!canUseStorage()) return null;

    try {
        const raw = window.localStorage.getItem(getStorageKey(key));
        if (!raw) return null;

        return JSON.parse(raw) as ApiResponse<T>;
    } catch {
        return null;
    }
};

export const writeCatalogCache = <T>(key: string, value: ApiResponse<T>) => {
    if (!canUseStorage()) return;

    try {
        window.localStorage.setItem(getStorageKey(key), JSON.stringify(value));
    } catch {
        // ignore storage failures
    }
};
