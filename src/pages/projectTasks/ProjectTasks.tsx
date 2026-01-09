import React from "react";
import Header from "@/components/elements/heading/Header";
import { Button } from "@/components/ui/button";
import ModalForm from "@/components/ui/ModalForm";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import { AddTaskFormFields } from "./AddTaskFormFields";
import { useFetchProjectTasks, useCreateTask, useUpdateTask, useFetchProjectMembers } from "./useTaskActions";
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
import KanbanBoard, { type TaskItem } from "./KanbanBoard";

import { useState } from "react";
import { useSessionStore } from "@/session/useSessionStore";

// Type definitions for better TypeScript support
interface ProjectMember {
  _id: string;
  username: string;
  email: string;
  role?: string;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "backlog" | "in-progress" | "review" | "done" | "deployed" | "blocked";
  deadline?: string;
  assignedTo?: {
    _id: string;
    username: string;
    email: string;
    name?: string;
  };
  createdAt: string;
  tags?: string[];
  priority?: "low" | "medium" | "high" | "urgent";
}

const ProjectTasks: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const { isOpen, openModal, closeModal, setIsOpen } = useModal();

  // hooks for fetching + creating + updating
  useFetchProjectTasks(projectId);
  const { mutate: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();
  
  const taskList = useTaskStore((state: any) => state.taskList) as Task[];
  console.log(taskList, 'task list here');

  const [view, setView] = useState<"table" | "board">("table");
  const [editing, setEditing] = useState<Task | null>(null);
  const profile = useSessionStore((s: any) => s.profile);
  
  // Fetch project members with proper typing
  const membersQuery = useFetchProjectMembers(projectId);
  
  // Extract members with proper null checking and type assertion
  const projectMembers: ProjectMember[] = React.useMemo(() => {
    try {
      // Handle the nested response structure
      const response = membersQuery?.data as any;
      
      console.log('Raw members response:', response);
      
      if (!response?.data?.data?.members) {
        console.log('No members found in response');
        return [];
      }
      
      const members = response.data.data.members;
      console.log('Extracted members:', members);
      
      return Array.isArray(members) ? members : [];
    } catch (error) {
      console.error('Error extracting project members:', error);
      return [];
    }
  }, [membersQuery]);

  console.log('Final project members:', projectMembers);

  // Transform tasks for KanbanBoard compatibility
  const transformedTasks: TaskItem[] = React.useMemo(() => {
    return taskList.map(task => ({
      _id: task._id,
      title: task.title,
      description: task.description,
      status: task.status as "backlog" | "in-progress" | "review" | "done" | "deployed" | "blocked",
      deadline: task.deadline,
      priority: task.priority,
      assignedTo: task.assignedTo ? {
        name: task.assignedTo.username || task.assignedTo.name
      } : undefined
    }));
  }, [taskList]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      title: string;
      description?: string;
      deadline?: string;
      assignedTo?: string;
      status?: string;
      priority?: string;
      tags?: string;
    };

    const newTask = {
      ...data,
      project: projectId,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
    };

    createTask(newTask, {
      onSuccess: (response: any) => {
        console.log(response, 'response');
        if (response?.data?.success) {
          toast.success(response?.data?.message || 'Task created successfully');
          closeModal();
        } else {
          toast.error(response?.data?.message || 'Failed to create task');
        }
      },
      onError: (error: any) => {
        console.error('Task creation error:', error);
        toast.error('Failed to create task');
      }
    });
  };

  const handleTaskEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    
    const fd = new FormData(e.currentTarget);
    const updates: any = {
      title: String(fd.get('title') || editing.title).trim(),
      description: String(fd.get('description') || editing.description || ''),
      status: String(fd.get('status') || editing.status),
      deadline: fd.get('deadline') ? new Date(String(fd.get('deadline'))) : editing.deadline,
      tags: String(fd.get('tags') || '').split(',').map(t => t.trim()).filter(Boolean),
      assignedTo: String(fd.get('assignedTo') || '') || undefined,
    };
    
    updateTask({ taskId: editing._id, updates }, { 
      onSuccess: () => {
        setEditing(null);
        toast.success('Task updated successfully');
      },
      onError: () => {
        toast.error('Failed to update task');
      }
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
              {taskList?.map((task: Task) => (
                <TableRow key={task._id} className="dark:hover:bg-neutral-800/60">
                  <TableCell className="font-medium dark:text-gray-100">{task.title}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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
                    {task.assignedTo ? (
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {task.assignedTo.username || task.assignedTo.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {task.assignedTo.email}
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-500 italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="dark:text-gray-200">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="dark:border-neutral-700 dark:text-gray-200" 
                      onClick={() => setEditing(task)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="mt-4">
          <KanbanBoard
            tasks={transformedTasks}
            onMove={(taskId, newStatus) => updateTask({ taskId, updates: { status: newStatus } })}
            onCardClick={(kanbanTask) => {
              // Find the original task from taskList to maintain full data
              const originalTask = taskList.find(t => t._id === kanbanTask._id);
              if (originalTask) {
                setEditing(originalTask);
              }
            }}
          />
        </div>
      )}

      <ModalForm
        open={isOpen}
        onOpenChange={setIsOpen}
        formTitle="Add New Task"
        submitHandler={submitHandler}
      >
        <AddTaskFormFields projectId={projectId} />
      </ModalForm>

      {/* Edit Task Modal */}
      <ModalForm
        open={!!editing}
        onOpenChange={(open: boolean) => { if (!open) setEditing(null); }}
        formTitle={editing ? `Edit Task: ${editing.title}` : 'Edit Task'}
        submitHandler={handleTaskEdit}
      >
        {editing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <input 
                id="title" 
                name="title" 
                defaultValue={editing.title} 
                className="w-full border rounded px-3 py-2"
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <textarea 
                id="description" 
                name="description" 
                defaultValue={editing.description || ''} 
                className="w-full border rounded px-3 py-2 h-20"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">Status</label>
                <select 
                  id="status" 
                  name="status" 
                  defaultValue={editing.status} 
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                  <option value="deployed">Deployed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium">Deadline</label>
                <input 
                  id="deadline" 
                  name="deadline" 
                  type="date" 
                  defaultValue={editing.deadline ? new Date(editing.deadline).toISOString().slice(0, 10) : ''} 
                  className="w-full border rounded px-3 py-2" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags (comma separated)</label>
              <input 
                id="tags" 
                name="tags" 
                defaultValue={(editing.tags || []).join(', ')} 
                className="w-full border rounded px-3 py-2" 
                placeholder="bug, ui, urgent"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="assignedTo" className="text-sm font-medium">Assignee</label>
              <select 
                id="assignedTo" 
                name="assignedTo" 
                defaultValue={editing.assignedTo?._id || ''} 
                className="w-full border rounded px-3 py-2"
              >
                <option value="">Unassigned</option>
                {projectMembers.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.username} ({member.email})
                  </option>
                ))}
              </select>
              {projectMembers.length === 0 && (
                <p className="text-xs text-gray-500">
                  No project members available. Members need to be assigned to the project first.
                </p>
              )}
            </div>
          </div>
        )}
      </ModalForm>
    </div>
  );
};

export default ProjectTasks;