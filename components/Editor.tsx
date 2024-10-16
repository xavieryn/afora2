'use client'; // taking input from client

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import Unsafe from "./Unsafe";
import { useUser } from "@clerk/nextjs";



function Editor() {

    const [darkMode, setDarkMode] = useState(false); // THIS DOES NOT WORK FOR NOW
    const style = `hover:text-white ${darkMode
        ? "text-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700"
        : "text-gray-700 bg-gray-200 hover:bg-gray-300 hover:text-gray-700"
        }`


    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-2 justify-end mb-10">


                {/* Dark Mode */}
                <Button className={style} onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <SunIcon /> : <MoonIcon />}
                </Button>
            </div>

        </div>
    )
}
export default Editor