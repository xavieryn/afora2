import { db } from '@/firebase';
import { doc } from 'firebase/firestore';
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

    return (
        <div className="group-card flex flex-col shadow-md p-4 mb-4 rounded-lg bg-white dark:bg-gray-800 w-80">
            <h3 className="text-md font-semibold mb-2 text-gray-900 dark:text-gray-100">
                {data?.title}
            </h3>
            {/* Add more content as needed */}
        </div>
    );
}

export default HomePageCard;
