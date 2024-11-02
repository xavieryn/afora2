'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { usePathname } from "next/navigation"


interface TaskStatusProps {
    initialStatus: String
    id: string
}

function TaskStatus({ initialStatus, id }: TaskStatusProps) {
    const [status, setStatus] = useState(initialStatus)
    const pathname = usePathname()
    const projectId = pathname.split("/").pop()

    const handleSelect = async (newStatus: String): Promise<void> => {
        try {
            setStatus(newStatus)
            if (projectId) {
                await updateDoc(doc(db, "documents", projectId, "tasks", id), {
                    column: newStatus
                })
            }
        } catch (error) {
            console.error("Error updating status:", error)
            // Revert the status if the update fails
            setStatus(status)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 items-center justify-between px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                {status}
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