'use client'

import { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Status = 'Backlog' | 'Todo' | 'In Progress' | 'Complete'

interface TaskStatusProps {
    initialStatus?: Status
    onSelect?: (status: Status) => void
}

function TaskStatus({ initialStatus = 'Todo', onSelect }: TaskStatusProps) {
    const [status, setStatus] = useState<Status>(initialStatus)

    const handleSelect = (newStatus: Status) => {
        setStatus(newStatus)
        if (onSelect) {
            onSelect(newStatus)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 items-center justify-between px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                {status}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onSelect={() => handleSelect('Backlog')}>Backlog</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('Todo')}>Todo</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('In Progress')}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleSelect('Complete')}>Complete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default TaskStatus