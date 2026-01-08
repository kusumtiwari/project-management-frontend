import { create } from "zustand";

const useTaskStore = create((set) => ({
  taskList: [],
  setTaskList: (tasks: any[]) => set({ taskList: tasks }),
}));

export default useTaskStore;
