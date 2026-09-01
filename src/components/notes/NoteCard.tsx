import * as React from 'react'
import { GripVertical } from 'lucide-react'
import { NoteActionsMenu } from '@/components/notes/NoteActionsMenu'
import { formatNoteDate } from '@/lib/date'
import { cn } from '@/lib/utils'
import type { Note } from '@/lib/types'

interface NoteCardProps {
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
  setNodeRef?: (node: HTMLElement | null) => void
}

export const NoteCard = React.forwardRef<HTMLDivElement, NoteCardProps>(
  function NoteCard(
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
          'group relative flex h-fit flex-col gap-2 rounded-xl border border-border bg-surface p-4 text-left transition-shadow duration-150 hover:shadow-md hover:shadow-black/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isDragging && 'opacity-60 shadow-lg',
        )}
      >
        {showDragHandle && (
          <button
            type="button"
            aria-label="Drag to reorder"
            className="absolute right-2 top-2 flex h-6 w-6 cursor-grab items-center justify-center rounded-md text-faint opacity-0 transition-opacity hover:text-muted active:cursor-grabbing group-hover:opacity-100 focus-visible:opacity-100"
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
            className="-mx-1 -mt-1 mb-1 max-h-44 w-[calc(100%+0.5rem)] rounded-lg object-cover"
          />
        )}

        {note.title && (
          <h3 className="line-clamp-2 text-[0.95rem] font-medium leading-snug text-text">
            {note.title}
          </h3>
        )}

        {note.content && (
          <div
            className="note-prose note-preview relative max-h-40 overflow-hidden text-[0.85rem] text-muted"
            onClick={handleContentClick}
            dangerouslySetInnerHTML={{ __html: note.content }}
          />
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="text-xs text-faint">{formatNoteDate(note.updatedAt)}</span>
          <div className="flex items-center opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 focus-within:opacity-100">
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
      </div>
    )
  },
)
