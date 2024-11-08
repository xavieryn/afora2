'use client';

import { ArrowLeftCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';
import HomePageCard from './HomePageCard';

interface Orgs {
    createdAt: string;
    role: string;
    orgId: string;
    userId: string;
}

function SignedInLanding() {
    const [orgs, setOrgs] = useState<Orgs[]>([]);
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress || ''; // Ensure `email` is always a string
    console.log(email)
    // Only attempt to create a collection reference if `email` is not empty
    const [orgsData, orgsLoading, orgsError] = useCollection(
        user && user.primaryEmailAddress && collection(db, "users", user.primaryEmailAddress.toString(), "orgs"));

    useEffect(() => {
        if (!orgsData) return;
        const orgsList = orgsData.docs.map((doc) => (doc.data())) as Orgs[];
        setOrgs(orgsList);
    }, [orgsData]);

    if (!user || !email || orgsLoading) {
        return <div>Loading...</div>;
    }

    if (orgsError) {
        return <div>Error loading organizations</div>;
    }

    console.log("Organizations:", orgs);
    return (

        <div className='flex p-4'>
            {orgs.length > 0 ? (
                <div className="flex flex-wrap gap-8 m-4 max-h-[400px] ">
                    {orgs.map((org) => (

                        <HomePageCard org={org} />
                    ))}
                </div>


            )
                : (
                    <div>
                        <div className="flex flex-col flex-1">
                            <div className="flex animate-pulse space-x-2 flex-row p-12 items-center">
                                <ArrowLeftCircle className="w-12 h-12 text-[#6F61EF]" />
                                <h1 className="px-2 font-bold text-2xl text-gray-800">Get Started With Creating a New Organization</h1>
                            </div>
                        </div>
                    </div>
                )}

        </div>
    );
}

export default SignedInLanding;
