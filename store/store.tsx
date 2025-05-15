import { create } from "zustand";

interface NotesStore {
  selectedNotes: string;
  setSelectedNotes: (notes: string) => void;
  hideSideNotes: boolean;
  setHideSideNotes: (hide: boolean) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
}

interface KanbanStore {
  selectedKanban: number;
  selectedKanbanId: string;
  showDrawerInfo: boolean;
  setShowDrawerInfo: (show: boolean) => void;
  setSelectedKanban: (kanban: number) => void;
  setSelectedKanbanId: (kanbanId: string) => void;
  drawerInfo: any;
  setDrawerInfo: (info: any) => void;
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

type SidebarStore = {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
};

const useStoreNotes = create<NotesStore>((set) => ({
  selectedNotes: null,
  setSelectedNotes: (notes: string) => set({ selectedNotes: notes }),
  hideSideNotes: false,
  setHideSideNotes: (hide: boolean) => set({ hideSideNotes: hide }),
  editMode: false,
  setEditMode: (edit: boolean) => set({ editMode: edit }),
}));

const useStoreKanban = create<KanbanStore>((set) => ({
  selectedKanban: 1,
  selectedKanbanId: "",
  setSelectedKanban: (kanban: number) => set({ selectedKanban: kanban }),
  setSelectedKanbanId: (kanbanId: string) =>
    set({ selectedKanbanId: kanbanId }),
  showDrawerInfo: false,
  setShowDrawerInfo: (show: boolean) => set({ showDrawerInfo: show }),
  drawerInfo: null,
  setDrawerInfo: (info: any) => set({ drawerInfo: info }),
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

const useStoreSidebar = create<SidebarStore>((set) => ({
  showSidebar: false,
  setShowSidebar: (show: boolean) => set({ showSidebar: show }),
}));

export function useStore() {
  return {
    useStoreNotes,
    useStoreKanban,
    useStoreProjects,
    useStoreUser,
    useStoreTasks,
    useStoreSidebar,
  };
}
