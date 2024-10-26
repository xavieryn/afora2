'use client';

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function SidebarOption({ id }: {
  id: string;
}) {
  const [data] = useDocumentData(doc(db, "organizations", id));

  if (!data) return null;

  const basePath = `/org/${id}`;

  return (
    <div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1" className="truncate">
          <AccordionTrigger>
            {data?.title}
          </AccordionTrigger>
          <AccordionContent>
            <Link href={basePath}>
              <p className="truncate">Board</p>
            </Link>
            {/* ADD ONCE WE HAVE IT LABELED AS ORGANIZATIONS */}
            {/* <Link href={`${basePath}/board`}>
              <p className="truncate">Board</p>
            </Link> */}
            <Link href={`${basePath}/people`}>
              <p className="truncate">People</p>
            </Link>
            <Link href={`${basePath}/settings`}>
              <p className="truncate">Settings</p>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default SidebarOption