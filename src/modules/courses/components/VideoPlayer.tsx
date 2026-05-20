import { useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { coursesService } from '../services/courses.service'
import { toast } from '../../../shared/components/ui/Toast'
import { env } from '../../../shared/config/env'

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

  const handleMarkComplete = () => {
    if (hasReported.current) return
    hasReported.current = true
    progressMutation.mutate()
  }

  // CF Stream signed URL pattern: token THAY THẾ video uid trong path.
  // Token claims chứa sub=video_uid để CF resolve. Xem NL-LEARN-VIDEO-CF-STREAM-001.
  const subdomain = env.VITE_CF_STREAM_SUBDOMAIN
  const iframeSrc = subdomain
    ? `https://${subdomain}.cloudflarestream.com/${signedToken}/iframe`
    : null

  return (
    <div className="space-y-3">
      <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title="Video bài học"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-center text-white/70 text-sm">
            <div>
              <p>Video player chưa được cấu hình.</p>
              <p className="text-xs opacity-60 mt-1">Set VITE_CF_STREAM_SUBDOMAIN trong .env.</p>
              <p className="text-xs opacity-40 mt-2">Stream ID: {streamId}</p>
            </div>
          </div>
        )}
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
