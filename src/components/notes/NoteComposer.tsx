import * as React from 'react'
import { Plus } from 'lucide-react'
import { NoteEditorBody } from '@/components/notes/NoteEditorBody'
import { isEditorEmpty } from '@/lib/richtext'
import { cn } from '@/lib/utils'

interface NoteComposerProps {
  onCreate: (data: { title: string; content: string; image: string | null }) => void
}

const EMPTY_DRAFT = { title: '', content: '', image: null as string | null }

export function NoteComposer({ onCreate }: NoteComposerProps) {
  const [expanded, setExpanded] = React.useState(false)
  const [draft, setDraft] = React.useState(EMPTY_DRAFT)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [editorKey, setEditorKey] = React.useState(0)

  const isEmpty =
    !draft.title.trim() && isEditorEmpty(draft.content) && !draft.image

  const collapseAndSave = React.useCallback(() => {
    setExpanded(false)
    if (!isEmpty) {
      onCreate(draft)
    }
    setDraft(EMPTY_DRAFT)
    setEditorKey((k) => k + 1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft, isEmpty, onCreate])

  React.useEffect(() => {
    if (!expanded) return
    function handlePointerDown(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (containerRef.current?.contains(target)) return
      if (target.closest('[data-radix-popper-content-wrapper]')) return
      if (target.closest('[role="dialog"]')) return
      collapseAndSave()
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') collapseAndSave()
    }
    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [expanded, collapseAndSave])

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        className="flex w-full items-center justify-between rounded-xl border border-border bg-surface px-4 py-3 text-left shadow-sm shadow-black/[0.02] transition-colors duration-150 hover:border-border hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Take a note"
      >
        <span className="text-sm text-muted">Take a note...</span>
        <Plus className="h-4 w-4 text-faint" />
      </button>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full animate-scale-in rounded-xl border border-border bg-surface p-4 shadow-lg shadow-black/[0.06]',
      )}
    >
      <NoteEditorBody
        editorKey={`composer-${editorKey}`}
        titleValue={draft.title}
        onTitleChange={(title) => setDraft((d) => ({ ...d, title }))}
        initialContent={draft.content}
        onContentChange={(content) => setDraft((d) => ({ ...d, content }))}
        image={draft.image}
        onImageChange={(image) => setDraft((d) => ({ ...d, image }))}
        autoFocusContent
        contentPlaceholder="Start writing your note..."
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={collapseAndSave}
          className="rounded-md px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-surface-hover hover:text-text"
        >
          Close
        </button>
      </div>
    </div>
  )
}
