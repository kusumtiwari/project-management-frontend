import React, { useMemo, useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { useFetchTeamMembers } from "../team/useTeamMembersActions";

const Projects: React.FC = () => {
  useFetchProjectList();
  const projectList = useProjectStore((state) => state.projectList);
  const { mutate: createProject } = useCreateProject();
  // const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState("");
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const navigate = useNavigate();

  const { data: teamsResp, refetch: refetchTeams } = useFetchTeamMembers();
  const teams = useMemo(() => (teamsResp as any)?.data?.data || [], [teamsResp]);

  console.log(teams,'teams here')

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Parse teamMembers from JSON string
    const teamMembersStr = formData.get("teamMembers") as string;
    const teamMembers = teamMembersStr ? JSON.parse(teamMembersStr) : [];

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      teamId: formData.get("teamId") as string,
      teamMembers: teamMembers, // Array of member IDs
      status: formData.get("status") as string,
      deadline: formData.get("deadline") as string,
    };

    console.log('Creating project with payload:', payload);

    createProject(payload, {
      onSuccess: (response: any) => {
        if (response?.data?.success) {
          toast.success('Project created successfully');
          closeModal();
        } else {
          toast.error(response?.data?.message || 'Failed to create project');
        }
      },
      onError: (error: any) => {
        toast.error(error?.message || 'An error occurred');
      }
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
        <NoData desc="No Projects Found!"/>
      ) : (
        <div className="mt-4 rounded-2xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Members</TableHead>
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
                    <div className="flex flex-wrap gap-1">
                      {project.teamMembers && project.teamMembers.length > 0 ? (
                        project.teamMembers.slice(0, 2).map((member: any) => (
                          <Tooltip key={member.userId?._id || member._id}>
                            <TooltipTrigger asChild>
                              <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                {member.userId?.username || member.username}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>{member.userId?.email || member.email}</TooltipContent>
                          </Tooltip>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">—</span>
                      )}
                      {project.teamMembers && project.teamMembers.length > 2 && (
                        <div className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-medium">
                          +{project.teamMembers.length - 2}
                        </div>
                      )}
                    </div>
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
                  <TableCell className="text-right">
                    <ProjectActions
                      projectId={project._id}
                      onView={handleView}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
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

interface ProjectActionsProps {
  projectId: string;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectActions: React.FC<ProjectActionsProps> = ({
  projectId,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onView(projectId)}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onEdit(projectId)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          className="text-red-600 focus:text-red-600"
          onClick={() => onDelete(projectId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
