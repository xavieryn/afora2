import React, { useRef, useState } from 'react'
import { Input } from './ui/input'
import JoditEditor from 'jodit-react'
import DueDate from './DueDate'
import TaskStatus from './TaskStatus'
import { useForm } from 'react-hook-form'
import AssignTask from './AssignTask'

// Define the type for your form data
type FormInputs = {
    email: string;
}

function TaskAlert({ id }: { id: string }) {
    const editor = useRef(null)
    const [content, setContent] = useState('')

    const config = {
        readonly: false,
        height: 300,
        buttons: [
            'bold',
            'italic',
            'underline',
            '|',
            'ul',
            'ol',
            '|',
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

    return (
        <div >
            <div className='gap-4 flex flex-row items-center'>
                <div>
                    Status
                </div>
                <div className='flex flex-1'>
                    <TaskStatus id={id} />
                </div>
            </div>
            <div className="flex flex-row flex-1 gap-4 items-center pt-3">
                <span>Assign</span>
                <AssignTask/>
            </div>
            <div className='pt-3 flex flex-row gap-4 '>
                <div>
                    Deadline
                </div>
                <div className='flex flex-1'>
                    <DueDate />
                </div>
            </div>

            <div className="pt-3">
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={(newContent: string) => setContent(newContent)}
                    onChange={(newContent: string) => { }}
                />
            </div>
        </div>
    )
}

export default TaskAlert