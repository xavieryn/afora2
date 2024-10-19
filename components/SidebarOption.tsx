'use client';

import { db } from "@/firebase";
import { doc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

  // const [data, loading, error] = useDocumentData(doc(db, "documents", id)); // USE LOADING AND ERROR STATES IN THE FUTURE
  const [data] = useDocumentData(doc(db, "documents", id));
  const pathname = usePathname();
  const isActive = href.includes(pathname) && pathname !== "/";

  if (!data) return null;
  return (
    <div>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="truncate mr-1">
            {data?.title}
          </AccordionTrigger>
          <AccordionContent>
            <Link href={href}>
              <p className="truncate">{data?.title}</p>
            </Link>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

    </div>

  )
}
export default SidebarOption