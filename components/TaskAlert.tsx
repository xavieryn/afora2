import JoditEditor from 'jodit-react'
import DueDate from './DueDate'
import TaskStatus from './TaskStatus'
import AssignTask from './AssignTask'
import { Task } from '@/types/types'
import { useRef, Dispatch, SetStateAction } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { usePathname } from 'next/navigation'
import { useDocument } from 'react-firebase-hooks/firestore'

function TaskAlert({ id, column, assigned, cards, setCards }:
    { id: string, column: string, assigned: Array<string>, cards: Task[], setCards: Dispatch<SetStateAction<Task[]>> }) {
    const editor = useRef(null)
    const pathname = usePathname();
    const projectId = pathname.split("/").pop();
    
    // Use react-firebase-hooks to get the document
    const [taskDoc, loading, error] = useDocument(
        projectId ? doc(db, "documents", projectId, "tasks", id) : null
    );

    // THIS CAN BE CHANGED TO ADD DIFFERENT FUNCTIONALITIES
    const config = {
        readonly: false,
        height: 300,
        buttons: [
            'bold',
            'italic',
            'underline',
            // '|',
            // 'ul',
            // 'ol',
            // '|',
            'link'
        ],
        removeButtons: [
            'brush',
            'file',
            'video',
            'table',
            'fontsize',
            'strict',
            'preview',
            'variant',
            'print',
            'about',
            'outdent',
            'indent',
            'selectall'
        ],
        showXPathInStatusbar: false,
        showCharsCounter: false,
        showWordsCounter: false,
        toolbarAdaptive: false,
        toolbarSticky: false,
        spellcheck: false,
        disablePlugins: 'drag-and-drop,drag-and-drop-element,video,file'
    }

    // Debounce the Firebase update
    let updateTimeout: NodeJS.Timeout;
    const setContentFireBase = async (data: string) => {
        try {
            if (data && projectId) {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(async () => {
                    await updateDoc(doc(db, "documents", projectId, "tasks", id), {
                        description: data 
                    });
                }, 500);
            }
        } catch (error) {
            console.error("Error updating description:", error);
        }
    };

    return (
        <div>
            <div className='gap-4 flex flex-row items-center'>
                <div>
                    Status
                </div>
                <div className='flex flex-1'>
                    <TaskStatus id={id} initialStatus={column} cards={cards} setCards={setCards} />
                </div>
            </div>
            <div className="flex flex-row flex-1 gap-4 items-center pt-3">
                <span>Assign</span>
                <AssignTask id={id} assigned={assigned} />
            </div>
            <div className='pt-3 flex flex-row gap-4 '>
                <div>
                    Deadline
                </div>
                <div className='flex flex-1'>
                    <DueDate cards={cards} id={id} />
                </div>
            </div>

            <div>
            <hr className="w-96 h-0.5 mx-auto my-2 border-0 rounded md:my-5 bg-gray-400"/>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {taskDoc && (
                    <JoditEditor
                        ref={editor}
                        value={taskDoc.data()?.description || ''}
                        config={config}
                        onChange={setContentFireBase}
                    />
                )}
            </div>
        </div>
    )
}

export default TaskAlert