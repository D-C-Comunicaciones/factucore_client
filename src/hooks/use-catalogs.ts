import { useState, useCallback } from "react"
import * as catalogService from "@/services/catalog.service"
import type { Country, Department, Municipality, TypeDocumentIdentification, Plan } from "@/types/catalogs"

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCountries = useCallback(async () => {
    setLoading(true)
    try {
      const data = await catalogService.getCountries()
      setCountries(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { countries, fetchCountries, loading }
}

export function useDepartments(countryId?: number) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDepartments = useCallback(async () => {
    if (!countryId) return
    setLoading(true)
    try {
      const data = await catalogService.getDepartments(countryId)
      setDepartments(data)
    } finally {
      setLoading(false)
    }
  }, [countryId])

  return { departments, fetchDepartments, loading }
}

export function useMunicipalities(departmentId?: number) {
  const [municipalities, setMunicipalities] = useState<Municipality[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMunicipalities = useCallback(async () => {
    if (!departmentId) return
    setLoading(true)
    try {
      const data = await catalogService.getMunicipalities(departmentId)
      setMunicipalities(data)
    } finally {
      setLoading(false)
    }
  }, [departmentId])

  return { municipalities, fetchMunicipalities, loading }
}

export function useTypeDocumentIdentifications() {
  const [types, setTypes] = useState<TypeDocumentIdentification[]>([])
  const [loading, setLoading] = useState(false)

  const fetchTypes = useCallback(async () => {
    setLoading(true)
    try {
      const data = await catalogService.getTypeDocumentIdentifications()
      setTypes(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { types, fetchTypes, loading }
}

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPlans = useCallback(async () => {
    setLoading(true)
    try {
      const data = await catalogService.getPlans()
      setPlans(data)
    } finally {
      setLoading(false)
    }
  }, [])

  return { plans, fetchPlans, loading }
}
