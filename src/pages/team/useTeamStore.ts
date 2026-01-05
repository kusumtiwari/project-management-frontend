// stores/useTeamStore.ts
import { create } from "zustand";

type Team = {
  _id: string;
  name: string;
};

type TeamMember = {
  _id: string;
  username: string;
  email: string;
  role: string;
  roleId?: string;
  permissions: string[];
};

interface TeamStore {
  teams: Team[];
  teamMembers: TeamMember[];
  setTeams: (teams: Team[]) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  clearTeamMembers: () => void;
}

const useTeamStore = create<TeamStore>((set) => ({
  teams: [],
  teamMembers: [],

  setTeams: (teams) => set({ teams }),

  setTeamMembers: (members) => set({ teamMembers: members }),

  clearTeamMembers: () => set({ teamMembers: [] }),
}));

export default useTeamStore;
