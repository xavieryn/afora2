import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';

interface IFormInput {
   email: String;
}

function AssignTask() {
   const { register, handleSubmit, reset } = useForm<IFormInput>();
   const onSubmit: SubmitHandler<IFormInput> = data => {
       console.log(data);
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