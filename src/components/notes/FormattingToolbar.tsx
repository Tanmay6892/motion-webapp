import * as React from 'react'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  ImagePlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LinkPopover } from '@/components/notes/LinkPopover'
import type { RichTextEditorHandle } from '@/components/notes/RichTextEditor'
import { cn } from '@/lib/utils'

interface FormattingToolbarProps {
  editorHandle: React.RefObject<RichTextEditorHandle | null>
  onAttachImage: (file: File) => void
  className?: string
}

const toolButtonClass =
  'h-8 w-8 rounded-md text-muted hover:bg-surface-hover hover:text-text'

export function FormattingToolbar({
  editorHandle,
  onAttachImage,
  className,
}: FormattingToolbarProps) {
  const [linkOpen, setLinkOpen] = React.useState(false)
  const [linkInitialText, setLinkInitialText] = React.useState('')
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const runCommand = (
    e: React.MouseEvent,
    fn: (handle: RichTextEditorHandle) => void,
  ) => {
    e.preventDefault()
    if (editorHandle.current) fn(editorHandle.current)
  }

  const openLinkPopover = (e: React.MouseEvent) => {
    e.preventDefault()
    const selection = editorHandle.current?.captureSelection()
    setLinkInitialText(selection?.text ?? '')
    setLinkOpen(true)
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-t border-border-subtle pt-2',
        className,
      )}
      role="toolbar"
      aria-label="Formatting"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bold"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('bold'))}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Italic"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('italic'))}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Underline"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('underline'))}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Strikethrough"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('strikeThrough'))}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border-subtle" />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Bulleted list"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('insertUnorderedList'))}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Numbered list"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.exec('insertOrderedList'))}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Checklist"
        className={toolButtonClass}
        onMouseDown={(e) => runCommand(e, (h) => h.insertChecklistItem())}
      >
        <CheckSquare className="h-4 w-4" />
      </Button>

      <div className="mx-1 h-5 w-px bg-border-subtle" />

      <LinkPopover
        open={linkOpen}
        onOpenChange={setLinkOpen}
        initialText={linkInitialText}
        onSubmit={(text, url) => editorHandle.current?.applyLink(text, url)}
        anchor={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Add link"
            className={toolButtonClass}
            onMouseDown={openLinkPopover}
          >
            <Link2 className="h-4 w-4" />
          </Button>
        }
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Attach image"
        className={toolButtonClass}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImagePlus className="h-4 w-4" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onAttachImage(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
