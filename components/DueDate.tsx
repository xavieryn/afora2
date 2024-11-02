"use client"
import { Calendar } from "@/components/ui/calendar"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"


function DueDate() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const test = '11/20/24';

    useEffect(() => {
        if (date) { 
            console.log(date.toLocaleDateString('en-US')); 
        }
    },[date])

    return (
        <AlertDialog>
            <AlertDialogTrigger className="flex flex-1 hover:bg-gray-200">{test}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Choose Due Date For This Task</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DueDate