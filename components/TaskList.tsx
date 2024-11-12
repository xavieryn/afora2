'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardHeader } from "@/components/ui/card"
import React, { useEffect } from 'react'
import Link from "next/link"
import { Skeleton } from "./ui/skeleton"
import { useAuth } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useCollection } from "react-firebase-hooks/firestore"
import { db } from "@/firebase"
import { Task } from "@/types/types"
import { collection } from "firebase/firestore"
import { Progress } from "@radix-ui/react-progress"

const TaskList = ({ orgId, projId, stageId }: { orgId: string, projId: string, stageId: string }) => {
  const { isSignedIn, isLoaded } = useAuth(); // Get authentication state
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (isLoaded && !isSignedIn) {
      router.replace('/'); // Redirect to the login page
    }
  }, []);

  const [tasksData, tasksLoading, tasksError] = useCollection(collection(db, 'projects', projId, 'stages', stageId, 'tasks'));

  if (tasksLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (tasksError) {
    return <div>Error: {tasksError.message}</div>;
  }

  const tasks: Task[] = tasksData?.docs.map(doc => ({
    ...(doc.data() as Task)
  })) || [];


  return (
    <div className="w-full h-full flex flex-col">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xl font-bold text-black">Tasks</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="font-medium text-black">No Tasks</TableCell>
            </TableRow>
          ) : (
            tasks
              // .sort((a, b) => a.order - b.order)
              .map((task, index) => (

                <TableRow className="flex flex-1" key={index}>
                  <Link className="flex flex-1" href={`/org/${orgId}/proj/${projId}/stage/${stageId}/task/${task.id}`}>
                    {/* <TableCell className="font-medium text-black whitespace-nowrap">{stage.order} - {stage.title}</TableCell> */}
                    <TableCell className="flex flex-1">
                      <Card className="w-full shadow-lg hover:shadow-3xl hover:translate-y-[-4px] transition-transform duration-300 h-auto">
                        <CardHeader className="p-0">
                          <div
                            className="bg-cover bg-center items-end justify-start p-4"
                          >
                            {index+1} - {task.title} assigned to: {task.assignedTo} due by {task.deadline}
                          </div>
                        </CardHeader>
                      </Card>
                    </TableCell>
                  </Link>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default TaskList