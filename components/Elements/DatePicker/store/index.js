// dateStore.js
import dayjs from "dayjs";
import { createContext, useContext } from "react";
import { create } from "zustand";

// Factory function to create a new store instance
const createDateStore = () =>
  create((set, get) => ({
    format: "MM-DD-YYYY",
    date: dayjs().format("MM-DD-YYYY"),
    setDate: (date) => {
      const parsedDate = dayjs(date);
      const isValid = parsedDate.isValid();
      
      set({
        date: isValid ? parsedDate.format(get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY") : date,
        invalid: !isValid,
        format: get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY",
        validDate: isValid ? parsedDate.format(get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY") : get().validDate,
      });
    },
    setFormat: (newFormat) =>
      set((state) => ({
        format: newFormat,
        date: dayjs(state.date, state.format).format(newFormat),
      })),

    invalid: false,
    setInvalid: (invalid) => set({ invalid }),
    isOpen: false,
    setIsOpen: (isOpen) => set({ isOpen }),
    withTime: false,
    setWithTime: (withTime) => {
      set({ 
        withTime,
        format: withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY",
        date: dayjs(get().date).format(withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY")
      });
    },
    validDate: dayjs().format("MM-DD-YYYY"),
    setValidDate: (validDate) => set({ validDate }),
    doFormat: true,
    setDoFormat: (doFormat) => set({ doFormat }),
  }));

// Create a React context
const DateStoreContext = createContext(null);

// Provider component
export const DateStoreProvider = ({ children }) => {
  const store = createDateStore();
  return (
    <DateStoreContext.Provider value={store}>
      {children}
    </DateStoreContext.Provider>
  );
};

// Custom hook to use the store
export const useDateStore = () => {
  const store = useContext(DateStoreContext);
  if (!store) {
    throw new Error("useDateStore must be used within DateStoreProvider");
  }
  return store;
};

// You can still export the createDateStore function if you need a standalone store
export { createDateStore };

