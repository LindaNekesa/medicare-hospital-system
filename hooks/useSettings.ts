"use client"

import { useState, useEffect, useCallback } from "react"
import * as settingsService from "@/lib/settingsService"

export function useSettings() {
  const [data, setData]         = useState<any>(null)
  const [isLoading, setLoading] = useState(true)
  const [error, setError]       = useState<Error | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    settingsService.fetchSettings()
      .then(d => { setData(d); setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const settingsQuery = { data, isLoading, error, refetch }

  const updateSettings = {
    mutate: async (formData: any) => {
      await settingsService.updateSettings(formData)
      refetch()
    },
    mutateAsync: async (formData: any) => {
      const result = await settingsService.updateSettings(formData)
      refetch()
      return result
    },
  }

  return { settingsQuery, updateSettings }
}
