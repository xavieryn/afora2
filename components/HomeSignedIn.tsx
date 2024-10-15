import { currentUser } from "@clerk/nextjs/server";

async function HomeSignedIn() {
    const user = await currentUser()

    return (
        <div className=" p-4 sm:p-10">
            <h1 className="font-bold text-4xl">Projects</h1>
            {/* EVENTUALLY IT SHOULD BE RECENT PROJECTS */}
            {}
        </div>
    )
}
export default HomeSignedIn