import { useMutation, useQuery } from "@tanstack/react-query";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "@/constants/APIEndpoints";
import { request } from "@/utils/request";
import { toast } from "sonner";
import { handleAPIResponse } from "@/utils/handleAPIResponse";
import { useSessionStore } from "@/session/useSessionStore";


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

export const useCreateTeam = (onSuccessCallback?: () => void) => {
  return useMutation({
    mutationFn: (data: { name: string }) =>
      request(`${APIENDPOINTS.TEAMSETUP}`, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify({ name: data.name }),
      }),

    onSuccess: (response: any) => {
      const status = response?.status;
      const message = response?.data?.message;
      const result = handleAPIResponse(status, message);
      if (result.success) {
        toast.success(result.message || "Team created");
        onSuccessCallback?.();
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};

export const useFetchMembersByTeam = (teamId?: string) => {
  return useQuery({
    queryKey: ["team-members", teamId],
    enabled: !!teamId,
    queryFn: () =>
      request(`${APIENDPOINTS.TEAMSETUP}${teamId}/members`, {
        method: "GET",
        headers: getAPIAUTHHEADERS(),
      }),
    refetchOnWindowFocus: false,
  });
};

export const useCreateTeamMember = (onSuccessCallback?: () => void) => {
  const profile = useSessionStore((s) => s.profile);
  const defaultTeamId = profile?.teams?.[0]?.teamId;
  return useMutation({
    mutationFn: (data: { username: string; email: string; password: string; roleId: string; teamId?: string }) =>
      request(`${APIENDPOINTS.CREATE_TEAM_MEMBER}`, {
        method: "POST",
        headers: getAPIAUTHHEADERS(),
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          roleId: data.roleId,
          teamId: data.teamId || defaultTeamId,
        }),
      }),

    onSuccess: (response: any) => {
      const status = response?.status;
      const message = response?.data?.message;
      const result = handleAPIResponse(status, message);
      if (result.success) {
        toast.success(result.message || 'Member created');
        onSuccessCallback?.();
      } else {
        toast.error(result.message);
      }
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });
};
