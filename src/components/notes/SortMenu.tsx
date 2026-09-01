import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SortMode } from '@/lib/types'

const LABELS: Record<SortMode, string> = {
  custom: 'Custom',
  created: 'Date created',
  modified: 'Date modified',
}

interface SortMenuProps {
  value: SortMode
  onChange: (mode: SortMode) => void
}

export function SortMenu({ value, onChange }: SortMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-md border border-border bg-input px-3 text-sm font-medium text-text transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="text-muted">Sort:</span> {LABELS[value]}
          <ChevronDown className="h-3.5 w-3.5 text-faint" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={value} onValueChange={(v) => onChange(v as SortMode)}>
          <DropdownMenuRadioItem value="custom">Custom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="created">Date created</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="modified">Date modified</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
