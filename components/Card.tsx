import { useState, useEffect, Dispatch, SetStateAction} from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TaskAlert from './TaskAlert'
import { Task } from '@/types/types'

interface CardProps {
  id: string
  title: string
  column: string
  handleDragStart: Function
  assigned: Array<string>
  setCards: Dispatch<SetStateAction<Task[]>>
  cards: Task[]

}

export default function Card({ id, title, column, handleDragStart, assigned, setCards, cards }: CardProps ) {
  const [temp_title, setTitle] = useState(title)
  const [input, setInput] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const path = usePathname()

  useEffect(() => {
    const segments = path.split("/")
    const documentId = segments[segments.length - 1]

    const grabCard = onSnapshot(doc(db, "documents", documentId, "tasks", id), (doc) => {
      if (doc.exists()) {
        setTitle(doc.data().title)
      }
    })

    return () => grabCard()
  }, [id, path])

  const updateTitle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      setIsUpdating(true)
      const segments = path.split("/")
      const documentId = segments[segments.length - 1]

      try {
        await updateDoc(doc(db, "documents", documentId, "tasks", id), {
          title: input.trim()
        })
        setInput("")
      } catch (error) {
        console.error("Error updating task: ", error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  return (
    <>
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { temp_title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <p className="text-sm text-neutral-100 flex-1">{temp_title}</p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex justify-center ">
                <form onSubmit={updateTitle} className="flex max-w-6xl mx-auto justify-between pb-5">
                  <Input
                    placeholder={temp_title}
                    className="flex flex-1 space-x-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </form>
              </AlertDialogTitle>
              <AlertDialogDescription>
                <TaskAlert id={id} column={column} assigned={assigned} cards={cards} setCards={setCards}/>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </>
  )
}