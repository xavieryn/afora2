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
              <p className="truncate hover:underline">Board</p>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default SidebarOption