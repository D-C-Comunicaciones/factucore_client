// Shared error-formatting helpers for the auth/profile feature (Laravel-style
// {message, errors: {field: [msg]}} error bodies).

export function extractErrorMessage(error: any): string {
    if (error?.response?.status === 429) {
        return "Demasiados intentos, espera un momento."
    }

    const data = error?.response?.data

    if (data?.errors) {
        let parsedErrors = data.errors
        if (typeof parsedErrors === "string") {
            try { parsedErrors = JSON.parse(parsedErrors) }
            catch { parsedErrors = null }
        }
        if (parsedErrors && typeof parsedErrors === "object") {
            const values = Object.values(parsedErrors).flat()
            if (values.length > 0) {
                return values.join("\n")
            }
        }
    }

    if (data?.message) return data.message
    if (error?.message) return error.message
    if (typeof error === "string") return error

    return "Ocurrió un error. Inténtalo de nuevo."
}

export function extractFieldErrors(error: any): Record<string, string> {
    const errors = error?.response?.data?.errors
    if (!errors || typeof errors !== "object") return {}

    return Object.fromEntries(
        Object.entries(errors).map(([field, messages]) => [
            field,
            Array.isArray(messages) ? String(messages[0]) : String(messages),
        ])
    )
}
