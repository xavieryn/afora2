'use client';

import { MenuIcon } from "lucide-react"
import NewDocumentButton from "./NewDocumentButton"
import { useCollection } from "react-firebase-hooks/firestore"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useUser } from "@clerk/nextjs";
import { collection, DocumentData, query, where } from "firebase/firestore";
import { db } from '@/firebase'
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";
import JoinDocumentButton from "./JoinDocumentButton";
import NewOrgButton from "./NewOrgButton";
import JoinOrgButton from "./JoinOrgButton";

interface OrgDocument extends DocumentData {
  createdAt: string;
  role: string;
  orgId: string;
  userId: string
}

function Sidebar() {
  const { user } = useUser()

  const [orgsData] = useCollection(
    user && user.primaryEmailAddress && collection(db, "users", user.primaryEmailAddress.toString(), "orgs"));
  const [orgs, setOrgs] = useState<OrgDocument[]>([]);

  useEffect(() => {
    if (!orgsData) return;
    const orgsList = orgsData.docs.map((doc) => (doc.data())) as OrgDocument[];
    setOrgs(orgsList);
  }, [orgsData]);
  // console.log('orgData: ', orgs);

  const menuOptions = (
    <>
      <div className="flex py-4 flex-col md:max-w-36">
        <div className="space-y-3 flex py-4 flex-col md:max-w-36">
          <NewOrgButton />
          <JoinOrgButton />
        </div>
        {/* <JoinDocumentButton /> */}

        {/* My Organization */}
        {orgs.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Organizations Found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Organizations
            </h2>
            <div className="-space-y-5">
              {orgs.map((org) => (
                <SidebarOption key={org.orgId} id={org.orgId} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger><MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} /></SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <div>
                {menuOptions}
              </div>

            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>


      <div className="hidden md:inline">
        {menuOptions}
      </div>
    </div>
  )
}
export default Sidebar