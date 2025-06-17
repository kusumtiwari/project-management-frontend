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
      console.error(query.error, "Error fetching project list");
    }
  }, [query.status, query.data, query.isError, query.isSuccess, setProjects]);

  return query;
};