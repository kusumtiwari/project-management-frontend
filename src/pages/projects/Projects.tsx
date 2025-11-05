import React from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../components/elements/no-data/NoData";
import { useFetchProjectList, useCreateProject } from "./useProjectActions";
import useProjectStore from "./useProjectStore";
import Header from "../../components/elements/heading/Header";
import { Button } from "../../components/ui/button";
import ModalForm from "@/components/ui/ModalForm";
import { AddProjectFormFields } from "./AddProjectFormFields";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Edit, Trash2 } from "lucide-react";

const Projects: React.FC = () => {
  useFetchProjectList();
  const projectList = useProjectStore((state) => state.projectList);
  const { mutate: createProject } = useCreateProject();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const navigate = useNavigate();

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      name: string;
      description?: string;
      deadline?: string;
    };

    const newProject = {
      ...data,
      status: "Not Started" as const,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };

    createProject(newProject, {
      onSuccess: (response: any) => {
        if (response?.data?.success) {
          toast.success('Project created successfully');
          closeModal();
        } else {
          toast.error(response?.data?.message);
        }
      },
    });
  };

  const handleView = (id: string) => navigate(`/projects/tasks/${id}`);
  const handleEdit = (id: string) => console.log("Edit project", id);
  const handleDelete = (id: string) => console.log("Delete project", id);

  return (
    <div>
      <Header
        text="Projects"
        rightContent={
          <Button onClick={openModal} variant="default" size="sm">
            Add Project
          </Button>
        }
      />

      {/* Project Table Section */}
      {projectList?.length === 0 ? (
        <NoData />
      ) : (
        <div className="mt-4 rounded-2xl border bg-white shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projectList.map((project: any) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        project.status === "Completed"
                          ? "success"
                          : project.status === "In Progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {project.description || "No description"}
                  </TableCell>

                  {/* ✅ Action Buttons */}
                  <TableCell className="text-right space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(project._id)}
                          >
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View Tasks</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project._id)}
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Project</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(project._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Project</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Project Modal */}
      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Add New Project"
        submitHandler={submitHandler}
      >
        <AddProjectFormFields />
      </ModalForm>
    </div>
  );
};

export default Projects;
