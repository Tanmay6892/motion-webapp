import { SearchBar } from '@/components/notes/SearchBar'
import { SortMenu } from '@/components/notes/SortMenu'
import { ViewToggle } from '@/components/notes/ViewToggle'
import type { SortMode, ViewMode } from '@/lib/types'

interface NotesToolbarProps {
  title: string
  resultCount?: number
  search: string
  onSearchChange: (v: string) => void
  sortMode: SortMode
  onSortChange: (v: SortMode) => void
  viewMode: ViewMode
  onViewChange: (v: ViewMode) => void
  trailing?: React.ReactNode
}

export function NotesToolbar({
  title,
  resultCount,
  search,
  onSearchChange,
  sortMode,
  onSortChange,
  viewMode,
  onViewChange,
  trailing,
}: NotesToolbarProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-baseline gap-2.5">
        <h1 className="text-2xl font-semibold tracking-tight text-text">{title}</h1>
        {typeof resultCount === 'number' && search && (
          <span className="text-sm text-muted">
            {resultCount} {resultCount === 1 ? 'note' : 'notes'}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SearchBar value={search} onChange={onSearchChange} className="min-w-[180px] flex-1" />
        <div className="flex flex-wrap items-center gap-2">
          <SortMenu value={sortMode} onChange={onSortChange} />
          <ViewToggle value={viewMode} onChange={onViewChange} />
          {trailing}
        </div>
      </div>
    </div>
  )
}
