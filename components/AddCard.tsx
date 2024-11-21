// import { useState, Dispatch, SetStateAction, FormEvent } from 'react'
// import { usePathname } from 'next/navigation'
// import { motion } from 'framer-motion'
// import { FiPlus } from 'react-icons/fi'
// import { addDoc, collection, updateDoc, serverTimestamp } from 'firebase/firestore'
// import { db } from '@/firebase'

// interface Task {
//   id: string
//   title: string
//   column: string
//   assigned: Array<string>
//   date: string
// }

// type ColumnType = "backlog" | "todo" | "doing" | "done"

// interface AddCardProps {
//   column: ColumnType
//   setCards: Dispatch<SetStateAction<Task[]>>
// }

// export default function AddCard({ column, setCards }: AddCardProps) {
//   const [text, setText] = useState("")
//   const [adding, setAdding] = useState(false)
//   const path = usePathname()
//   const segments = path.split("/")

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault()

//     if (!text.trim().length) return

//     try {
//       const documentId = segments[segments.length - 1]

//       // Add the new task to Firestore
//       const docRef = await addDoc(collection(db, "documents", documentId, "tasks"), {
//         column,
//         title: text.trim(),
//         createdAt: serverTimestamp(),
//         date: "",
//         assigned: [],
//         description: ""
//       })

//       // Get the auto-generated ID
//       const newTaskId = docRef.id

//       // Update the document with its own ID
//       await updateDoc(docRef, {
//         id: newTaskId
//       })

//       // Update the local state
//       const newCard = {
//         column,
//         title: text.trim(),
//         id: newTaskId,
//         assigned: [],
//         date: ""
//       }
//       setCards((pv) => [...pv, newCard])

//       console.log("New task added and updated with ID: ", newTaskId)
//       setAdding(false)
//       setText("")
//     } catch (error) {
//       console.error("Error adding new task: ", error)
//       // Handle the error appropriately (e.g., show an error message to the user)
//     }
//   }

//   return (
//     <>
//       {adding ? (
//         <motion.form layout onSubmit={handleSubmit}>
//           <textarea
//             onChange={(e) => setText(e.target.value)}
//             autoFocus
//             placeholder="Add new task..."
//             className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm placeholder-violet-300 focus:outline-0"
//           />
//           <div className="mt-1.5 flex items-center justify-end gap-1.5">
//             <button
//               type="button"
//               onClick={() => setAdding(false)}
//               className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//             >
//               Close
//             </button>
//             <button
//               type="submit"
//               className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
//             >
//               <span>Add</span>
//               <FiPlus />
//             </button>
//           </div>
//         </motion.form>
//       ) : (
//         <motion.button
//           layout
//           onClick={() => setAdding(true)}
//           className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
//         >
//           <span>Add card</span>
//           <FiPlus />
//         </motion.button>
//       )}
//     </>
//   )
// }