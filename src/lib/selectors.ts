import type { Note, NoteStatus, SortMode } from './types'

export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function filterByStatus(notes: Note[], status: NoteStatus): Note[] {
  return notes.filter((n) => n.status === status)
}

export function searchNotes(notes: Note[], query: string): Note[] {
  const q = query.trim().toLowerCase()
  if (!q) return notes
  return notes.filter((n) => {
    const haystack = `${n.title} ${stripHtml(n.content)}`.toLowerCase()
    return haystack.includes(q)
  })
}

export function sortNotes(notes: Note[], mode: SortMode): Note[] {
  const copy = [...notes]
  switch (mode) {
    case 'created':
      return copy.sort((a, b) => b.createdAt - a.createdAt)
    case 'modified':
      return copy.sort((a, b) => b.updatedAt - a.updatedAt)
    case 'custom':
    default:
      return copy.sort((a, b) => a.order - b.order)
  }
}
