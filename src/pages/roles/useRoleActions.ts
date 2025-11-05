import { useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { request } from "@/utils/request";
import { APIENDPOINTS, getAPIAUTHHEADERS } from "@/constants/APIEndpoints";
import useRoleStore from "./useRoleStore";

export const useFetchPermissionList = () => {
  const setPermissions = useRoleStore((state:any) => state.setPermissions);

  const query = useQuery({
    queryKey: ["permission-list"],
    queryFn: () =>
      request(APIENDPOINTS.PERMISSION_LIST, {
        method: "GET",
        headers: getAPIAUTHHEADERS(),
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const payload: any = query.data.data;
      const list = payload?.permissions || payload || [];
      if (Array.isArray(list)) {
        setPermissions(list);
      } else {
        setPermissions([]);
      }
    }

    if (query.isError) {
      const errorMessage = query.error?.message || "Error fetching permissions";
      console.error("Permission fetch error:", query.error);
      toast.error(errorMessage);
    }
  }, [query.status, query.data, query.isError, setPermissions]);

  return query;
};

export const useUpdateRole = () => {
  const updateRole = useRoleStore((s:any) => s.updateRole);
  return useMutation({
    mutationFn: async (payload: { id: string; roleName: string; permissions: string[] }) => {
      return await request(`${APIENDPOINTS.ROLE}${payload.id}`, {
        method: 'PUT',
        headers: { ...getAPIAUTHHEADERS(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleName: payload.roleName, permissions: payload.permissions }),
      });
    },
    onSuccess: (res:any) => {
      const role = res?.data?.data;
      if (role) {
        updateRole(role);
        toast.success('Role updated');
      }
    },
    onError: (e:any) => toast.error(e?.message || 'Failed to update role'),
  });
};

export const useDeleteRole = () => {
  const deleteRole = useRoleStore((s:any) => s.deleteRole);
  return useMutation({
    mutationFn: async (id: string) => {
      return await request(`${APIENDPOINTS.ROLE}${id}`, {
        method: 'DELETE',
        headers: getAPIAUTHHEADERS(),
      });
    },
    onSuccess: (_res:any, id:string) => {
      deleteRole(id);
      toast.success('Role deleted');
    },
    onError: (e:any) => toast.error(e?.message || 'Failed to delete role'),
  });
};

export const useFetchRoles = () => {
  const setRoles = useRoleStore((state:any) => state.setRoles);
  const query = useQuery({
    queryKey: ["roles-list"],
    queryFn: () =>
      request(APIENDPOINTS.ROLE, {
        method: "GET",
        headers: getAPIAUTHHEADERS(),
      }),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const payload: any = query.data.data;
      const list = payload?.data || payload || [];
      if (Array.isArray(list)) setRoles(list);
    }
  }, [query.status, query.data, setRoles]);

  return query;
};

export const useCreateRole = () => {
  const addRole = useRoleStore((state:any) => state.addRole);

  return useMutation({
    mutationFn: async (payload: {
      roleName: string;
      permissions: string[];
    }) => {
      return await request(APIENDPOINTS.ROLE, {
        method: "POST",
        headers: {
          ...getAPIAUTHHEADERS(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (res: any) => {
      if (res?.data?.data) {
        addRole(res.data.data);
        toast.success("Role created successfully!");
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "Error creating role";
      console.error("Role creation error:", error);
      toast.error(errorMessage);
    },
  });
};
