'use client'; // taking input from client

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Kanban from "./Kanban";

import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase'; // Adjust this import path

interface Task {
  id: string;
  title: string;
  column: string
  // Add other fields as necessary
}

export const useTasksSubcollection = (documentId: string) => {
  const [snapshot, loading, error] = useCollection(
    query(collection(db, "documents", documentId, "tasks"), orderBy('id', 'asc'))
  );

  const tasks = snapshot?.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Task[];

  return { tasks, loading, error };
};

import React from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';

interface DocumentData {
  title: string;
  // Add other fields as necessary
}

function Editor(  { id } : { id:string}) {

    const [darkMode, setDarkMode] = useState(false); // THIS DOES NOT WORK FOR NOW
    const style = `hover:text-white ${darkMode
        ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
        : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
    }`

    const [data, dataLoading, dataError] = useDocumentData(doc(db, "documents", id));
    const { tasks, loading: tasksLoading, error: tasksError } = useTasksSubcollection(id);
  
      // FEED THESE TASKS INTO THE KANBAN!!!!!!!
    //console.log(tasks)
    if (dataLoading || tasksLoading) return <div>Loading...</div>;
    if (dataError) return <div>Error loading document: {dataError.message}</div>;
    if (tasksError) return <div>Error loading tasks: {tasksError.message}</div>;


    return (
        <div >
            <div className="flex items-center gap-2 justify-end mb-10">

                <div className="mr-10">
                    {/* Dark Mode */}
                    <Button className={style} onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </Button>
                </div>

            </div>

            <Kanban tasks={tasks} />

        </div>
    )
}
export default Editor

