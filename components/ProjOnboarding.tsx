'use client'
import React, { useEffect, useState } from 'react'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { projHeader, projQuestions } from '@/types/types';
import { Progress } from "@/components/ui/progress"
import { setProjOnboardingSurvey } from '@/actions/actions';
import { toast } from 'sonner';
import { db } from '@/firebase';
import { useDocument } from 'react-firebase-hooks/firestore';
import { doc } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';
import { Textarea } from './ui/textarea';

const ProjOnboarding = () => {
    const [responses, setResponses] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(0);
    useEffect(() => {
        // Open the dialog automatically when the component mounts
        setIsOpen(true);
        setPage(0);
        setResponses(Array(projQuestions.length).fill(""));
    }, []);

    const handleSubmit = async () => {
        const { success, message } = await setProjOnboardingSurvey(responses);
        if (success) {
            toast.success('Survey response received successfully!');
            setIsOpen(false);
        } else {
            toast.error(message);
        }
    }

    const { user } = useUser();

    const [userData, loading, error] = useDocument(user && user.primaryEmailAddress && doc(db, 'users', user.primaryEmailAddress.toString()));

    if (!userData || userData.data()!.onboardingSurveyResponse) {
        return null;
    }

    return (
        <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                <AlertDialogOverlay className="bg-black bg-opacity-80 fixed inset-0" />
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent className="w-full max-w-2xl">
                    <Progress value={page / (projQuestions.length) * 100} />

                    {page === 0 &&
                        <AlertDialogHeader>
                            <AlertDialogTitle>Project Onboarding Survey</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please take a minute to fill out this mandatory form. The information will be used for project-matching.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    }

                    {page > 0 &&
                        <>
                            <AlertDialogTitle>{projHeader[page - 1]}</AlertDialogTitle>
                            <p>{`Q${page}: ${projQuestions[page - 1]}`}</p>

                            <Textarea
                                placeholder="Enter your response"
                                onChange={(e) => {
                                    setResponses((prev) => {
                                        const newR = [...prev];
                                        newR[page - 1] = e.target.value;
                                        return newR;
                                    });
                                }}
                            />
                        </>
                    }

                    <AlertDialogFooter >
                        {/* <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel> */}
                        {page === 0 && <Button onClick={() => setPage(page + 1)}>Start</Button>}
                        {page > 0 &&
                            <>
                                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Back</Button>
                                {page < projQuestions.length ?
                                    <Button onClick={() => setPage(page + 1)}>Next</Button>
                                    :
                                    <Button onClick={handleSubmit}>Submit</Button>
                                }
                            </>
                        }
                    </AlertDialogFooter >
                </AlertDialogContent >
            </AlertDialog >
        </div >
    )
}

export default ProjOnboarding