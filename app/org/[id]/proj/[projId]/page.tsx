'use client';

import Document from "@/components/Document";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ProjectPage({ params: { id, projId } }: {
  params: {
    id: string;
    projId: string;
  }
}) {

  const { isSignedIn, isLoaded } = useAuth(); // Get authentication state
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (isLoaded && !isSignedIn) {
      router.replace('/'); // Redirect to the login page
    }
    console.log('projid', projId);
  }, []);

  


  return (
    <div className="flex flex-col flex-1">
      {isSignedIn && <Document id={projId} />}
    </div>
  )
}
export default ProjectPage