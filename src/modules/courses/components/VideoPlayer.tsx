import { useRef, useCallback } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService } from '../services/courses.service'
import { toast } from '../../../shared/components/ui/Toast'

interface VideoPlayerProps {
  streamId: string
  signedToken: string
  lessonId: string
}

export function VideoPlayer({ streamId, signedToken, lessonId }: VideoPlayerProps) {
  const hasReported = useRef(false)
  const queryClient = useQueryClient()

  const progressMutation = useMutation({
    mutationFn: () => coursesService.postLessonProgress(lessonId, 80),
    onSuccess: (data) => {
      if (data.is_completed) {
        toast('Đã hoàn thành bài học!', 'success')
        queryClient.invalidateQueries({ queryKey: ['course'] })
        queryClient.invalidateQueries({ queryKey: ['home'] })
      }
    },
  })

  const handleTimeUpdate = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
    // In real implementation, this would use Stream Player API
    // For now, we simulate with a click-to-complete button
    void e
  }, [])

  const handleMarkComplete = () => {
    if (hasReported.current) return
    hasReported.current = true
    progressMutation.mutate()
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        {/* Cloudflare Stream embed - in production uses signed token */}
        <iframe
          src={`https://customer-placeholder.cloudflarestream.com/${streamId}/iframe?token=${signedToken}&poster=https://placehold.co/640x360/1a1a2e/c8a951?text=Video`}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          onLoad={handleTimeUpdate}
          title="Video bài học"
        />
        {/* Mock overlay for development */}
        <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/80">
          <div className="text-center text-white">
            <p className="text-sm opacity-60 mb-2">Mock Video Player</p>
            <p className="text-xs opacity-40 mb-3">Stream ID: {streamId}</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleMarkComplete}
        disabled={progressMutation.isPending || hasReported.current}
        className="w-full py-2 bg-brand-green text-white text-sm font-medium rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors"
      >
        {progressMutation.isPending ? 'Đang xử lý...' : hasReported.current ? '✓ Đã hoàn thành' : 'Đánh dấu đã xem (≥80%)'}
      </button>
    </div>
  )
}
