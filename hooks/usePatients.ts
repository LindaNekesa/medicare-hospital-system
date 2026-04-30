// hooks/usePatients.ts
"use client"

import { useState, useEffect, useCallback } from "react"
import * as patientsService from "@/lib/patientsService"

export function usePatients() {
  const [data, setData]       = useState<any[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError]     = useState<Error | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    patientsService.fetchPatients()
      .then(d => { setData(Array.isArray(d.data ?? d) ? (d.data ?? d) : []); setLoading(false) })
      .catch(e => { setError(e); setLoading(false) })
  }, [])

  useEffect(() => { refetch() }, [refetch])

  const createPatient = async (patient: any) => {
    await patientsService.createPatient(patient)
    refetch()
  }

  const updatePatient = async (id: number, patientData: any) => {
    await patientsService.updatePatient(id, patientData)
    refetch()
  }

  const deletePatient = async (id: number) => {
    await patientsService.deletePatient(id)
    refetch()
  }

  const patientsQuery = { data, isLoading, error, refetch }

  return { patientsQuery, createPatient, updatePatient, deletePatient }
}
