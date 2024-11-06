'use client'

import { Dispatch, SetStateAction } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { usePathname } from "next/navigation"
import { Task } from '@/types/types'


interface TaskStatusProps {
    column: string
    id: string
    cards: Task[]
    setCards: Dispatch<SetStateAction<Task[]>>
}

function TaskStatus({ column, id, cards, setCards }: TaskStatusProps) {
    // const [column, setColumn] = useState(initialStatus)
    // THIS MIGHT BREAK THE TASK STATUS, CANNOT CHECK UNTIL I IMPLEMENT TASK WITH JACKS ORGANIZATION
    const pathname = usePathname()
    const projectId = pathname.split("/").pop()

    const handleSelect = async (newStatus: string): Promise<void> => {
        try {

            // THERE IS A BUG IF THE USER CLICKS THE STATUS THEY ARE ALREADY A PART OF 
            let copy = [...cards]
            let cardToTransfer = copy.find((c) => c.id === id)
            if (!cardToTransfer) return
            cardToTransfer = { ...cardToTransfer, column }

            copy = copy.filter((c) => c.id !== id)

            setCards(copy)
            if (projectId) {
                await updateDoc(doc(db, "documents", projectId, "tasks", id), {
                    column: newStatus
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 items-center justify-between px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                {column}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleSelect('backlog')}>Backlog</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('todo')}>Todo</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('doing')}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('done')}>Complete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TaskStatus