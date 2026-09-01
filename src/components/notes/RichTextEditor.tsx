import * as React from 'react'
import { cn } from '@/lib/utils'
import { buildChecklistItemHtml, escapeHtml, sanitizeHtml } from '@/lib/richtext'

export type InlineCommand =
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strikeThrough'
  | 'insertUnorderedList'
  | 'insertOrderedList'

export interface RichTextEditorHandle {
  exec: (command: InlineCommand) => void
  insertChecklistItem: () => void
  captureSelection: () => { text: string } | null
  applyLink: (text: string, url: string) => void
  focus: () => void
  getHtml: () => string
}

interface RichTextEditorProps {
  initialHtml: string
  placeholder?: string
  className?: string
  onChange: (html: string) => void
  onCheckToggle?: () => void
  autoFocus?: boolean
}

export const RichTextEditor = React.forwardRef<
  RichTextEditorHandle,
  RichTextEditorProps
>(({ initialHtml, placeholder, className, onChange, onCheckToggle, autoFocus }, ref) => {
  const editorRef = React.useRef<HTMLDivElement>(null)
  const savedRangeRef = React.useRef<Range | null>(null)

  React.useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = initialHtml
    }
    // Only sync on mount — this is an uncontrolled editor keyed by note id.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (autoFocus && editorRef.current) {
      editorRef.current.focus()
      const range = document.createRange()
      range.selectNodeContents(editorRef.current)
      range.collapse(false)
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [autoFocus])

  const emitChange = React.useCallback(() => {
    if (editorRef.current) {
      onChange(sanitizeHtml(editorRef.current.innerHTML))
    }
  }, [onChange])

  const saveCurrentRange = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange()
    }
  }

  const restoreSelection = () => {
    editorRef.current?.focus()
    const sel = window.getSelection()
    if (sel && savedRangeRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedRangeRef.current)
    }
  }

  React.useImperativeHandle(ref, () => ({
    exec(command) {
      editorRef.current?.focus()
      document.execCommand(command)
      emitChange()
    },
    insertChecklistItem() {
      editorRef.current?.focus()
      document.execCommand('insertHTML', false, buildChecklistItemHtml())
      emitChange()
    },
    captureSelection() {
      saveCurrentRange()
      const sel = window.getSelection()
      const text = sel && !sel.isCollapsed ? sel.toString() : ''
      return { text }
    },
    applyLink(text, url) {
      restoreSelection()
      const label = text.trim() || url
      const html = `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
        label,
      )}</a>&nbsp;`
      document.execCommand('insertHTML', false, html)
      emitChange()
    },
    focus() {
      editorRef.current?.focus()
    },
    getHtml() {
      return editorRef.current ? sanitizeHtml(editorRef.current.innerHTML) : ''
    },
  }))

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.target as HTMLElement
    const checkbox = target.closest('input[type="checkbox"]') as HTMLInputElement | null
    if (checkbox && editorRef.current?.contains(checkbox)) {
      e.preventDefault()
      checkbox.checked = !checkbox.checked
      const row = checkbox.closest('.motion-check-item') as HTMLElement | null
      if (row) row.setAttribute('data-checked', String(checkbox.checked))
      emitChange()
      onCheckToggle?.()
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === 'Enter') {
      const sel = window.getSelection()
      const anchor = sel?.anchorNode
      const row =
        anchor instanceof HTMLElement
          ? anchor.closest('.motion-check-item')
          : anchor?.parentElement?.closest('.motion-check-item')
      if (row) {
        e.preventDefault()
        document.execCommand('insertHTML', false, buildChecklistItemHtml(''))
        emitChange()
      }
    }
  }

  return (
    <div
      ref={editorRef}
      className={cn(
        'note-editable note-prose min-h-24 w-full resize-none outline-none',
        className,
      )}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Note content"
      data-placeholder={placeholder}
      onInput={emitChange}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      onBlur={emitChange}
    />
  )
})
RichTextEditor.displayName = 'RichTextEditor'
