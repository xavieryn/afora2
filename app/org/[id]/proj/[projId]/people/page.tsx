import People from "@/components/People";

function page() {
  return (

     <div className="flex-1 flex flex-col items-center justify-center bg-gray-100">
     <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-md">
       <h1 className="text-2xl font-bold mb-6">People</h1>

       <People />


     </div>
   </div>
  );
}

export default page;