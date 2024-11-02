import { Dispatch, SetStateAction } from 'react'
import Column from './Column'
import BurnBarrel from './BurnBarrel'

interface Task {
  id: string
  title: string
  column: string
  assigned: Array<string>
  date: string
}

interface BoardProps {
  id: string
  cards: Task[]
  setCards: Dispatch<SetStateAction<Task[]>>
}

export default function Board({ id, cards, setCards }: BoardProps) {
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
  )
}