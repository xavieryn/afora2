'use client';

import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Breadcrumbs from "./Breadcrumbs";
import Link from "next/link";
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
          {/* <Link href={href} className={`border p-2 rounded-md ${isActive ? "bg-gray-300 font-bold border-black" : "border-gray-400"}`}>
            <p className="truncate">{data?.title}</p>
          </Link> */}
          <UserButton />
        </SignedIn>
      </div>

    </div >
  )
}
export default Header