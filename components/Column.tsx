import { useState, Dispatch, SetStateAction, DragEvent } from 'react'
import { usePathname } from 'next/navigation'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import Card from './Card'
import DropIndicator from './DropIndicator'
import AddCard from './AddCard'
import { Task } from '@/types/types'


type ColumnType = "backlog" | "todo" | "doing" | "done"

interface ColumnProps {
  title: string
  headingColor: string
  cards: Task[]
  column: ColumnType
  setCards: Dispatch<SetStateAction<Task[]>>
}

export default function Column({ title, headingColor, cards, column, setCards }: ColumnProps) {
  const [active, setActive] = useState(false)
  const path = usePathname()

  const handleDragStart = (e: DragEvent, task: Task) => {
    e.dataTransfer.setData("cardId", task.id)
  }

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId")
    setActive(false)
    clearHighlights()

    const indicators = getIndicators()
    const { element } = getNearestIndicator(e, indicators)

    const before = element.dataset.before || "-1"

    if (before !== cardId) {
      let copy = [...cards]

      let cardToTransfer = copy.find((c) => c.id === cardId)
      if (!cardToTransfer) return
      cardToTransfer = { ...cardToTransfer, column }

      copy = copy.filter((c) => c.id !== cardId)

      const moveToBack = before === "-1"

      if (moveToBack) {
        copy.push(cardToTransfer)
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before)
        if (insertAtIndex === undefined) return

        copy.splice(insertAtIndex, 0, cardToTransfer)
      }
      const segments = path.split("/")
      const document_id = segments[segments.length - 1]
      try {
        const cardRef = doc(db, "documents", document_id, "tasks", cardId)

        await updateDoc(cardRef, {
          column: column,
        })
      } catch (error) {
        console.error("Error updating card: ", error)
      }

      setCards(copy)
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    highlightIndicator(e)
    setActive(true)
  }

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators()
    indicators.forEach((i) => {
      i.style.opacity = "0"
    })
  }

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators()
    clearHighlights(indicators)
    const el = getNearestIndicator(e, indicators)
    el.element.style.opacity = "1"
  }

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50
    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = e.clientY - (box.top + DISTANCE_OFFSET)
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child }
        } else {
          return closest
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    )
    return el
  }

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    )
  }

  const handleDragLeave = () => {
    clearHighlights()
    setActive(false)
  }

  const filteredCards = cards.filter((c) => c.column === column)

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => (
          <div key={c.id}>
            <Card key={c.id} {...c} handleDragStart={handleDragStart} setCards={setCards} cards={cards}
             />
             {/*  { title, headingColor, cards, column, setCards }: ColumnProps */}
          </div>
        ))}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  )
}