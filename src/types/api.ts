export interface ApiResponse<T = unknown> {
    message: string
    status: "success" | "error"
    code: number
    data: T
}

export interface PaginatedData<T> {
    data: T[]
    total: number
    per_page: number
    current_page: number
    last_page: number
    message?: string
}
