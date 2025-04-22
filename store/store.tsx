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

export function useStore() {
  return {
    useStoreNotes,
    useStoreKanban,
  };
}
