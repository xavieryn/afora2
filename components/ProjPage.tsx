'use client'
import { db } from '@/firebase';
import { UserOrgData } from '@/types/types';
import { useUser } from '@clerk/nextjs'
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import GenerateTeamsButton from './GenerateTeamsButton';
import { Button } from './ui/button';

type MatchingOutput = {
    groupSize: number
    groups: string[][]
}

const ProjPage = ({ orgId }: { orgId: string }) => {
    const { user } = useUser();
    const userId = user?.primaryEmailAddress?.emailAddress;

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
                                <Button onClick={() => console.log('Button clicked!')}>Accept</Button>
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
        </>
    )
}

export default ProjPage