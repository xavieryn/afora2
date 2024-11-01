import React, { useRef, useState } from 'react'
import { Input } from './ui/input'
import JoditEditor from 'jodit-react'
import DueDate from './DueDate';
import TaskStatus from './TaskStatus';

function TaskAlert({ id }: { id: string }) {
    const editor = useRef(null);
    //console.log(id)
    const [content, setContent] = useState('');
    {/* Need to put something in here later (LEARN WHAT USE MEMO DOES)  */ }
    // const config = useMemo(
    // 	() => ({
    // 		readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    // 		placeholder: 'Start typings...'
    // 	}),
    // 	[]
    // );

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
        disablePlugins: 'drag-and-drop,drag-and-drop-element,video,file' // disable specific plugins
    };
    return (
        <div>
            <div className='gap-4 flex flex-row items-center'>
                <div>
                    Status
                </div>
                <div className='flex flex-1'>
                    <TaskStatus id={id}/>
                </div>
            </div>
            <div className="flex flex-row gap-4 items-center pt-3">
                <span>Assign</span>
                <form>
                    <Input placeholder="email" className="flex flex-1 hover:bg-gray-200" />
                </form>
            </div>
            <div className='pt-3 flex flex-row gap-4 '>
                <div>
                    Deadline
                </div>
                <div className='flex flex-1'>
                    <DueDate />
                </div>
            </div>


            <div className="pt-3" >  {/*  Description Test Editor */}
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    onBlur={(newContent: string) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    onChange={(newContent: string) => { }}
                />
            </div>
        </div>
    )
}

export default TaskAlert