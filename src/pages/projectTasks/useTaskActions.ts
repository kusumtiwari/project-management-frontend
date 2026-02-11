import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useTaskStore from "./useTaskStore";
import { request } from "@/utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "@/constants/APIEndpoints";
import { useEffect } from "react";
import type { APIResponse, ProjectMembersResponse, Task } from "@/types/project";


interface TeamMembersResponse {
  members: any[];
}

export const useFetchProjectTasks = (projectId?: string, status?: string) => {
  const setTaskList = useTaskStore((state:any) => state.setTaskList);

   const query:any = useQuery({
      queryKey: ["tasks-by-project", projectId, status],
      queryFn: () =>
        request(`${APIENDPOINTS.TASK}${projectId}${status ? `?status=${status}` : ""}`, {
          method: "GET",
          headers: getAPIAUTHHEADERS(),
        }),
      enabled: !!projectId,
      refetchOnWindowFocus: false,
    });
  
    useEffect(() => {
      if (query.status === "success" && query.data) {
        if(query?.data?.data){
          console.log(query?.data?.data,'task list from query')
          setTaskList(query?.data?.data?.data);
        }
      }
  
      if (query.isError) {
        const errorMessage =
          query.error?.message || "Error fetching tasks";
        console.error(query.error, "Error fetching tasks");
        toast.error(errorMessage);
      }
      
    }, [query.status, query.data, query.isError, query.isSuccess, setTaskList]);
  
    return query;
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      request(`${APIENDPOINTS.TASK}`, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-by-project"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { taskId: string; updates: any }) =>
      request(`${APIENDPOINTS.TASK}${payload.taskId}`, {
        method: "PUT",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(payload.updates),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-by-project"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      request(`${APIENDPOINTS.TASK}${taskId}`, {
        method: "DELETE",
        headers: getAPIAUTHHEADERS(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks-by-project"] });
    },
  });
};

export const useFetchProjectMembers = (projectId?: string) => {
  return useQuery<APIResponse<ProjectMembersResponse>>({
    queryKey: ["project-members", projectId],
    queryFn: () => request<ProjectMembersResponse>(`${APIENDPOINTS.PROJECTS}${projectId}/members`, { 
      method: "GET", 
      headers: getAPIAUTHHEADERS() 
    }),
    enabled: !!projectId,
    refetchOnWindowFocus: false,
  });
};

export const useFetchTeamMembers = (teamId?: string) => {
  return useQuery<APIResponse<TeamMembersResponse>>({
    queryKey: ["team-members", teamId],
    queryFn: () =>
      request<TeamMembersResponse>(`/api/teams/${teamId}/members`, {
        method: "GET",
        headers: getAPIAUTHHEADERS(),
      }),
    enabled: !!teamId, // only fetch if teamId exists
    refetchOnWindowFocus: false,
  });
};