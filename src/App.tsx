import * as React from 'react'
import { Toaster, toast } from 'sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LoginScreen } from '@/components/auth/LoginScreen'
import { AppShell } from '@/components/layout/AppShell'
import { SettingsDialog } from '@/components/layout/SettingsDialog'
import { NoteEditorDialog } from '@/components/notes/NoteEditorDialog'
import { DeleteConfirmDialog } from '@/components/notes/DeleteConfirmDialog'
import { NotesView } from '@/views/NotesView'
import { ArchiveView } from '@/views/ArchiveView'
import { TrashView } from '@/views/TrashView'
import { useTheme } from '@/hooks/useTheme'
import { useNotes } from '@/hooks/useNotes'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import { filterByStatus } from '@/lib/selectors'
import type { AppView, Note, SortMode, User, ViewMode } from '@/lib/types'

const DEFAULT_USER: User = {
  name: 'Tanmay',
  email: 'tanmay.chouhan@infobeans.com',
  avatarUrl: null,
}

function App() {
  const { preference: theme, setPreference: setTheme, resolved } = useTheme()
  const notesApi = useNotes()

  const [authed, setAuthed] = React.useState(() => readStorage(STORAGE_KEYS.auth, false))
  const [view, setView] = React.useState<AppView>('notes')
  const [search, setSearch] = React.useState('')
  const [sortMode, setSortMode] = React.useState<SortMode>(() =>
    readStorage(STORAGE_KEYS.sortMode, 'custom' as SortMode),
  )
  const [viewMode, setViewMode] = React.useState<ViewMode>(() =>
    readStorage(STORAGE_KEYS.viewMode, 'grid' as ViewMode),
  )
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<string | null>(null)
  const [confirmEmptyTrash, setConfirmEmptyTrash] = React.useState(false)
  const [settingsOpen, setSettingsOpen] = React.useState(false)

  React.useEffect(() => writeStorage(STORAGE_KEYS.sortMode, sortMode), [sortMode])
  React.useEffect(() => writeStorage(STORAGE_KEYS.viewMode, viewMode), [viewMode])

  const handleNavigate = (next: AppView) => {
    setView(next)
    setSearch('')
  }

  const handleLogin = () => {
    setAuthed(true)
    writeStorage(STORAGE_KEYS.auth, true)
    toast.success('Welcome back')
  }

  const handleLogout = () => {
    setAuthed(false)
    writeStorage(STORAGE_KEYS.auth, false)
    setView('notes')
  }

  const handleCreate = (data: { title: string; content: string; image: string | null }) => {
    notesApi.createNote(data)
    toast.success('Note created successfully')
  }

  const handleArchive = (id: string) => {
    notesApi.setStatus(id, 'archived')
    toast('Note archived')
  }

  const handleRestore = (id: string) => {
    notesApi.setStatus(id, 'active')
    toast.success('Note restored')
  }

  const handleTrash = (id: string) => {
    notesApi.setStatus(id, 'trashed')
    if (editingId === id) setEditingId(null)
    toast('Note moved to trash')
  }

  const handleDeleteForeverConfirmed = () => {
    if (deleteTarget) {
      notesApi.deleteForever(deleteTarget)
      toast.success('Note deleted permanently')
    }
    setDeleteTarget(null)
  }

  const handleEmptyTrashConfirmed = () => {
    notesApi.emptyTrash()
    toast.success('Trash emptied')
    setConfirmEmptyTrash(false)
  }

  const editingNote: Note | null = React.useMemo(
    () => notesApi.notes.find((n) => n.id === editingId) ?? null,
    [notesApi.notes, editingId],
  )

  const counts = React.useMemo(
    () => ({
      notes: filterByStatus(notesApi.notes, 'active').length,
      archive: filterByStatus(notesApi.notes, 'archived').length,
      trash: filterByStatus(notesApi.notes, 'trashed').length,
    }),
    [notesApi.notes],
  )

  if (!authed) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster theme={resolved} position="bottom-right" richColors closeButton />
      </>
    )
  }

  return (
    <TooltipProvider delayDuration={300}>
      <AppShell
        active={view}
        onNavigate={handleNavigate}
        counts={counts}
        theme={theme}
        onThemeChange={setTheme}
        onOpenSettings={() => setSettingsOpen(true)}
        user={DEFAULT_USER}
        onLogout={handleLogout}
      >
        {view === 'notes' && (
          <NotesView
            notes={notesApi.notes}
            search={search}
            onSearchChange={setSearch}
            sortMode={sortMode}
            onSortChange={setSortMode}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onCreate={handleCreate}
            onOpen={(note) => setEditingId(note.id)}
            onArchive={handleArchive}
            onTrash={handleTrash}
            onReorder={notesApi.reorder}
          />
        )}
        {view === 'archive' && (
          <ArchiveView
            notes={notesApi.notes}
            search={search}
            onSearchChange={setSearch}
            sortMode={sortMode}
            onSortChange={setSortMode}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onOpen={(note) => setEditingId(note.id)}
            onRestore={handleRestore}
            onTrash={handleTrash}
            onReorder={notesApi.reorder}
          />
        )}
        {view === 'trash' && (
          <TrashView
            notes={notesApi.notes}
            search={search}
            onSearchChange={setSearch}
            sortMode={sortMode}
            onSortChange={setSortMode}
            viewMode={viewMode}
            onViewChange={setViewMode}
            onOpen={(note) => setEditingId(note.id)}
            onRestore={handleRestore}
            onRequestDeleteForever={setDeleteTarget}
            onRequestEmptyTrash={() => setConfirmEmptyTrash(true)}
          />
        )}
      </AppShell>

      <NoteEditorDialog
        note={editingNote}
        onOpenChange={(open) => !open && setEditingId(null)}
        onSave={(id, patch) => notesApi.updateNote(id, patch)}
      />

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        theme={theme}
        onThemeChange={setTheme}
      />

      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDeleteForeverConfirmed}
      />

      <DeleteConfirmDialog
        open={confirmEmptyTrash}
        onOpenChange={setConfirmEmptyTrash}
        onConfirm={handleEmptyTrashConfirmed}
        title="Empty trash?"
        description="All notes in trash will be permanently deleted. This action cannot be undone."
        confirmLabel="Empty trash"
      />

      <Toaster theme={resolved} position="bottom-right" richColors closeButton />
    </TooltipProvider>
  )
}

export default App
