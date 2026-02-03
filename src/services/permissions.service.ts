import { apiClient } from "@/lib/api-client"

export class PermissionsService {
    private readonly basePath = "/permissions"

    async getAll() {
        const response = await apiClient.get<any>(this.basePath)
        return response.data.data.permissions
    }
}

export const permissionsService = new PermissionsService()
