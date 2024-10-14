'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";
import Link from "next/link";
import { Settings } from "lucide-react";


function Header() {

  const { user } = useUser();

  return (
    <div className="flex items-center justify-between p-5">
      {user && (
        <h1 className="text-2xl">
          {user.firstName}{`'s`} Space
        </h1>
      )}
      {/* Breadcrumbs*/}
      <Breadcrumbs />

      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>

        <SignedIn>
          <div className="flex gap-2">
            <Link href={'/setting'} >
              <p className="truncate"><Settings /></p>
            </Link>
            <UserButton />
          </div>
        </SignedIn>
      </div>

    </div >
  )
}
export default Header