import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserProfile {
  username: string;
  email: string;
  isAdmin?: boolean;
  teams?: Array<{
    teamId: string;
    teamName: string;
    role: 'admin' | 'member';
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
}

export const useSessionStore = create<SessionStoreState>()(
  persist(
    (set) => ({
      token: "",
      profile: null,
      setToken: (token: string) => set({ token }),
      clearToken: () => set({ token: "" }),
      setProfile: (profile: UserProfile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "session-storage",
    }
  )
);
