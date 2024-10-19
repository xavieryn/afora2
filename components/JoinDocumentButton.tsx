'use client';
import { useRouter } from "next/navigation";
import { Button } from "./ui/button"
import { useState, useTransition } from "react";
import { inviteUserToDocument } from "@/actions/actions";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

function JoinDocumentButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [projCode, setProjCode] = useState('');
  const { user } = useUser();

  const handleJoinNewDocument = () => {
    console.log(user!.emailAddresses + ' tried joining ' + projCode);

    startTransition(async () => {
      const { success, message } = (user && user.id && user.primaryEmailAddress)
        ? await inviteUserToDocument(projCode, user.primaryEmailAddress.emailAddress, 'editor')
        : { success: false, message: 'user does not exist' };
      if (success) {
        console.log('Successfully joined');
        setIsOpen(false);
        router.push(`/doc/${projCode}`);
        toast.success('Successfully joined!');
      } else {
        console.log('Failed to join', message);
        toast.error(message);
      }
    })
  }
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={isPending}>
          {isPending ? "Loading..." : "Join Document"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Document</DialogTitle>
          <DialogDescription>
            Enter the access code
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projCode" className="text-right">
              Project Code
            </Label>
            <Input
              id="projCode"
              value={projCode}
              onChange={(e) => setProjCode(e.target.value)} // Update state on change
              placeholder="Enter code"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleJoinNewDocument} disabled={isPending}>
            {isPending ? "Loading..." : "Join"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}
export default JoinDocumentButton