// hooks/usePatients.ts
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as patientsService from "@/lib/patientsService"

export function usePatients() {
  const queryClient = useQueryClient()

  // Fetch all patients
  const patientsQuery = useQuery(["patients"], patientsService.fetchPatients)

  // Add a new patient
  const createPatient = useMutation(patientsService.createPatient, {
    onSuccess: () => queryClient.invalidateQueries(["patients"]),
  })

  // Update a patient
  const updatePatient = useMutation(
    ({ id, data }: { id: number; data: any }) => patientsService.updatePatient(id, data),
    { onSuccess: () => queryClient.invalidateQueries(["patients"]) }
  )

  // Delete a patient
  const deletePatient = useMutation((id: number) => patientsService.deletePatient(id), {
    onSuccess: () => queryClient.invalidateQueries(["patients"]),
  })

  return { patientsQuery, createPatient, updatePatient, deletePatient }
}