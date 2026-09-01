import { MoreVertical, Archive, ArchiveRestore, Trash2, Pencil, Undo2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { NoteStatus } from '@/lib/types'

interface NoteActionsMenuProps {
  status: NoteStatus
  onEdit?: () => void
  onArchive?: () => void
  onRestore?: () => void
  onTrash?: () => void
  onDeleteForever?: () => void
  className?: string
}

export function NoteActionsMenu({
  status,
  onEdit,
  onArchive,
  onRestore,
  onTrash,
  onDeleteForever,
  className,
}: NoteActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="iconSm"
          aria-label="Note actions"
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {status === 'active' && (
          <>
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onArchive}>
              <Archive className="h-4 w-4" /> Archive
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onTrash}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
        {status === 'archived' && (
          <>
            <DropdownMenuItem onSelect={onEdit}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onRestore}>
              <ArchiveRestore className="h-4 w-4" /> Restore
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onTrash}>
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </>
        )}
        {status === 'trashed' && (
          <>
            <DropdownMenuItem onSelect={onRestore}>
              <Undo2 className="h-4 w-4" /> Restore
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDeleteForever}>
              <Trash2 className="h-4 w-4" /> Delete permanently
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
