'use client';

import { Card, CardHeader } from "@/components/ui/card"

import { db } from "@/firebase";
import { useAuth } from "@clerk/nextjs";
import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Stage } from "@/types/types";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

function ProjectPage({ params: { id, projId } }: {
  params: {
    id: string;
    projId: string;
  }
}) {
  console.log(id)
  const { isSignedIn, isLoaded } = useAuth(); // Get authentication state
  const router = useRouter();
  useEffect(() => {
    // Redirect to login if the user is not authenticated
    if (isLoaded && !isSignedIn) {
      router.replace('/'); // Redirect to the login page
    }
    console.log('projid', projId);
  }, []);

  const [stagesData, stagesLoading, stagesError] = useCollection(collection(db, 'projects', projId, 'stages'));

  if (stagesLoading) {
    return <Skeleton className="w-full h-96" />;
  }

  if (stagesError) {
    return <div>Error: {stagesError.message}</div>;
  }

  const stages: Stage[] = stagesData?.docs.map(doc => ({
    ...(doc.data() as Stage)
  })) || [];

  return (
    <div className="w-full h-full flex flex-col">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="text-xl font-bold text-black">Project Stages</TableHead>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2} className="px-4">
              <h2 className="text-lg font-semibold py-2">Goal Progress: 33%</h2>
              <Progress value={33} />
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={2} className="font-medium text-black">No stages</TableCell>
            </TableRow>
          ) : (
            stages
              .sort((a, b) => a.order - b.order)
              .map((stage, index) => (

                <TableRow className="flex flex-1" key={index}>
                  <Link className="flex flex-1" href={`/org/${id}/proj/${projId}/stage/${stage.id}`}>
                    {/* <TableCell className="font-medium text-black whitespace-nowrap">{stage.order} - {stage.title}</TableCell> */}
                    <TableCell className="flex flex-1">
                      <Card className="w-full shadow-lg hover:shadow-3xl hover:translate-y-[-4px] transition-transform duration-300 h-auto">
                        <CardHeader className="p-0">
                          <div
                            className="bg-cover bg-center items-end justify-start p-4"
                          >
                            {stage.order} - {stage.title}
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
export default ProjectPage