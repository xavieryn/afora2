import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { usePathname } from 'next/navigation';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
   email: String;
}

function AssignTask({id}: {id:string}) {
   const { register, handleSubmit, reset } = useForm<IFormInput>();
   const pathname = usePathname()
   const projectId = pathname.split("/").pop()

   const onSubmit: SubmitHandler<IFormInput> = async (data) => {
       console.log('Email: ', data.email);
       try {
        // setStatus(newStatus)
        if (projectId) {
            await updateDoc(doc(db, "documents", projectId, "tasks", id), {
                assigned: data.email
            })
        }
    } catch (error) {
        console.error("Error updating status:", error)
        // Revert the status if the update fails
        // setStatus(status)
    }
       reset(); // This clears the form
   };

   return (
       <form onSubmit={handleSubmit(onSubmit)} className='flex flex-1'>
           <input {...register("email")} className='hover:bg-gray-200 border-2 flex flex-1'/>         
           <input type="submit" className='mx-2 hover:bg-gray-200 '/>
       </form>
   );
}

export default AssignTask