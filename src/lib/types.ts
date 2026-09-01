export type NoteStatus = 'active' | 'archived' | 'trashed'

export type SortMode = 'custom' | 'created' | 'modified'

export type ViewMode = 'grid' | 'list'

export type AppView = 'notes' | 'archive' | 'trash'

export interface Note {
  id: string
  title: string
  /** Sanitized HTML content produced by the rich text editor. */
  content: string
  image: string | null
  status: NoteStatus
  order: number
  createdAt: number
  updatedAt: number
}

export type ThemePreference = 'light' | 'dark' | 'system'

export interface User {
  name: string
  email: string
  avatarUrl: string | null
}
