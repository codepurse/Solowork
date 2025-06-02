import { create } from "zustand";

interface NotesStore {
  selectedNotes: any;
  setSelectedNotes: (notes: any) => void;
  hideSideNotes: boolean;
  setHideSideNotes: (hide: boolean) => void;
  editMode: boolean;
  setEditMode: (edit: boolean) => void;
  notesFolders: any[];
  setNotesFolders: (folders: any[]) => void;
}

interface KanbanStore {
  selectedKanban: string;
  selectedKanbanId: string;
  showDrawerInfo: boolean;
  setShowDrawerInfo: (show: boolean) => void;
  setSelectedKanban: (kanban: string) => void;
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

interface ToastStore {
  showToast: boolean;
  setShowToast: (show: boolean) => void;
  toastType: string;
  setToastType: (type: string) => void;
  toastMessage: string;
  setToastMessage: (message: string) => void;
  toastTitle: string;
  setToastTitle: (title: string) => void;
}

interface NoteSettingsStore {
  noteSettings: any;
  setNoteSettings: (noteSettings: any) => void;
}

const useStoreNotes = create<NotesStore>((set) => ({
  selectedNotes: null,
  setSelectedNotes: (notes: any) => set({ selectedNotes: notes }),
  hideSideNotes: false,
  setHideSideNotes: (hide: boolean) => set({ hideSideNotes: hide }),
  editMode: false,
  setEditMode: (edit: boolean) => set({ editMode: edit }),
  notesFolders: [],
  setNotesFolders: (folders: any[]) => set({ notesFolders: folders }),
}));

const useStoreKanban = create<KanbanStore>((set) => ({
  selectedKanban: "kanban",
  selectedKanbanId: "",
  setSelectedKanban: (kanban: string) => set({ selectedKanban: kanban }),
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
  showSidebar: true,
  setShowSidebar: (show: boolean) => set({ showSidebar: show }),
}));

const useStoreToast = create<ToastStore>((set) => ({
  showToast: false,
  setShowToast: (show: boolean) => set({ showToast: show }),
  toastType: "success",
  setToastType: (type: string) => set({ toastType: type }),
  toastTitle: "",
  setToastTitle: (title: string) => set({ toastTitle: title }),
  toastMessage: "",
  setToastMessage: (message: string) => set({ toastMessage: message }),
}));

const useNoteSettings = create<NoteSettingsStore>((set) => ({
  noteSettings: {
    hideBanner: false,
    spellCheck: false,
    autoSave: false,
    focusMode: false,
    showFooter: false,
    readOnly: false,
  },
  setNoteSettings: (noteSettings: any) => set({ noteSettings: noteSettings }),
}));

export function useStore() {
  return {
    useStoreNotes,
    useStoreKanban,
    useStoreProjects,
    useStoreUser,
    useStoreTasks,
    useStoreSidebar,
    useStoreToast,
    useNoteSettings,
  };
}
