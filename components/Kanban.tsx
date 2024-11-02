'use client'

import { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import Board from './Board'

interface Task {
  id: string
  title: string
  column: string
  assigned: Array<string>
  date: string
}

export default function Kanban({ id }: { id: string }) {
  const [tasks, tasksLoading, tasksError] = useCollection(
    query(
      collection(db, "documents", id, "tasks"), 
      orderBy('id', 'asc')
    )
  )

  const [cards, setCards] = useState<Task[]>([])

  useEffect(() => {
    if (!tasks) return
    const tasksList = tasks.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Task[]
    setCards(tasksList)
  }, [tasks])

  if (tasksLoading) return <div>Loading...</div>
  if (tasksError) return <div>Error loading tasks: {tasksError.message}</div>
  if (!tasks) return <div>No tasks found</div>

  return (
    <div className="w-full">
      <Board id={id} cards={cards} setCards={setCards} />
    </div>
  )
}