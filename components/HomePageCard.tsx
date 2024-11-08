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
            <div className="group-card flex flex-col shadow-md mb-4 rounded-xl overflow-hidden bg-white dark:bg-gray-800 w-64 h-64 md:w-96 md:h-96 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="bg-[#6F61EF] p-4">
                    <h1 className="text-2xl font-semibold text-white mb-1">
                        {data?.title}
                    </h1>
                    <p className="text-white text-sm">{org.orgId}</p>
                </div>
                <div className="flex-grow bg-white dark:bg-gray-800 p-4">
                    <h3 className="text-gray-900 dark:text-gray-100 text-sm">
                        Admin: {data?.admins[0]}
                    </h3>
                </div>
            </div>
        </Link>
    );
}

export default HomePageCard;
