'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useTransition } from "react";
import { createNewOrganization } from "@/actions/actions";
import { toast } from "sonner";

function NewOrgButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewOrganization = () => {
    startTransition(async () => {
      const { orgId, success, message } = await createNewOrganization();
      if (success) {
        toast.success("Orgnization created successfully!");
        router.push(`/org/${orgId}`);
      } else {
        toast.error(message);
      }
    })
  }
  return (
    // TODO: add dialog to ask for org names
    <Button onClick={handleCreateNewOrganization} disabled={isPending}>
      {isPending ? "Loading..." : "New Organization"}
    </Button>
  )
}
export default NewOrgButton