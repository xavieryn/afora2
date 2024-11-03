'use client'
import { db } from '@/firebase';
import { Project, UserOrgData } from '@/types/types';
import { useUser } from '@clerk/nextjs'
import { doc, DocumentData, FirestoreError, QuerySnapshot } from 'firebase/firestore';
import React, { useEffect, useState, useTransition } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import GenerateTeamsButton from './GenerateTeamsButton';
import { Button } from './ui/button';
import { updateGroups } from '@/actions/actions';
import { toast } from 'sonner';
import ProjectCard from './ProjectCard';
import DeleteOrg from './DeleteOrg';
import InviteUserToOrganization from './InviteUserToOrganization';

type MatchingOutput = {
    groupSize: number
    groups: string[][]
}

const ProjPage = ({ orgId, projectsData, loading, error, userRole }: { userRole: string, orgId: string, projectsData: QuerySnapshot<DocumentData, DocumentData> | undefined, loading: boolean, error: FirestoreError | undefined }) => {
    const [isPending, startTransition] = useTransition();

    const [output, setOutput] = useState('');
    const [parsedOutput, setParsedOutput] = useState<MatchingOutput | null>(null);

    useEffect(() => {
        if (output) {
            try {
                const parsed: MatchingOutput = JSON.parse(output);
                setParsedOutput(parsed);
            } catch (error) {
                console.error('Failed to parse output:', error);
            }
        }
    }, [output]);
    const handleAccept = () => {
        if (parsedOutput) {
            startTransition(() => {
                updateGroups(orgId, parsedOutput.groups)
                    .then(() => {
                        // Show success toast
                        toast.success('Groups updated successfully');
                    })
                    .catch((error) => {
                        console.error('Failed to update groups:', error);
                        toast.error('Failed to update groups');
                    });
            });
            setOutput('');
        }
    };

    return (
        <>
            {userRole === 'admin' &&
                <div>
                    {output && parsedOutput && parsedOutput.groups && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {parsedOutput.groups.map((group, index) => (
                                    <div key={index} className="group-card shadow-md p-2 mb-2 rounded-lg bg-white dark:bg-gray-800">
                                        <h3 className="text-md font-semibold mb-1 text-gray-900 dark:text-gray-100">Group {index + 1}</h3>
                                        <ul>
                                            {group.map((member, memberIndex) => (
                                                <li key={memberIndex} className="text-gray-700 dark:text-gray-300 text-xs">{member}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">
                                <Button disabled={isPending} onClick={handleAccept}>
                                    {isPending ? 'Accepting...' : 'Accept'}
                                </Button>
                                <Button variant="secondary" onClick={() => setOutput('')}>
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading && <p>Loading projects...</p>}
                        {error && <p>Error loading projects: {error.message}</p>}
                        {!loading && !error && projectsData && projectsData.docs.length > 0 && (
                            projectsData.docs
                                .sort((a, b) => {
                                    const projA = a.data() as Project;
                                    const projB = b.data() as Project;
                                    return projA.title.localeCompare(projB.title);
                                })
                                .map((doc) => {
                                    const proj = doc.data() as Project;
                                    return (
                                        <ProjectCard key={doc.id} projectName={proj.title} backgroundImage={''} tasks={[]} />
                                    );
                                })
                        )}
                    </div>
                    {!output && !loading && !error && projectsData && projectsData.docs.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                            <p className="text-lg font-bold">No projects found.</p>
                            <GenerateTeamsButton setOutput={setOutput} orgId={orgId} />
                        </div>
                    )}

                </div >
            }
            {userRole === 'editor' &&
                <div>
                    <h2>Member Section</h2>
                    <p>Welcome, Team Member! Here you can view your team information.</p>
                    {/* Add more member-specific components or functionality here */}
                </div>
            }
        </>
    )
}

export default ProjPage