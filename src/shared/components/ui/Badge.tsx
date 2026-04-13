import type { ReactNode } from 'react'

type BadgeVariant = 'retreat' | 'cohort' | 'on-demand' | 'coaching' | 'urgent' | 'match' | 'default'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  retreat: 'bg-purple-100 text-retreat',
  cohort: 'bg-blue-100 text-cohort',
  'on-demand': 'bg-green-100 text-on-demand',
  coaching: 'bg-yellow-100 text-coaching',
  urgent: 'bg-red-100 text-brand-red',
  match: 'bg-purple-100 text-brand-purple',
  default: 'bg-gray-100 text-gray-600',
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}
