// ./ProjectList.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";

type Project = {
    _id: string;
    name: string;
    description?: string;
    status: "Not Started" | "In Progress" | "Completed";
    deadline?: string | Date;
};

type ProjectListProps = {
    projects: Project[];
};

const statusColorMap: Record<Project["status"], string> = {
    "Not Started": "bg-gray-500",
    "In Progress": "bg-blue-500",
    "Completed": "bg-green-500",
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
    if (projects.length === 0) return null;

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {projects.map((project) => (
                <Card key={project._id} className="shadow-md bg-primary-500 text-white cursor-pointer hover:scale-105 transition transform duration-300 ease-in-out">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                        <Badge className={statusColorMap[project.status]}>
                            {project.status}
                        </Badge>
                    </CardHeader>
                    <CardContent className="text-sm text-white space-y-2">
                        {project.description && <p>{project.description}</p>}
                        {project.deadline && (
                            <p>
                                <span className="font-medium text-white">Deadline: </span>
                                {dayjs(project.deadline).format("MMMM D, YYYY")}
                            </p>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default ProjectList;
