'use client'

import { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'
import Board from './Board'
import { Task } from '@/types/types'


import { deleteTask } from "@/actions/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/firebase";
import { addDoc, collection, doc, onSnapshot, serverTimestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Dispatch,
  DragEvent,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { FaFire } from "react-icons/fa";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

    return () => unsubscribe();
  }, [id, path]);

  const updateTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setIsUpdating(true);
      const segments = path.split("/");
      const documentId = segments[segments.length - 1];

      try {
        await updateDoc(doc(db, "documents", documentId, "tasks", id), {
          title: input.trim()
        });
        setInput("");
      } catch (error) {
        console.error("Error updating task: ", error);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="w-full">
      <Board id={id} cards={cards} setCards={setCards} />
    </div>
  )
}