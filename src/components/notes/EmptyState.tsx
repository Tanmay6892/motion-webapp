import * as React from 'react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover text-faint">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-text">{title}</p>
        {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button className="mt-2" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
