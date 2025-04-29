import { create } from "zustand";

interface NotesStore {
  selectedNotes: any[];
  setSelectedNotes: (notes: any[]) => void;
  hideSideNotes: boolean;
  setHideSideNotes: (hide: boolean) => void;
}

interface KanbanStore {
  selectedKanban: number;
  setSelectedKanban: (kanban: number) => void;
}

interface ProjectsStore {
  projects: any[];
  setProjects: (projects: any[]) => void;
  selectedProject: any;
  setSelectedProject: (project: any) => void;
}

interface UserStore {
  user: any;
  setUser: (user: any) => void;
}

interface TasksStore {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
}

const useStoreNotes = create<NotesStore>((set) => ({
  selectedNotes: [],
  setSelectedNotes: (notes: any[]) => set({ selectedNotes: notes }),
  hideSideNotes: false,
  setHideSideNotes: (hide: boolean) => set({ hideSideNotes: hide }),
}));

const useStoreKanban = create<KanbanStore>((set) => ({
  selectedKanban: 1,
  setSelectedKanban: (kanban: number) => set({ selectedKanban: kanban }),
}));

const useStoreProjects = create<ProjectsStore>((set) => ({
  selectedProject: null,
  setSelectedProject: (project: any) => set({ selectedProject: project }),
  projects: [],
  setProjects: (projects: any[]) => set({ projects: projects }),
}));

const useStoreUser = create<UserStore>((set) => ({
  user: null,
  setUser: (user: any) => set({ user: user }),
}));

const useStoreTasks = create<TasksStore>((set) => ({
  tasks: [],
  setTasks: (tasks: any[]) => set({ tasks: tasks }),
}));

export function useStore() {
  return {
    useStoreNotes,
    useStoreKanban,
    useStoreProjects,
    useStoreUser,
    useStoreTasks,
  };
}
