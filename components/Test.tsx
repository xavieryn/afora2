import { collection, query, orderBy, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '@/firebase'; // Adjust this import path

interface Task {
  id: string;
  title: string;
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

const Test: React.FC<{ id: string }> = ({ id }) => {
  const [data, dataLoading, dataError] = useDocumentData(doc(db, "documents", id));
  const { tasks, loading: tasksLoading, error: tasksError } = useTasksSubcollection(id);

    // FEED THESE TASKS INTO THE KANBAN!!!!!!!
  // console.log(tasks)
  if (dataLoading || tasksLoading) return <div>Loading...</div>;
  if (dataError) return <div>Error loading document: {dataError.message}</div>;
  if (tasksError) return <div>Error loading tasks: {tasksError.message}</div>;

  return (
    <div>
      <h1>Document: {(data as DocumentData)?.title}</h1>
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