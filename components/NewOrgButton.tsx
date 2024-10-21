'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useTransition } from "react";
import { createNewOrganization } from "@/actions/actions";

function NewOrgButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNewOrganization = () => {
    startTransition(async () => {
      const { orgId } = await createNewOrganization();
      router.push(`/org/${orgId}`)
    })
  }
  return (
    <Button onClick={handleCreateNewOrganization} disabled={isPending}>
      {isPending ? "Loading..." : "New Organization"}
    </Button>
  )
}
export default NewOrgButton