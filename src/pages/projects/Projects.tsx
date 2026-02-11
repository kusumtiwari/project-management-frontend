import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../components/elements/no-data/NoData";
import {
  useFetchProjectList,
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from "./useProjectActions";
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
import { Eye, Edit, Trash2 } from "lucide-react";
import { useFetchTeamMembers } from "../team/useTeamMembersActions";
import { useSessionStore } from "@/session/useSessionStore";
import ConfirmDialog from "@/components/ui/confirm-dialog";
const Projects: React.FC = () => {
  useFetchProjectList();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editProject, setEditProject] = useState<any | null>(null);
  const projectList = useProjectStore((state) => state.projectList);
  const { mutate: createProject } = useCreateProject();

  const { isOpen, openModal, closeModal, setIsOpen } = useModal();
  const navigate = useNavigate();

  const { data: teamsResp, refetch: refetchTeams } = useFetchTeamMembers();
  const teams = useMemo(
    () => (teamsResp as any)?.data?.data || [],
    [teamsResp],
  );

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: updateProject, isPending: isUpdating } = useUpdateProject();

  console.log(teams, "teams here");

  // Check if user is admin
  const profile = useSessionStore((state: any) => state.profile);
  const isAdmin = profile?.isAdmin === true || profile?.userType === "admin";

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  try {
    const teamsStr = formData.get("teams") as string;

    const payload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      teams: teamsStr ? JSON.parse(teamsStr) : [],
      status: formData.get("status") as string,
      priority: formData.get("priority") as string,
      deadline: formData.get("deadline") as string,
    };

    if (editProject) {
      // UPDATE
      updateProject(
        { id: editProject._id, updates:payload },
        {
          onSuccess: () => {
            toast.success("Project updated successfully");
            setEditProject(null);
            closeModal();
          },
          onError: (error: any) => {
            toast.error(error?.message || "Failed to update project");
          },
        }
      );
    } else {
      // CREATE
      createProject(payload, {
        onSuccess: (response: any) => {
          if (response?.data?.success) {
            toast.success("Project created successfully");
            closeModal();
          } else {
            toast.error(response?.data?.message || "Failed to create project");
          }
        },
        onError: (error: any) => {
          toast.error(error?.message || "An error occurred");
        },
      });
    }
  } catch (err) {
    toast.error("Invalid form data");
  }
};


  const handleView = (id: string) => navigate(`/projects/tasks/${id}`);
  const handleEdit = (id: string) => {
  const project = projectList.find((p: any) => p._id === id);
  if (!project) return;

  setEditProject(project);
  openModal();
};

  const handleDelete = (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirmed) return;

    deleteProject(id, {
      onSuccess: () => {
        toast.success("Project deleted successfully");
      },
      onError: (error: any) => {
        toast.error(error?.message || "Failed to delete project");
      },
    });
  };

  return (
    <div>
      <Header
        text={isAdmin ? "Projects" : "Projects"}
        subtext={isAdmin ? undefined : "Projects You Are Part Of"}
        rightContent={
          isAdmin ? (
            <Button onClick={openModal} variant="primary" size="sm">
              Add Project
            </Button>
          ) : undefined
        }
      />

      {/* Project Table Section */}
      {projectList?.length === 0 ? (
        <NoData desc="No Projects Found!" />
      ) : (
        <div className="mt-4 rounded-2xl border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                {isAdmin && <TableHead>Teams</TableHead>}
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
                  {isAdmin && (
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.teams && project.teams.length > 0 ? (
                          project.teams.map((team: any) => (
                            <Badge key={team._id} variant="outline">
                              {team.teamId?.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </div>
                    </TableCell>
                  )}

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
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(project._id)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(project._id)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(project._id)}
                            title="Delete"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
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
  onOpenChange={(val) => {
    setIsOpen(val);
    if (!val) setEditProject(null);
  }}
  formTitle={editProject ? "Edit Project" : "Add New Project"}
  submitHandler={submitHandler}
>
  <AddProjectFormFields
    defaultValues={editProject}
  />
</ModalForm>


      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Project"
        description="This will permanently delete the project and its tasks."
        confirmText="Delete"
        destructive
        loading={isDeleting}
        onConfirm={() => {
          if (!deleteId) return;

          deleteProject(deleteId, {
            onSuccess: () => {
              toast.success("Project deleted successfully");
              setDeleteId(null);
            },
            onError: (error: any) => {
              toast.error(error?.message || "Failed to delete project");
            },
          });
        }}
      />
    </div>
  );
};

export default Projects;
