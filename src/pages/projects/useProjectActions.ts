import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { request } from "../../utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "../../constants/APIEndpoints";
import { toast } from "sonner";
import useProjectStore from "./useProjectStore";
export const useFetchProjectList = () => {
  const { setProjects } = useProjectStore();

  const query:any = useQuery({
    queryKey: ["project-list"],
    queryFn: () =>
      request(`${APIENDPOINTS.PROJECTS}`, {
        method: "GET",
        headers: getAPIAUTHHEADERS(),
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.status === "success" && query.data) {
      if(query?.data?.data){
        setProjects(query?.data?.data); // Set project list in Zustand
      }
    }

    if (query.isError) {
      const errorMessage =
        query.error?.message || "Error fetching project list";
      console.error(query.error, "Error fetching project list");
      toast.error(errorMessage);
    }
    
  }, [query.status, query.data, query.isError, query.isSuccess, setProjects]);

  return query;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      request(`${APIENDPOINTS.PROJECTS}`, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-list"] });
    },
  });
};