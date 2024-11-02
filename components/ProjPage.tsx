'use client'
import { db } from '@/firebase';
import { Project, UserOrgData } from '@/types/types';
import { useUser } from '@clerk/nextjs'
import { collection, doc } from 'firebase/firestore';
import React, { useEffect, useState, useTransition } from 'react'
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
import GenerateTeamsButton from './GenerateTeamsButton';
import { Button } from './ui/button';
import { updateGroups } from '@/actions/actions';
import { toast } from 'sonner';
import ProjectCard from './ProjectCard';

type MatchingOutput = {
    groupSize: number
    groups: string[][]
}

const ProjPage = ({ orgId }: { orgId: string }) => {
    const { user } = useUser();
    const userId = user?.primaryEmailAddress?.emailAddress;

    const [isPending, startTransition] = useTransition();

    if (!userId) {
        return <div>User not found</div>;
    }

    const [data] = useDocument(doc(db, 'users', userId, 'orgs', orgId));

    const [userRole, setUserRole] = React.useState('');
    useEffect(() => {
        if (data) {
            const userOrg = data.data() as UserOrgData;
            setUserRole(userOrg.role);
        }
    }, [data])
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
        }
    };

    const [projectsData, loading, error] = useCollection(collection(db, 'organizations', orgId, 'projs'));
    return (
        <>
            <div>Viewing as: <strong><u>{userRole}</u></strong></div >
            {userRole === 'admin' ? (
                <div>
                    {/* Add more admin-specific components or functionality here */}
                    <GenerateTeamsButton setOutput={setOutput} orgId={orgId} />
                    {output && parsedOutput && parsedOutput.groups && (
                        <>
                            {parsedOutput.groups.map((group, index) => (
                                <div key={index} className="group-card shadow-md p-4 mb-4 rounded-lg bg-white dark:bg-gray-800">
                                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Group {index + 1}</h3>
                                    <ul className="list-disc pl-5">
                                        {group.map((member, memberIndex) => (
                                            <li key={memberIndex} className="text-gray-700 dark:text-gray-300">{member}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                            <div className="flex justify-end space-x-4 mt-4">
                                <Button disabled={isPending} onClick={handleAccept}>Accept</Button>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div>
                    <h2>Member Section</h2>
                    <p>Welcome, Team Member! Here you can view your team information.</p>
                    {/* Add more member-specific components or functionality here */}
                </div>
            )}

            <div>
                {loading && <p>Loading projects...</p>}
                {error && <p>Error loading projects: {error.message}</p>}
                {!loading && !error && projectsData && projectsData.docs.length > 0 && (
                    projectsData.docs.map((doc) => {
                        const proj = doc.data() as Project;
                        return (
                            <>
                                <ProjectCard projectName={proj.title} backgroundImage={''} tasks={[]} />
                            </>
                        );
                    })
                )}
                {!loading && !error && projectsData && projectsData.docs.length === 0 && <p>No projects found.</p>}
            </div>
        </>
    )
}

export default ProjPage