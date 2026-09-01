import * as React from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  rectSortingStrategy,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { NoteCard } from '@/components/notes/NoteCard'
import { NoteListRow } from '@/components/notes/NoteListRow'
import type { Note, SortMode, ViewMode } from '@/lib/types'

interface NoteBoardProps {
  notes: Note[]
  viewMode: ViewMode
  sortMode: SortMode
  onOpen: (note: Note) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onTrash: (id: string) => void
  onDeleteForever: (id: string) => void
  onReorder: (idsInNewOrder: string[]) => void
  reorderEnabled?: boolean
}

function SortableItem({
  note,
  viewMode,
  draggable,
  ...handlers
}: {
  note: Note
  viewMode: ViewMode
  draggable: boolean
  onOpen: (note: Note) => void
  onArchive: (id: string) => void
  onRestore: (id: string) => void
  onTrash: (id: string) => void
  onDeleteForever: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: note.id, disabled: !draggable })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const Comp = viewMode === 'grid' ? NoteCard : NoteListRow

  return (
    <Comp
      ref={setNodeRef}
      style={style}
      note={note}
      isDragging={isDragging}
      showDragHandle={draggable}
      dragHandleProps={{ ...attributes, ...listeners }}
      onOpen={() => handlers.onOpen(note)}
      onArchive={() => handlers.onArchive(note.id)}
      onRestore={() => handlers.onRestore(note.id)}
      onTrash={() => handlers.onTrash(note.id)}
      onDeleteForever={() => handlers.onDeleteForever(note.id)}
    />
  )
}

export function NoteBoard({
  notes,
  viewMode,
  sortMode,
  onOpen,
  onArchive,
  onRestore,
  onTrash,
  onDeleteForever,
  onReorder,
  reorderEnabled = true,
}: NoteBoardProps) {
  const [orderedIds, setOrderedIds] = React.useState(() => notes.map((n) => n.id))

  React.useEffect(() => {
    setOrderedIds(notes.map((n) => n.id))
  }, [notes])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const draggable = sortMode === 'custom' && reorderEnabled
  const byId = React.useMemo(() => new Map(notes.map((n) => [n.id, n])), [notes])
  const ordered = orderedIds.map((id) => byId.get(id)).filter((n): n is Note => !!n)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = orderedIds.indexOf(String(active.id))
    const newIndex = orderedIds.indexOf(String(over.id))
    const next = arrayMove(orderedIds, oldIndex, newIndex)
    setOrderedIds(next)
    onReorder(next)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={orderedIds}
        strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'flex flex-col gap-2'
          }
        >
          {ordered.map((note) => (
            <SortableItem
              key={note.id}
              note={note}
              viewMode={viewMode}
              draggable={draggable}
              onOpen={onOpen}
              onArchive={onArchive}
              onRestore={onRestore}
              onTrash={onTrash}
              onDeleteForever={onDeleteForever}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
