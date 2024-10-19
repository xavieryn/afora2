'use client';

import Document from "@/components/Document";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function DocumentPage({ params: { id } }: {
  params: {
    id: string;
  }
}) {

  const { isSignedIn, isLoaded } = useAuth(); // Get authentication state
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (isLoaded && !isSignedIn) {
      router.replace('/'); // Redirect to the login page
    }
  }, []);


  return (
    <div className="flex flex-col flex-1">
      {isSignedIn && <Document id={id} />}
    </div>
  )
}
export default DocumentPage