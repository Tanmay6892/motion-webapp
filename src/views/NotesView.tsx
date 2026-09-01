import * as React from 'react'
import { NotebookText } from 'lucide-react'
import { NotesToolbar } from '@/components/notes/NotesToolbar'
import { NoteComposer } from '@/components/notes/NoteComposer'
import { NoteBoard } from '@/components/notes/NoteBoard'
import { EmptyState } from '@/components/notes/EmptyState'
import { filterByStatus, searchNotes, sortNotes } from '@/lib/selectors'
import type { Note, SortMode, ViewMode } from '@/lib/types'

interface NotesViewProps {
  notes: Note[]
  search: string
  onSearchChange: (v: string) => void
  sortMode: SortMode
  onSortChange: (v: SortMode) => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
  onCreate: (data: { title: string; content: string; image: string | null }) => void
  onOpen: (note: Note) => void
  onArchive: (id: string) => void
  onTrash: (id: string) => void
  onReorder: (ids: string[]) => void
}

export function NotesView({
  notes,
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewChange,
  onCreate,
  onOpen,
  onArchive,
  onTrash,
  onReorder,
}: NotesViewProps) {
  const active = React.useMemo(() => filterByStatus(notes, 'active'), [notes])
  const filtered = React.useMemo(() => searchNotes(active, search), [active, search])
  const sorted = React.useMemo(() => sortNotes(filtered, sortMode), [filtered, sortMode])

  const noop = () => {}

  return (
    <div className="flex flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <NotesToolbar
        title="Notes"
        resultCount={filtered.length}
        search={search}
        onSearchChange={onSearchChange}
        sortMode={sortMode}
        onSortChange={onSortChange}
        viewMode={viewMode}
        onViewChange={onViewChange}
      />

      {!search && <NoteComposer onCreate={onCreate} />}

      {sorted.length === 0 ? (
        search ? (
          <EmptyState
            icon={<NotebookText className="h-6 w-6" />}
            title="No notes found"
            description="Try another keyword."
          />
        ) : active.length === 0 ? (
          <EmptyState
            icon={<NotebookText className="h-6 w-6" />}
            title="Nothing here yet"
            description="Capture your first thought and keep it in motion."
          />
        ) : null
      ) : (
        <NoteBoard
          notes={sorted}
          viewMode={viewMode}
          sortMode={sortMode}
          onOpen={onOpen}
          onArchive={onArchive}
          onRestore={noop}
          onTrash={onTrash}
          onDeleteForever={noop}
          onReorder={onReorder}
        />
      )}
    </div>
  )
}
