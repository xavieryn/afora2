'use client'; // taking input from client

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import Unsafe from "./Unsafe";
import { useUser } from "@clerk/nextjs";
import Kanban from "./Kanban";



function Editor(  { id } : { id:string}) {

    const [darkMode, setDarkMode] = useState(false); // THIS DOES NOT WORK FOR NOW
    const style = `hover:text-white ${darkMode
        ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
        : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
        }`


    return (
        <div >
            <div className="flex items-center gap-2 justify-end mb-10">

                <div className="mr-10">
                    {/* Dark Mode */}
                    <Button className={style} onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <SunIcon /> : <MoonIcon />}
                    </Button>
                </div>

            </div>

            <Kanban id={id} />

        </div>
    )
}
export default Editor