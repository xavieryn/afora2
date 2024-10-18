import { collection, query, orderBy, doc, DocumentData } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase'; // Adjust this import path

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
import { Task } from '@/types/types';

const Test: React.FC<{ id: string }> = ({ id }) => {
  const [data, dataLoading, dataError] = useDocumentData(doc(db, "documents", id));
  const { tasks, loading: tasksLoading, error: tasksError } = useTasksSubcollection(id);
  
  const docData = data as DocumentData;
    // FEED THESE TASKS INTO THE KANBAN!!!!!!!
  // console.log(tasks)
  if (dataLoading || tasksLoading) return <div>Loading...</div>;
  if (dataError) return <div>Error loading document: {dataError.message}</div>;
  if (tasksError) return <div>Error loading tasks: {tasksError.message}</div>;

  return (
    <div>
      <h1>Document: {docData?.title}</h1>
      <h2>Admins: </h2>
      <ul>
        {docData?.admins?.map((admin: string, index: number) => (
          <li key={index}>{admin}</li>
        ))}
      </ul>
      <h2>Members: </h2>
      <ul>
        {docData?.members?.map((member: string, index: number) => (
          <li key={index}>{member}</li>
        ))}
      </ul>

      <h2>Tasks:</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Test;