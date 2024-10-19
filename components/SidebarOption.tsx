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

function SidebarOption({ href, id }: {
  href: string;
  id: string;
}) {
  const [data] = useDocumentData(doc(db, "documents", id));

  if (!data) return null;

  // Extract the base path (without the 'people' part if it exists)
  const basePath = href.replace(/\/people$/, '');

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