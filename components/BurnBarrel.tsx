import { useState, Dispatch, SetStateAction, DragEvent } from 'react'
import { usePathname } from 'next/navigation'
import { FaFire } from 'react-icons/fa'
import { FiTrash } from 'react-icons/fi'
import { deleteTask } from '@/actions/actions'

interface Task {
  id: string
  title: string
  column: string
  assigned: Array<string>
  date: string
}

interface BurnBarrelProps {
  setCards: Dispatch<SetStateAction<Task[]>>
}

export default function BurnBarrel({ setCards }: BurnBarrelProps) {
  const [active, setActive] = useState(false)
  const pathname = usePathname()

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    setActive(true)
  }

  const handleDragLeave = () => {
    setActive(false)
  }

  const handleDragEnd = (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId")
    setCards((pv) => pv.filter((c) => c.id !== cardId))
    setActive(false)
    const roomId = pathname.split("/").pop()
    if (!roomId) return

    deleteTask(roomId, cardId)
  }

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  )
}