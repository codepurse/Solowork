import { create } from "zustand";

interface Store {
  selectedNotes: any[];
  setSelectedNotes: (notes: any[]) => void;
  hideSideNotes: boolean;
  setHideSideNotes: (hide: boolean) => void;
}

const useStoreNotes = create<Store>((set) => ({
  selectedNotes: [],
  setSelectedNotes: (notes: any[]) => set({ selectedNotes: notes }),
  hideSideNotes: false,
  setHideSideNotes: (hide: boolean) => set({ hideSideNotes: hide }),
}));

export default useStoreNotes;
