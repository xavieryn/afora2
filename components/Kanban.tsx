'use client'

export default Kanban


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
} from "react";
import { FaFire } from "react-icons/fa";
import { FiPlus, FiTrash } from "react-icons/fi";
import { Button } from "./ui/button";
import { Input } from "./ui/input";


interface Task {
  id: string;
  title: string;
  column: string
  // Add other fields as necessary
}


function Kanban({ tasks }: { tasks: Task[] }) {
  return (
    <div className="  w-full">
      <Board tasks={tasks} />
    </div>
  )
}

const Board = ({ tasks }: { tasks: Task[] }) => {

  // GRAB FROM THE ACTUAL DB
  const [cards, setCards] = useState(tasks);

  //   useEffect(() => {
  //     if (data) {
  //         setCards(data);
  //     }
  // }, [data]);

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="backlog"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
      />
      <Column

        title="In progress"
        column="doing"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
      />
      <Column
        title="Complete"
        column="done"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

type ColumnProps = {
  title: string;
  headingColor: string;
  cards: Task[];
  column: ColumnType;
  setCards: Dispatch<SetStateAction<Task[]>>;
};

const Column = ({
  title,
  headingColor,
  cards,
  column,
  setCards,
}: ColumnProps) => {
  const [active, setActive] = useState(false);



  const path = usePathname();

  const handleDragStart = (e: DragEvent, task: Task) => {
    e.dataTransfer.setData("cardId", task.id);
  };

  const handleDragEnd = async (e: DragEvent) => {
    const cardId = e.dataTransfer.getData("cardId");
    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }
      const segments = path.split("/");
      const id = segments[segments.length - 1]
      try {
        const cardRef = doc(db, "documents", id, "tasks", cardId);
        await updateDoc(cardRef, {
          column: column,
          // Add any other fields that need updating
        });
        // The local state will be updated automatically by the onSnapshot listener
      } catch (error) {
        console.error("Error updating card: ", error);
      }

      setCards(copy);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault(); // prevents rerendering the screen
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els?: HTMLElement[]) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e: DragEvent) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e: DragEvent, indicators: HTMLElement[]) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(
      document.querySelectorAll(
        `[data-column="${column}"]`
      ) as unknown as HTMLElement[]
    );
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.column === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"
          }`}
      >
        {filteredCards.map((c) => {
          return <div key={c.id} >
            <Card key={c.id} {...c} handleDragStart={handleDragStart} />

          </div>
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

interface CardProps extends Task {
  handleDragStart: Function;
}


const Card = ({ id, title, column, handleDragStart }: CardProps) => {
  const [temp_title, setTitle] = useState(title);
  const [input, setInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const segments = path.split("/");
    const documentId = segments[segments.length - 1];

    const unsubscribe = onSnapshot(doc(db, "documents", documentId, "tasks", id), (doc) => {
      if (doc.exists()) {
        setTitle(doc.data().title);
      }
    });

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
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        
        onDragStart={(e) => handleDragStart(e, { temp_title, id, column })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <AlertDialog>
          <AlertDialogTrigger>
            <p className="text-sm text-neutral-100 flex-1">{temp_title}</p>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex justify-center ">
                <form onSubmit={updateTitle} className="flex max-w-6xl mx-auto justify-between pb-5">
                  <Input
                    placeholder={temp_title}
                    className="flex flex-1 space-x-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button disabled={isUpdating} type="submit">
                    {isUpdating ? "Updating..." : "Update"}
                  </Button>
                </form>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Here you will be able to invite people, change the name, write a description etc
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </>
  );
};

type DropIndicatorProps = {
  beforeId: string | null;
  column: string;
};

const DropIndicator = ({ beforeId, column }: DropIndicatorProps) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({
  setCards,
}: {
  setCards: Dispatch<SetStateAction<Task[]>>;
}) => {
  const [active, setActive] = useState(false);

  const pathname = usePathname();

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();  // prevents rerendering the screen
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = (e: DragEvent) => {

    const cardId = e.dataTransfer.getData("cardId");
    setCards((pv) => pv.filter((c) => c.id !== cardId));
    setActive(false);
    const roomId = pathname.split("/").pop();
    if (!roomId) return;

    deleteTask(roomId, cardId);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${active
        ? "border-red-800 bg-red-800/20 text-red-500"
        : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
        }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

type AddCardProps = {
  column: ColumnType;
  setCards: Dispatch<SetStateAction<Task[]>>;
};

const AddCard = ({ column, setCards }: AddCardProps) => {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const path = usePathname();
  const segments = path.split("/");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();  // prevents rerendering the screen

    if (!text.trim().length) return;

    try {
      const documentId = segments[segments.length - 1];

      // Add the new task to Firestore
      const docRef = await addDoc(collection(db, "documents", documentId, "tasks"), {
        column,
        title: text.trim(),
        createdAt: serverTimestamp(),
      });

      // Get the auto-generated ID
      const newTaskId = docRef.id;

      // Update the document with its own ID
      await updateDoc(docRef, {
        id: newTaskId
      });

      // Update the local state
      const newCard = {
        column,
        title: text.trim(),
        id: newTaskId,
      };
      setCards((pv) => [...pv, newCard]);

      console.log("New task added and updated with ID: ", newTaskId);
      setAdding(false);
    } catch (error) {
      console.error("Error adding new task: ", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };
  return (
    <>
      {adding ? (
        //  Motion.form comes from framer motion and layout has a small animation when something gets deleted or added
        <motion.form layout onSubmit={handleSubmit}>
          <textarea
            onChange={(e) => setText(e.target.value)}
            autoFocus
            placeholder="Add new task..."
            className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm  placeholder-violet-300 focus:outline-0"
          />
          <div className="mt-1.5 flex items-center justify-end gap-1.5">
            <button
              onClick={() => setAdding(false)}
              className="px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300"
            >
              <span>Add</span>
              <FiPlus />
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

type ColumnType = "backlog" | "todo" | "doing" | "done";


