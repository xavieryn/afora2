'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/firebase";
import { useAuth } from "@clerk/nextjs";
import { doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDocument } from "react-firebase-hooks/firestore";

function Taskage({ params: { id, projId, stageId, taskId } }: {
  params: {
    id: string;
    projId: string;
    stageId: string;
    taskId: string
  }
}) {
  console.log(id, projId, stageId, taskId);
  const { isSignedIn, isLoaded } = useAuth(); // Get authentication state
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (isLoaded && !isSignedIn) {
      router.replace('/'); // Redirect to the login page
    }
    console.log('projId', projId);
    console.log('stageId', stageId);
  }, [isLoaded, isSignedIn, projId, stageId]);

  const [taskData, taskLoading, taskError] = useDocument(doc(db, 'projects', projId, 'stages', stageId, 'tasks', taskId));

  if (taskLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (taskError) {
    return <div>Error: {taskError.message}</div>;
  }
  
  const task = taskData?.data();

  return (
    <div className="flex flex-col flex-1">
      {isSignedIn &&
        <div className="p-4">
          <h1 className="text-4xl font-bold">{task?.title}</h1>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Assigned to: {task?.assignedTo}</p>
            <p className="text-sm text-gray-600">Deadline: {task?.deadline}</p>
            <p className="text-lg mt-4">{task?.description}</p>
          </div>
        </div>}
    </div>
  )
}
export default Taskage;