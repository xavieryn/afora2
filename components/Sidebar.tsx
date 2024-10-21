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
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { db } from '@/firebase'
import { useEffect, useState } from "react";
import SidebarOption from "./SidebarOption";
import JoinDocumentButton from "./JoinDocumentButton";
import NewOrgButton from "./NewOrgButton";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string
}

interface OrgDocument extends DocumentData {
  createdAt: string;
  role: string;
  orgId: string;
  userId: string
}

function Sidebar() {
  const { user } = useUser()
  // const [data, loading, error] = useCollection(
  const [data] = useCollection(
    user &&
    query(
      (collectionGroup(db, 'rooms')),
      where('userId', '==', user.emailAddresses[0].toString())
    )
  )

  const [orgs] = useCollection(
    user &&
    query(
      (collectionGroup(db, 'organizations')),
      where('userId', '==', user.emailAddresses[0].toString())
    )
  )

  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });
  useEffect(() => {
    if (!data) return;

    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          })
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData
          })
        }
        return acc;
      }, {
      owner: [],
      editor: [],
    }
    )
    console.log(grouped)
    setGroupedData(grouped);
  }, [data]);

  const [orgData, setOrgData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  // Processing for displaying orgs
  useEffect(() => {
    if (!orgs) return;

    const grouped = orgs.docs.reduce<{
      orgs: OrgDocument[];
    }>(
      (acc, curr) => {
        const org = curr.data() as OrgDocument;
        acc.orgs.push({
          id: curr.id,
          ...org,
        })
        return acc;
      }, {
      orgs: []
    }
    )
    console.log(grouped)

  }, [orgData]);




  const menuOptions = (
    <>
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        <NewDocumentButton />
        <NewOrgButton />

        <JoinDocumentButton />

        {/* my documents */}
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm">
            No Documents Found
          </h2>
        ) : (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              My Documents
            </h2>
            {groupedData.owner.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}

        {/* list... */}
        {/* Shared with Me */}
        {groupedData.editor.length > 0 && (
          <>
            <h2 className="text-gray-500 font-semibold text-sm">
              Shared with Me
            </h2>
            {groupedData.editor.map((doc) => (
              <SidebarOption key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}

          </>
        )}
        {/* List...  */}
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