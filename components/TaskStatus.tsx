'use client'

import { startTransition, useEffect, useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, doc, orderBy, query, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { usePathname } from "next/navigation";


type Status = 'backlog' | 'todo' | 'doing' | 'done'

interface TaskStatusProps {
    initialStatus?: Status
    onSelect?: (status: Status) => void
    id: string
}

// FIX THE HARD CODED TODO LATER
function TaskStatus({ initialStatus = 'todo', onSelect, id }: TaskStatusProps) {
    const [status, setStatus] = useState<Status>(initialStatus)
    const pathname = usePathname(); 
    const projectId = pathname.split("/").pop();
    
    console.log('project id', projectId);
    console.log('task id', id);

    useEffect(() => {
        console.log('hi')
    },[status])

    const handleSelect = async (newStatus: Status): Promise<void> => {
        try {
            setStatus(newStatus);
            if (onSelect) {
                onSelect(newStatus);
            }
            startTransition(async () => {
                await updateDoc(doc(db, "documents", projectId , "tasks", id), {
                    column: newStatus
                });
            });

        } catch (error) {
            console.error("Error updating status:", error);
            // You might want to handle the error appropriately here
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