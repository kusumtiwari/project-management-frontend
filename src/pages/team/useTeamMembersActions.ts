import { useMutation, useQuery } from "@tanstack/react-query";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "@/constants/APIEndpoints";
import { request } from "@/utils/request";
import { toast } from "sonner";
import { handleAPIResponse } from "@/utils/handleAPIResponse";


export const useFetchTeamMembers = () => {
    return useQuery({
        queryKey: ["team-members"],
        queryFn: () =>
            request(`${APIENDPOINTS.TEAMSETUP}`, {
                method: "GET",
                headers: getAPIAUTHHEADERS(),
            }),
        refetchOnWindowFocus: false,
    });
};

export const useSendInvitation = () => {
  return useMutation({
    mutationFn: (data: any) =>
      request(`${APIENDPOINTS.INVITE_MEMBERS}`, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify(data),
      }),

    onSuccess: (response: any) => {
      const { status, message } = response;
      const result = handleAPIResponse(status, message);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};