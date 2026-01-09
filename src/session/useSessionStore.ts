import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  username: string;
  email: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  userType?: 'superadmin' | 'admin' | 'member';
  hasCompletedSetup?: boolean;
  teams?: Array<{
    teamId: string;
    teamName: string;
    role: 'admin' | 'member';
    roleId?: string;
    permissions?: string[];
    joinedAt: string;
  }>;
}

interface SessionStoreState {
  token: string;
  profile: UserProfile | null;
  setToken: (token: string) => void;
  clearToken: () => void;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
  getPermissions: () => string[];
}

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set, get) => ({
      token: "",
      profile: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: "" }),
      setProfile: (profile: UserProfile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
      getPermissions: () => {
        const state = get();
        const profile = state.profile;
        if (!profile || !profile.teams || profile.teams.length === 0) {
          return [];
        }
        // Get permissions from first team (current team context)
        return profile.teams[0]?.permissions || [];
      },
    }),
    {
      name: "session-storage",
    }
  )
);
