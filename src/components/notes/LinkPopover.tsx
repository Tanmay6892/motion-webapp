import * as React from 'react'
import { Popover, PopoverContent, PopoverAnchor } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { normalizeUrl } from '@/lib/url'

interface LinkPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialText: string
  onSubmit: (text: string, url: string) => void
  anchor: React.ReactNode
}

export function LinkPopover({
  open,
  onOpenChange,
  initialText,
  onSubmit,
  anchor,
}: LinkPopoverProps) {
  const [text, setText] = React.useState(initialText)
  const [url, setUrl] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const urlInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setText(initialText)
      setUrl('')
      setError(null)
      requestAnimationFrame(() => urlInputRef.current?.focus())
    }
  }, [open, initialText])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeUrl(url)
    if (!normalized) {
      setError('Enter a valid URL, like example.com')
      return
    }
    onSubmit(text, normalized)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{anchor}</PopoverAnchor>
      <PopoverContent className="w-80" onOpenAutoFocus={(e) => e.preventDefault()}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-text" className="text-xs font-medium text-muted">
              Text
            </label>
            <Input
              id="link-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Link text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="link-url" className="text-xs font-medium text-muted">
              URL
            </label>
            <Input
              id="link-url"
              ref={urlInputRef}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              placeholder="https://example.com"
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <div className="mt-1 flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add link
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  )
}
