import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage, STORAGE_KEYS } from '@/lib/storage'
import { buildSampleNotes } from '@/lib/sampleData'
import type { Note } from '@/lib/types'
import { uid } from '@/lib/utils'

export interface NewNoteInput {
  title: string
  content: string
  image: string | null
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() =>
    readStorage<Note[] | null>(STORAGE_KEYS.notes, null) ?? buildSampleNotes(),
  )

  useEffect(() => {
    writeStorage(STORAGE_KEYS.notes, notes)
  }, [notes])

  const createNote = useCallback((input: NewNoteInput): Note => {
    let created!: Note
    setNotes((prev) => {
      const minOrder = prev.reduce((min, n) => Math.min(min, n.order), 0)
      const now = Date.now()
      created = {
        id: uid(),
        title: input.title.trim(),
        content: input.content,
        image: input.image,
        status: 'active',
        order: minOrder - 1,
        createdAt: now,
        updatedAt: now,
      }
      return [created, ...prev]
    })
    return created
  }, [])

  const updateNote = useCallback(
    (id: string, patch: Partial<Pick<Note, 'title' | 'content' | 'image'>>) => {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
        ),
      )
    },
    [],
  )

  const setStatus = useCallback((id: string, status: Note['status']) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status, updatedAt: Date.now() } : n,
      ),
    )
  }, [])

  const deleteForever = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const emptyTrash = useCallback(() => {
    setNotes((prev) => prev.filter((n) => n.status !== 'trashed'))
  }, [])

  const reorder = useCallback((idsInNewOrder: string[]) => {
    setNotes((prev) => {
      const orderMap = new Map(idsInNewOrder.map((id, i) => [id, i]))
      return prev.map((n) =>
        orderMap.has(n.id) ? { ...n, order: orderMap.get(n.id)! } : n,
      )
    })
  }, [])

  return {
    notes,
    createNote,
    updateNote,
    setStatus,
    deleteForever,
    emptyTrash,
    reorder,
  }
}
