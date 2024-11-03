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
import { useState } from "react"
import { Task } from "@/types/types"
import { doc, updateDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { usePathname } from "next/navigation"

function DueDate({ cards, id }: { cards: Task[], id: string }) {
    const [date, setDate] = useState<Date | undefined>(new Date())
    
    const pathname = usePathname();
    const projectId = pathname.split("/").pop();

    const handleDateChange = async (newDate: Date | undefined) => {
        setDate(newDate)
        if (newDate) {
            console.log(newDate.toLocaleDateString('en-US'))
            try {
                if (projectId){
                    await updateDoc(doc(db, "documents", projectId, "tasks", id), {
                        date: newDate.toLocaleDateString('en-US')
                      });
                }  
              } catch (error) {
                console.error("Error removing assignee:", error);
              }
        }
    }

    // Find the specific card that matches the id
    const currentCard = cards.find(card => card.id === id)

    if (!currentCard) {
        return <div>No task found</div>
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger className="flex flex-1 hover:bg-gray-200">
                {currentCard.date || "Set Due Date"}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Choose Due Date For {currentCard.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateChange}
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