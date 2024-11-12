'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Taskage({ params: { id, projId, stageId, taskId} }: {
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

  return (
    <div className="flex flex-col flex-1">
      {isSignedIn && <div>Task ID: {taskId}</div>}
    </div>
  )
}
export default Taskage;