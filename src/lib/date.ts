import { format, isSameYear } from 'date-fns'

export function formatNoteDate(timestamp: number): string {
  const date = new Date(timestamp)
  return isSameYear(date, new Date()) ? format(date, 'MMM d') : format(date, 'MMM d, yyyy')
}
