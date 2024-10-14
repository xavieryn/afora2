'use client'

import Unsafe from "@/components/Unsafe"
import { useUser } from "@clerk/nextjs";

function SettingPage() {

    const { user } = useUser();
    const gender = ['male', 'female', 'other']
    const demographics = ['Middle/High School Student', 'College Student', 'Profesional']

    return (
        <div>
            <div className="flex-1 flex justify-center flex-col gap-2">
                <p>
                    {typeof user?.unsafeMetadata?.gender === 'string'
                        ? user.unsafeMetadata.gender
                        : 'gender not available'}
                </p>

                <p>
                    {typeof user?.unsafeMetadata?.demographic === 'string'
                        ? user.unsafeMetadata.demographic
                        : 'Demographic not available'}
                </p>



                <Unsafe />
            </div>
        </div>
    )
}
export default SettingPage