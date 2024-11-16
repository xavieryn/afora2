'use client';

import { ArrowLeftCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { collection } from 'firebase/firestore';
import { db } from '@/firebase';
import { useCollection  } from 'react-firebase-hooks/firestore';
import { useUser } from '@clerk/nextjs';
import HomePageCard from './HomePageCard';
import LoadingSpinner from './LoadingSpinner';
import { Orgs } from '@/types/types';

import { UserOrgData } from '@/types/types';

function SignedInLanding() {
    const [orgs, setOrgs] = useState<UserOrgData[]>([]);
    const { user } = useUser();
    const email = user?.primaryEmailAddress?.emailAddress || ''; // Ensure `email` is always a string
    console.log(email)
    // Only attempt to create a collection reference if `email` is not empty
    const [orgsData, orgsLoading, orgsError] = useCollection(
        user && user.primaryEmailAddress && collection(db, "users", user.primaryEmailAddress.toString(), "orgs"));

    useEffect(() => {
        if (!orgsData) return;
        const orgsList = orgsData.docs.map((doc) => (doc.data())) as UserOrgData[];
        setOrgs(orgsList);
    }, [orgsData]);

    if (!user || !email || orgsLoading) {
        return <div className='flex justify-center items-center'><LoadingSpinner/></div>;
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
                        <HomePageCard org={org} key={org.orgId} />
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
