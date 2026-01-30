import { apiClient } from "@/lib/api-client"
import { ApiResponse } from "@/types/api"
import { Country, Department, Municipality, Plan, TypeDocumentIdentification } from "@/types/catalogs"

export const getCountries = async (): Promise<Country[]> => {
  const response = await apiClient.get<any>("/catalogs/countries")
  // Si la respuesta es un objeto Response, parsea el JSON
  const data = response?.data?.data ?? response?.data ?? response
  const arr = data?.countries
  if (!Array.isArray(arr)) {
    throw new Error("Respuesta inválida de la API al obtener países")
  }
  return arr
}

export const getDepartments = async (countryId: string | number): Promise<Department[]> => {
  if (!countryId) return []
  const response = await apiClient.get<any>(`/catalogs/departments/${countryId}`)
  const data = response?.data?.data ?? response?.data ?? response
  const arr = data?.departments
  if (!Array.isArray(arr)) {
    throw new Error("Respuesta inválida de la API al obtener departamentos")
  }
  return arr
}

export const getMunicipalities = async (departmentId: string | number): Promise<Municipality[]> => {
  if (!departmentId) return []
  const response = await apiClient.get<any>(`/catalogs/municipalities/${departmentId}`)
  const data = response?.data?.data ?? response?.data ?? response
  const arr = data?.municipalities
  if (!Array.isArray(arr)) {
    throw new Error("Respuesta inválida de la API al obtener municipios")
  }
  return arr
}

export const getTypeDocumentIdentifications = async (): Promise<TypeDocumentIdentification[]> => {
  const response = await apiClient.get<any>("/catalogs/type-document-identifications")
  const data = response?.data?.data ?? response?.data ?? response
  const arr = data?.type_document_identifications
  if (!Array.isArray(arr)) {
    throw new Error("Respuesta inválida de la API al obtener tipos de documento de identificación")
  }
  return arr
}

export const getPlans = async (): Promise<Plan[]> => {
  const response = await apiClient.get<any>("/catalogs/plans")
  const data = response?.data?.data ?? response?.data ?? response
  const arr = data?.plans
  if (!Array.isArray(arr)) {
    throw new Error("Respuesta inválida de la API al obtener planes")
  }
  return arr
}
