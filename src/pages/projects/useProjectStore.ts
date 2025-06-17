import { create } from "zustand";

type Project = any; // You can replace `any` with a proper type later

interface ProjectStore {
  projectList: Project[];
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, updatedFields: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  clearProjects: () => void;
}

const useProjectStore = create<ProjectStore>((set) => ({
  projectList: [],

  // Replace the whole list

  setProjects: (projects) => set({ projectList: projects }),

  // Add one project
  addProject: (project) =>
    set((state) => ({ projectList: [...state.projectList, project] })),

  // Update project by ID
  updateProject: (id, updatedFields) =>
    set((state) => ({
      projectList: state.projectList.map((proj) =>
        proj.id === id ? { ...proj, ...updatedFields } : proj
      ),
    })),

  // Delete project by ID
  deleteProject: (id) =>
    set((state) => ({
      projectList: state.projectList.filter((proj) => proj.id !== id),
    })),

  // Clear all projects
  clearProjects: () => set({ projectList: [] }),
}));

export default useProjectStore;
