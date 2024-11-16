'use client'
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Project, projQuestions, teamCharterQuestions } from '@/types/types';
import { db } from '@/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useState, useTransition } from 'react';
import { generateTask } from '@/ai_scripts/generateTask';

const GenerateTasksButton = ({ orgId, projId, teamCharterResponses }: { orgId: string, projId: string, teamCharterResponses: string[] }) => {
  const [open, setOpen] = useState(false);
  const [proj, loading, error] = useDocument(doc(db, 'projects', projId));
  const [isPending, startTransition] = useTransition();
  if (loading) {
    return;
  }

  if (error) {
    console.log(error.message);
    return;
  }

  if (!proj) {
    console.log("No project found");
    return;
  }
  const handleGenerateTasks = async () => {
    const projData = proj!.data()! as Project;

    if (!projData) {
      return ;
    }

    const memberList = projData.members;
    const userDataPromise = memberList.map(async (user) => {
      const userOrg = await getDoc(doc(db, 'users', user, 'org', orgId));
      const userOrgData = userOrg.data();
      const surveyResponse = userOrgData?.projOnboardingSurveyResponse ? userOrgData.projOnboardingSurveyResponse.join(',') : '';
      return `{${user}:${surveyResponse}}`;
    });

    const userData = await Promise.all(userDataPromise);

    startTransition(async () => generateTask(projQuestions, userData, teamCharterQuestions, teamCharterResponses)
      .then((output: string) => {
        console.log("API Response:", output); // Log the output from the matching function
        setOpen(false);
      })
      .catch((error: Error) => {
        console.error("Error:", error); // Handle any errors
        toast.error(error.message);
      }));
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            Generate Tasks
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Tasks</DialogTitle>
            <DialogDescription>
              Confirm the tasks structure generated.
            </DialogDescription>
          </DialogHeader>

          {/* TODO: show the tentative stage and tasks data: using accordian */}

          <DialogFooter>
            <Button type="submit" disabled={isPending} onClick={handleGenerateTasks}>
              {isPending ? 'Generating...' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenerateTasksButton;