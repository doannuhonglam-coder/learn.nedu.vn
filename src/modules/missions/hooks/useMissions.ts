import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { missionsService } from '../services/missions.service'

export function useMissions() {
  return useQuery({
    queryKey: ['missions'],
    queryFn: missionsService.listMissions,
  })
}

export function useMission(id: string | null) {
  return useQuery({
    queryKey: ['missions', id],
    queryFn: () => missionsService.getMission(id!),
    enabled: !!id,
  })
}

export function useSubmitMission(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { content?: string; file_url?: string }) =>
      missionsService.submitMission(id, payload),
    onSuccess: () => {
      // Invalidate cả list lẫn detail — status sẽ flip sang 'submitted'.
      void qc.invalidateQueries({ queryKey: ['missions'] })
      void qc.invalidateQueries({ queryKey: ['missions', id] })
    },
  })
}
