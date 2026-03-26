"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import * as settingsService from "@/lib/settingsService"

export function useSettings(){

  const queryClient = useQueryClient()

  const settingsQuery = useQuery({

    queryKey:["settings"],

    queryFn:settingsService.fetchSettings

  })

  const updateSettings = useMutation({

    mutationFn:settingsService.updateSettings,

    onSuccess:()=>queryClient.invalidateQueries(["settings"])

  })

  return {

    settingsQuery,

    updateSettings

  }

}