import React from 'react'

function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6 rounded-xl">
      <div className="w-full max-w-6xl px-4">
        <div className="flex flex-col items-center justify-center gap-8 p-8 bg-white min-h-[500px] shadow-lg rounded-lg"> 
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-gray-800">Contact Information</h1>
            <div className="bg-[#6F61EF] p-6 border  rounded-xl text-white">
              <p className="text-xl mb-2">
                <span className="font-semibold">Email:</span> 
                <span className="ml-2 ">Afora.connect@gmail.com</span>
              </p>
              <div className="mt-6 text-white">
                <p className="mb-2">Feel free to reach out for any inquiries or feedback.</p>
                <p>We typically respond within 1-2 business days.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page;