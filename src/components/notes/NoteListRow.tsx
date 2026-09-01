import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { NoteActionsMenu } from '@/components/notes/NoteActionsMenu'
import { formatNoteDate } from '@/lib/date'
import { stripHtml } from '@/lib/selectors'
import { cn } from '@/lib/utils'
import type { Note } from '@/lib/types'

interface NoteListRowProps {
  note: Note
  onOpen: () => void
  onArchive?: () => void
  onRestore?: () => void
  onTrash?: () => void
  onDeleteForever?: () => void
  showDragHandle?: boolean
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
  isDragging?: boolean
  style?: React.CSSProperties
}

export const NoteListRow = React.forwardRef<HTMLDivElement, NoteListRowProps>(
  function NoteListRow(
    {
      note,
      onOpen,
      onArchive,
      onRestore,
      onTrash,
      onDeleteForever,
      showDragHandle,
      dragHandleProps,
      isDragging,
      style,
    },
    ref,
  ) {
    const handleContentClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) e.stopPropagation()
    }

    return (
      <div
        ref={ref}
        style={style}
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onOpen()
          }
        }}
        className={cn(
          'group flex items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-shadow duration-150 hover:shadow-sm hover:shadow-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragging && 'opacity-60 shadow-lg',
        )}
      >
        {showDragHandle && (
          <button
            type="button"
            aria-label="Drag to reorder"
            className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded-md text-faint opacity-0 transition-opacity hover:text-muted active:cursor-grabbing group-hover:opacity-100 focus-visible:opacity-100"
            onClick={(e) => e.stopPropagation()}
            {...dragHandleProps}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}

        {note.image && (
          <img
            src={note.image}
            alt=""
            className="h-11 w-11 shrink-0 rounded-md object-cover"
          />
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-text">
            {note.title || 'Untitled'}
          </h3>
          {note.content && (
            <p className="truncate text-xs text-muted" onClick={handleContentClick}>
              {stripHtml(note.content) || 'Checklist'}
            </p>
          )}
        </div>

        <span className="hidden shrink-0 text-xs text-faint sm:block">
          {formatNoteDate(note.updatedAt)}
        </span>

        <div className="shrink-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          <NoteActionsMenu
            status={note.status}
            onEdit={onOpen}
            onArchive={onArchive}
            onRestore={onRestore}
            onTrash={onTrash}
            onDeleteForever={onDeleteForever}
          />
        </div>
      </div>
    )
  },
)
