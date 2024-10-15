import HomeSignedIn from "@/components/HomeSignedIn";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {


  return (
    <main className="flex bg-gray-100">
      <SignedIn>
        <div className="flex flex-col flex-1">
          <div className="flex animate-pulse space-x-2 flex-row">
            <ArrowLeftCircle className="w-12 h-12 text-purple-800" />
            <h1 className="font-bold text-2xl text-gray-800">Get started with creating a New Document</h1>
          </div>
          <div>
            <HomeSignedIn />

          </div>
        </div>

      </SignedIn>

      <SignedOut>
        <div className="flex-1 flex items-center justify-center">

          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Welcome to Afora
            </h2>
            <p className="text-xl text-gray-600 mb-8 text-center">
              Create an account to start using Afora!
            </p>
            <div className="flex justify-center">
              <SignInButton mode="modal">
                <button className="bg-purple-800 hover:bg-purple-900 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                  Sign Up / Sign In
                </button>
              </SignInButton>
            </div>
          </div>
        </div>

      </SignedOut>
    </main>
  );
}