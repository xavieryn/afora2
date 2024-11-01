import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


function TaskStatus() {
    const test = 'todo'
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-1 hover:bg-gray-200">{test}</DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>Backlog</DropdownMenuItem>
                <DropdownMenuItem>todo</DropdownMenuItem>
                <DropdownMenuItem>In Progress</DropdownMenuItem>
                <DropdownMenuItem>Complete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default TaskStatus