import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ImagePreviewProps {
  src: string
  onRemove: () => void
}

export function ImagePreview({ src, onRemove }: ImagePreviewProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-border-subtle bg-surface-hover">
      <img src={src} alt="Attached to note" className="max-h-72 w-full object-cover" />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        aria-label="Remove image"
        className="absolute right-2 top-2 h-7 w-7 bg-elevated/90 opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-150 group-hover:opacity-100 focus-visible:opacity-100"
        onClick={onRemove}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
