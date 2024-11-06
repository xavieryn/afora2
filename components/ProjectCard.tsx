import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Task {
    id: string
    title: string
}

interface ProjectCardProps {
    projectName: string
    backgroundImage: string
    tasks: Task[]
    projId: string
    orgId: string
}

const ProjectCard = ({
    projId,
    orgId, 
    projectName = "Sample Project",
    backgroundImage = "/placeholder.svg?height=200&width=600",
    tasks = [
        { id: "1", title: "Design user interface" },
        { id: "2", title: "Implement backend API" },
        { id: "3", title: "Write unit tests" },
    ]
}: ProjectCardProps) => {
    console.log(tasks)
    return (
        <a href={`${orgId}/proj/${projId}`}>
            <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg hover:shadow-3xl hover:scale-x-105 transition-transform duration-300">
                <CardHeader className="p-0">
                    <div
                        className="h-32 bg-cover bg-center flex items-end justify-start p-2"
                        style={{ backgroundImage: `url(${backgroundImage})` }}
                        role="img"
                        aria-label={`Background image for ${projectName}`}
                    >
                        <h2 className="text-xl font-bold text-white bg-black bg-opacity-75 p-1 rounded">
                            {projectName}
                        </h2>
                    </div>
                </CardHeader>
                <CardContent className="p-2">
                    <h3 className="text-md font-semibold mb-1">Upcoming Tasks</h3>
                </CardContent>
            </Card>
        </a>
    )
}

export default ProjectCard