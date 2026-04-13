import { useQuery } from '@tanstack/react-query'
import { coursesService } from '../services/courses.service'

export function useEnrollments() {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: coursesService.getEnrollments,
  })
}
