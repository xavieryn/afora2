import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Member {
    id: string
    name: string
}

interface Task {
    id: string
    title: string
}

interface ProjectCardProps {
    projectName: string
    backgroundImage: string
    tasks: Task[]
}

const ProjectCard = ({
    projectName = "Sample Project",
    backgroundImage = "/placeholder.svg?height=200&width=600",
    tasks = [
        { id: "1", title: "Design user interface" },
        { id: "2", title: "Implement backend API" },
        { id: "3", title: "Write unit tests" },
    ]
}: ProjectCardProps) => {
    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            <CardHeader className="p-0">
                <div
                    className="h-48 bg-cover bg-center flex items-end justify-start p-4"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                    role="img"
                    aria-label={`Background image for ${projectName}`}
                >
                    <h2 className="text-2xl font-bold text-white bg-black bg-opacity-50 p-2 rounded">
                        {projectName}
                    </h2>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2">Upcoming Tasks</h3>
            </CardContent>
        </Card>
    )
}

export default ProjectCard