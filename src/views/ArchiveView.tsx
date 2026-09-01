import * as React from 'react'
import { Archive } from 'lucide-react'
import { NotesToolbar } from '@/components/notes/NotesToolbar'
import { NoteBoard } from '@/components/notes/NoteBoard'
import { EmptyState } from '@/components/notes/EmptyState'
import { filterByStatus, searchNotes, sortNotes } from '@/lib/selectors'
import type { Note, SortMode, ViewMode } from '@/lib/types'

interface ArchiveViewProps {
  notes: Note[]
  search: string
  onSearchChange: (v: string) => void
  sortMode: SortMode
  onSortChange: (v: SortMode) => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
  onOpen: (note: Note) => void
  onRestore: (id: string) => void
  onTrash: (id: string) => void
  onReorder: (ids: string[]) => void
}

export function ArchiveView({
  notes,
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewChange,
  onOpen,
  onRestore,
  onTrash,
  onReorder,
}: ArchiveViewProps) {
  const archived = React.useMemo(() => filterByStatus(notes, 'archived'), [notes])
  const filtered = React.useMemo(() => searchNotes(archived, search), [archived, search])
  const sorted = React.useMemo(() => sortNotes(filtered, sortMode), [filtered, sortMode])

  const noop = () => {}

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <NotesToolbar
        title="Archived notes"
        resultCount={filtered.length}
        search={search}
        onSearchChange={onSearchChange}
        sortMode={sortMode}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewChange={onViewChange}
      />

      {sorted.length === 0 ? (
        search ? (
          <EmptyState
            icon={<Archive className="h-6 w-6" />}
            title="No notes found"
            description="Try another keyword."
          />
        ) : (
          <EmptyState icon={<Archive className="h-6 w-6" />} title="Your archive is empty" />
        )
      ) : (
        <NoteBoard
          notes={sorted}
          viewMode={viewMode}
          sortMode={sortMode}
          onOpen={onOpen}
          onArchive={noop}
          onRestore={onRestore}
          onTrash={onTrash}
          onDeleteForever={noop}
          onReorder={onReorder}
          reorderEnabled={false}
        />
      )}
    </div>
  )
}
