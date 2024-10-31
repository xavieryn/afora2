'use client'
import { db } from '@/firebase';
import { UserOrgData } from '@/types/types';
import { useUser } from '@clerk/nextjs'
import { doc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDocument } from 'react-firebase-hooks/firestore';
import GenerateTeamsButton from './GenerateTeamsButton';

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

    return (
        <>
            <div>ProjPage</div>
            <div>Viewing as: <strong><u>{userRole}</u></strong></div >
            {userRole === 'admin' ? (
                <div>
                    <h2>Admin Section</h2>
                    <p>Welcome, Admin! Here you can manage the team.</p>
                    {/* Add more admin-specific components or functionality here */}
                    <GenerateTeamsButton setOutput={setOutput} />
                    {output && (
                        <div>
                            <h3>Generated Teams:</h3>
                            <pre>{JSON.stringify(output, null, 2)}</pre>
                        </div>
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