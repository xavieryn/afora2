import { db } from '@/firebase';
import { doc } from 'firebase/firestore';
import Link from 'next/link';
import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

interface Orgs {
    createdAt: string;
    role: string;
    orgId: string;
    userId: string;
}

interface HomePageCardProps {
    org: Orgs;
}

function HomePageCard({ org }: HomePageCardProps) {
    const [data] = useDocumentData(doc(db, "organizations", org.orgId));
    const basePath = `/org/${org.orgId}`;

    return (
        <Link href={basePath}>
            <div className="group-card flex flex-col shadow-md p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 w-80 h-80">
                <h1 className="text-md font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {data?.title}
                </h1>
                <h3>
                    {data?.admins[0]}
                </h3>
            </div>
        </Link>
    );
}

export default HomePageCard;
