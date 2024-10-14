import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex space-x-2 items-center justify-center" >
      <SignedIn>
        <div className="animate-pulse">
          <ArrowLeftCircle className="w-12 h-12" />
          <h1 className="font-bold">Get started with creating a New Document</h1>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="text-xl font-bold">
          Create an Account to start using Afora!
        </div>
      </SignedOut>



    </main>

  );
}
