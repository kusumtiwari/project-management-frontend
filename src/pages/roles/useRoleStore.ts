import { create } from "zustand";

// ----- TYPES -----
export interface Role {
  _id?: string;
  roleName: string;
  permissions: string[];
}

interface RoleStore {
  permissions: string[];
  roles: Role[];

  // Setters
  setPermissions: (permissions: string[]) => void;
  setRoles: (roles: Role[]) => void;

  // Actions
  addRole: (role: Role) => void;
  updateRole: (updatedRole: Role) => void;
  deleteRole: (roleId: string) => void;
}

// ----- STORE -----
const useRoleStore = create<RoleStore>((set) => ({
  permissions: [],
  roles: [],

  setPermissions: (permissions) => set({ permissions }),
  setRoles: (roles) => set({ roles }),

  addRole: (role) =>
    set((state) => ({
      roles: [...state.roles, role],
    })),

  updateRole: (updatedRole) =>
    set((state) => ({
      roles: state.roles.map((r) =>
        r._id === updatedRole._id ? updatedRole : r
      ),
    })),

  deleteRole: (roleId) =>
    set((state) => ({
      roles: state.roles.filter((r) => r._id !== roleId),
    })),
}));

export default useRoleStore;
