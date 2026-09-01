import * as React from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { NoteEditorBody } from '@/components/notes/NoteEditorBody'
import { formatNoteDate } from '@/lib/date'
import type { Note } from '@/lib/types'

interface Draft {
  title: string
  content: string
  image: string | null
}

interface NoteEditorDialogProps {
  note: Note | null
  onOpenChange: (open: boolean) => void
  onSave: (id: string, patch: Draft) => void
}

type SaveStatus = 'idle' | 'saving' | 'saved'

export function NoteEditorDialog({ note, onOpenChange, onSave }: NoteEditorDialogProps) {
  const [draft, setDraft] = React.useState<Draft | null>(null)
  const [status, setStatus] = React.useState<SaveStatus>('idle')
  const skipNextRef = React.useRef(false)
  const saveTimeoutRef = React.useRef<number | undefined>(undefined)
  const idleTimeoutRef = React.useRef<number | undefined>(undefined)
  const noteIdRef = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (note) {
      setDraft({ title: note.title, content: note.content, image: note.image })
      noteIdRef.current = note.id
      skipNextRef.current = true
      setStatus('idle')
    }
  }, [note])

  React.useEffect(() => {
    if (!draft || !noteIdRef.current) return
    if (skipNextRef.current) {
      skipNextRef.current = false
      return
    }
    setStatus('saving')
    window.clearTimeout(saveTimeoutRef.current)
    window.clearTimeout(idleTimeoutRef.current)
    const id = noteIdRef.current
    saveTimeoutRef.current = window.setTimeout(() => {
      onSave(id, draft)
      setStatus('saved')
      toast.success('Changes saved')
      idleTimeoutRef.current = window.setTimeout(() => setStatus('idle'), 1600)
    }, 500)
    return () => window.clearTimeout(saveTimeoutRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft])

  const handleOpenChange = (open: boolean) => {
    if (!open && draft && noteIdRef.current) {
      window.clearTimeout(saveTimeoutRef.current)
      onSave(noteIdRef.current, draft)
    }
    onOpenChange(open)
  }

  const statusLabel =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : note ? `Edited ${formatNoteDate(note.updatedAt)}` : ''

  return (
    <Dialog open={!!note} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-2xl p-6"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogTitle className="sr-only">Edit note</DialogTitle>
        {note && draft && (
          <NoteEditorBody
            editorKey={`edit-${note.id}`}
            titleValue={draft.title}
            onTitleChange={(title) => setDraft((d) => (d ? { ...d, title } : d))}
            initialContent={draft.content}
            onContentChange={(content) => setDraft((d) => (d ? { ...d, content } : d))}
            image={draft.image}
            onImageChange={(image) => setDraft((d) => (d ? { ...d, image } : d))}
            titlePlaceholder="Title"
          />
        )}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-faint" aria-live="polite">
            {statusLabel}
          </span>
          <Button variant="secondary" size="sm" onClick={() => handleOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
