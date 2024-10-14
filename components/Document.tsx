'use client';

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";

// NICE SHADCN STUFF
// DIALOG IS VERY NICE

function Document({ id }: { id: string }) {

    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition();
    // const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [data] = useDocumentData(doc(db, "documents", id));

    useEffect(() => {
        if (data) {
            setInput(data.title);
        }
    }, [data]);

    const updateTitle = (e: FormEvent) => {
        e.preventDefault();

        if (input.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, "documents", id), {
                    title: input,
                })
            })
        }
    }
    return (
        <div className="flex-1 h-full bg-white p-5">
            <div >
                <form onSubmit={updateTitle} className="flex max-w-6xl mx-auto justify-between pb-5">
                    {/* update title...  */}
                    <Input
                        className="flex flex-1 space-x-2 "
                        value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button disabled={isUpdating} type="submit">{isUpdating ? "Updating..." : "Update"}</Button>
                    {/* if */}
                    {/* is owner && inviteuser, delete comment */}


                </form>
            </div>
            <div className="flex max-w-6xl mx-auto justify-between items-center mb-3">
                {/* Manage Users */}
                {/* Avatars */}

            </div>
            <hr className='pb-10' />
            <Editor />
            {/* Collaborative Editor */}
        </div>
    )
}
export default Document