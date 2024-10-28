'use client'
import React, { useEffect, useState } from 'react'

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { header, questions, tags } from '@/types/types';
import { Progress } from "@/components/ui/progress"
import { setUserOnboardingSurvey } from '@/actions/actions';
import { toast } from 'sonner';

const AppOnboarding = () => {
    const [selectedTags, setSelectedTags] = useState<string[][]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [page, setPage] = useState(0);
    useEffect(() => {
        // Open the dialog automatically when the component mounts
        setIsOpen(true);
        setPage(0);
        setSelectedTags(Array(questions.length).fill([]));
    }, []);

    const toggleTag = (tag: string) => {
        setSelectedTags((prev) => {
            const newTags = prev.map((tags, index) => {
                if (index === page-1) {
                    if (tags.includes(tag)) {
                        return tags.filter((t) => t !== tag);
                    } else {
                        return [...tags, tag];
                    }
                }
                return tags;
            });
            return newTags;
        });
    };

    const handleSubmit = () => {
        setUserOnboardingSurvey(selectedTags);
        toast.success('Survey response received successfully!');
        setIsOpen(false);
    }

    return (
        <div>
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent className="w-full max-w-2xl">
                    <Progress value={page / (questions.length) * 100} />

                    {page === 0 &&
                        <AlertDialogHeader>
                            <AlertDialogTitle>App Onboarding Survey</AlertDialogTitle>
                            <AlertDialogDescription>
                                Please take a minute to fill out this mandatory form. The information will be used for team-matching.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                    }


                    {page > 0 &&
                        <>
                            <AlertDialogTitle>{header[page-1]}</AlertDialogTitle>
                            <p>{`Q${page}: ${questions[page-1]}`}</p>

                            <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                                {tags.map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={selectedTags[page-1].includes(tag) ? "default" : "outline"} // Apply selected style
                                        className={`flex items-center space-x-2 px-3 py-1 rounded-lg`}
                                        onClick={() => toggleTag(tag)}
                                    >
                                        <span>{tag}</span>
                                    </Button>
                                ))}
                            </div>
                        </>
                    }

                    <AlertDialogFooter >
                        {/* <AlertDialogCancel onClick={() => setIsOpen(false)}>Cancel</AlertDialogCancel> */}
                        {page === 0 && <Button onClick={() => setPage(page + 1)}>Start</Button>}
                        {page > 0 &&
                            <>
                                <Button variant="outline" onClick={() => setPage(page - 1)} disabled={page === 1}>Back</Button>
                                {page < questions.length ?
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

export default AppOnboarding