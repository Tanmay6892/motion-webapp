import * as React from 'react'
import { RichTextEditor, type RichTextEditorHandle } from '@/components/notes/RichTextEditor'
import { FormattingToolbar } from '@/components/notes/FormattingToolbar'
import { ImagePreview } from '@/components/notes/ImagePreview'

interface NoteEditorBodyProps {
  editorKey: string
  titleValue: string
  onTitleChange: (value: string) => void
  initialContent: string
  onContentChange: (html: string) => void
  image: string | null
  onImageChange: (image: string | null) => void
  autoFocusTitle?: boolean
  autoFocusContent?: boolean
  titlePlaceholder?: string
  contentPlaceholder?: string
  titleInputRef?: React.RefObject<HTMLInputElement | null>
  onTitleEnter?: () => void
}

export function NoteEditorBody({
  editorKey,
  titleValue,
  onTitleChange,
  initialContent,
  onContentChange,
  image,
  onImageChange,
  autoFocusTitle,
  autoFocusContent,
  titlePlaceholder = 'Title',
  contentPlaceholder = 'Start writing your note...',
  titleInputRef,
  onTitleEnter,
}: NoteEditorBodyProps) {
  const editorHandleRef = React.useRef<RichTextEditorHandle>(null)

  const handleAttachImage = (file: File) => {
    if (image && image.startsWith('blob:')) URL.revokeObjectURL(image)
    onImageChange(URL.createObjectURL(file))
  }

  const handleRemoveImage = () => {
    if (image && image.startsWith('blob:')) URL.revokeObjectURL(image)
    onImageChange(null)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={titleInputRef}
        value={titleValue}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder={titlePlaceholder}
        aria-label="Note title"
        autoFocus={autoFocusTitle}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            if (onTitleEnter) onTitleEnter()
            else editorHandleRef.current?.focus()
          }
        }}
        className="w-full bg-transparent text-lg font-semibold text-text placeholder:text-faint focus:outline-none"
      />

      {image && <ImagePreview src={image} onRemove={handleRemoveImage} />}

      <RichTextEditor
        key={editorKey}
        ref={editorHandleRef}
        initialHtml={initialContent}
        onChange={onContentChange}
        placeholder={contentPlaceholder}
        autoFocus={autoFocusContent}
        className="max-h-[50vh] overflow-y-auto scrollbar-thin"
      />

      <FormattingToolbar editorHandle={editorHandleRef} onAttachImage={handleAttachImage} />
    </div>
  )
}
