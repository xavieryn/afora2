import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { Button } from './ui/button'
import { useForm, SubmitHandler } from "react-hook-form"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Inputs = {
    demographic: string
    gender: string
}

export default function Unsafe() {
    const { user } = useUser()
    const genders = ['Male', 'Female', 'Other']
    const demographics = ['Middle/High School Student', 'College Student', 'Profesional', 'Personal']

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await user?.update({
                unsafeMetadata: {
                    demographic: data.demographic,
                    gender: data.gender,
                }
            })
            console.log("User updated successfully")
        } catch (error) {
            console.error("Error updating user:", error)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='m-2'>
                    <p>What is your gender?</p>
                    <Select onValueChange={(value) => setValue('gender', value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            {genders.map((g) => (
                                <SelectItem key={g} value={g}>{g}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.gender && <span>{errors.gender.message}</span>}
                </div>

                <div className='m-2'>
                    <p>What demographic best fits you?</p>
                    <Select onValueChange={(value) => setValue('demographic', value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Demographic" />
                        </SelectTrigger>
                        <SelectContent>
                            {demographics.map((demographic) => (
                                <SelectItem key={demographic} value={demographic}>{demographic}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {errors.demographic && <span>{errors.demographic.message}</span>}

                <Button type="submit" className='gap-2 pt-2'>Submit</Button>
            </form>
        </div>
    )
}