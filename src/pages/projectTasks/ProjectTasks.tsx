import React from "react";
import Header from "@/components/elements/heading/Header";
import { Button } from "@/components/ui/button";
import ModalForm from "@/components/ui/ModalForm";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import { AddTaskFormFields } from "./AddTaskFormFields";
import { useFetchProjectTasks, useCreateTask, useUpdateTask } from "./useTaskActions";
import NoData from "@/components/elements/no-data/NoData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useParams } from "react-router-dom";
import useTaskStore from "./useTaskStore";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import KanbanBoard from "./KanbanBoard";
import { useState } from "react";
import { useSessionStore } from "@/session/useSessionStore";
import { useFetchMembersByTeam } from "@/pages/team/useTeamMembersActions";

const ProjectTasks: React.FC = () => {
  const { id: projectId } = useParams(); // Get projectId from URL like /projects/tasks/:id
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();

  // hooks for fetching + creating + updating
  useFetchProjectTasks(projectId);
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  // const { taskList } = useFetchProjectTasks(projectId);
 const taskList = useTaskStore((state:any) => state.taskList)
  console.log(taskList,'task list here')

  const [view, setView] = useState<"table" | "board">("table");
  const [editing, setEditing] = useState<any | null>(null);
  const profile = useSessionStore((s:any) => s.profile);
  const teamId = profile?.teams?.[0]?.teamId;
  const membersQuery:any = useFetchMembersByTeam(teamId);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      title: string;
      description?: string;
      deadline?: string;
      assignedTo?: string;
      status?: string;
    };

    const newTask = {
      ...data,
      project: projectId,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
    };

    createTask(newTask, {
      onSuccess: (response: any) => {
        console.log(response,'response')
        if (response?.data?.success) {
          toast.success(response?.data?.message);
          closeModal();
        } else {
          toast.error(response?.data?.message);
        }
      },
    });
  };

  return (
    <div>
      <Header
        text="Tasks"
        rightContent={
          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-md border overflow-hidden">
              <button
                type="button"
                onClick={() => setView("table")}
                className={`px-3 py-1 text-sm ${view === "table" ? "bg-black text-white" : "bg-white"}`}
              >
                Table
              </button>
              <button
                type="button"
                onClick={() => setView("board")}
                className={`px-3 py-1 text-sm ${view === "board" ? "bg-black text-white" : "bg-white"}`}
              >
                Board
              </button>
            </div>
            <Button onClick={openModal} variant="default" size="sm">
              Add Task
            </Button>
          </div>
        }
      />

      {taskList?.length === 0 ? (
        <NoData />
      ) : view === "table" ? (
        <div className="mt-4 rounded-2xl border bg-white shadow-sm dark:bg-neutral-900 dark:border-neutral-800">
          <Table className="text-gray-900 dark:text-gray-100">
            <TableHeader>
              <TableRow className="dark:hover:bg-neutral-900">
                <TableHead className="dark:text-gray-300">Title</TableHead>
                <TableHead className="dark:text-gray-300">Status</TableHead>
                <TableHead className="dark:text-gray-300">Deadline</TableHead>
                <TableHead className="dark:text-gray-300">Assigned To</TableHead>
                <TableHead className="dark:text-gray-300">Created At</TableHead>
                <TableHead className="dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taskList?.map((task: any) => (
                <TableRow key={task._id} className="dark:hover:bg-neutral-800/60">
                  <TableCell className="font-medium dark:text-gray-100">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          task.status === "done"
                            ? "success"
                            : task.status === "in-progress" || task.status === "review"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {task.status}
                      </Badge>
                      <Select
                        defaultValue={task.status}
                        onValueChange={(value) =>
                          updateTask({ taskId: task._id, updates: { status: value } })
                        }
                      >
                        <SelectTrigger className="h-8 w-[150px]">
                          <SelectValue placeholder="Change status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="backlog">Backlog</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="deployed">Deployed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {task.assignedTo?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="dark:border-neutral-700 dark:text-gray-200" onClick={() => setEditing(task)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-4">
          <KanbanBoard
            tasks={taskList}
            onMove={(taskId, newStatus) => updateTask({ taskId, updates: { status: newStatus } })}
            onCardClick={(t:any) => setEditing(t)}
          />
        </div>
      )}

      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Add New Task"
        submitHandler={submitHandler}
      >
        <AddTaskFormFields />
      </ModalForm>

      {/* Edit Task Modal */}
      <ModalForm
        open={!!editing}
        onOpenChange={(open:boolean) => { if (!open) setEditing(null); }}
        formTitle={editing ? `Edit Task: ${editing.title}` : 'Edit Task'}
        submitHandler={(e) => {
          e.preventDefault();
          if (!editing) return;
          const fd = new FormData(e.currentTarget as HTMLFormElement);
          const updates:any = {
            title: String(fd.get('title') || editing.title).trim(),
            description: String(fd.get('description') || editing.description || ''),
            status: String(fd.get('status') || editing.status),
            deadline: fd.get('deadline') ? new Date(String(fd.get('deadline'))) : editing.deadline,
            tags: String(fd.get('tags') || '').split(',').map(t=>t.trim()).filter(Boolean),
            assignedTo: String(fd.get('assignedTo') || '') || undefined,
          };
          updateTask({ taskId: editing._id, updates }, { onSuccess: () => setEditing(null) });
        }}
      >
        {editing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input id="title" name="title" defaultValue={editing.title} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea id="description" name="description" defaultValue={editing.description} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select id="status" name="status" defaultValue={editing.status} className="w-full border rounded px-3 py-2">
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="deployed">Deployed</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                <input id="deadline" name="deadline" type="date" defaultValue={editing.deadline ? new Date(editing.deadline).toISOString().slice(0,10) : ''} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
              <input id="tags" name="tags" defaultValue={(editing.tags || []).join(', ')} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">Assignee</label>
              <select id="assignedTo" name="assignedTo" defaultValue={editing.assignedTo?._id || ''} className="w-full border rounded px-3 py-2">
                <option value="">Unassigned</option>
                {membersQuery?.data?.data?.data?.map((m:any) => (
                  <option key={m._id} value={m._id}>{m.username} ({m.email})</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </ModalForm>
    </div>
  );
};

export default ProjectTasks;
