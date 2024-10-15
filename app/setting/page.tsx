'use client'

import Unsafe from "@/components/Unsafe";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

function SettingPage() {
    const { user } = useUser();

    if (!user) {
        // Show a loading state or a message if the user is not loaded
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-6xl px-4">
                <div className="flex flex-col items-center gap-4 p-4 bg-white shadow-md rounded-lg"> 
                    {user.imageUrl ? (
                        <Image 
                            src={user.imageUrl}
                            width={150}
                            height={150}
                            alt="Profile Picture"
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-36 h-36 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">{user.fullName || "No Name Available"}</h1>
                        <p className="text-gray-500">
                            {user.primaryEmailAddress?.emailAddress || "No Email Available"}
                        </p>
                    </div>  
                    <Unsafe />
                </div>
            </div>
        </div>
    );
}

export default SettingPage;
