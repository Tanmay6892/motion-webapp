import * as React from 'react'
import { Trash2 } from 'lucide-react'
import { NotesToolbar } from '@/components/notes/NotesToolbar'
import { NoteBoard } from '@/components/notes/NoteBoard'
import { EmptyState } from '@/components/notes/EmptyState'
import { Button } from '@/components/ui/button'
import { filterByStatus, searchNotes, sortNotes } from '@/lib/selectors'
import type { Note, SortMode, ViewMode } from '@/lib/types'

interface TrashViewProps {
  notes: Note[]
  search: string
  onSearchChange: (v: string) => void
  sortMode: SortMode
  onSortChange: (v: SortMode) => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
  onOpen: (note: Note) => void
  onRestore: (id: string) => void
  onRequestDeleteForever: (id: string) => void
  onRequestEmptyTrash: () => void
}

export function TrashView({
  notes,
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewChange,
  onOpen,
  onRestore,
  onRequestDeleteForever,
  onRequestEmptyTrash,
}: TrashViewProps) {
  const trashed = React.useMemo(() => filterByStatus(notes, 'trashed'), [notes])
  const filtered = React.useMemo(() => searchNotes(trashed, search), [trashed, search])
  const sorted = React.useMemo(() => sortNotes(filtered, sortMode), [filtered, sortMode])

  const noop = () => {}

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <NotesToolbar
        title="Recently deleted"
        resultCount={filtered.length}
        search={search}
        onSearchChange={onSearchChange}
        sortMode={sortMode}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewChange={onViewChange}
        trailing={
          trashed.length > 0 && (
            <Button variant="outline" size="sm" onClick={onRequestEmptyTrash}>
              Empty trash
            </Button>
          )
        }
      />

      {sorted.length === 0 ? (
        search ? (
          <EmptyState
            icon={<Trash2 className="h-6 w-6" />}
            title="No notes found"
            description="Try another keyword."
          />
        ) : (
          <EmptyState icon={<Trash2 className="h-6 w-6" />} title="Trash is empty" />
        )
      ) : (
        <NoteBoard
          notes={sorted}
          viewMode={viewMode}
          sortMode={sortMode}
          onOpen={onOpen}
          onArchive={noop}
          onRestore={onRestore}
          onTrash={noop}
          onDeleteForever={onRequestDeleteForever}
          onReorder={noop}
          reorderEnabled={false}
        />
      )}
    </div>
  )
}
