// dateStore.js
import dayjs from "dayjs";
import { create } from "zustand";

const dateStore = create((set, get) => ({
  format: "MM-DD-YYYY",
  date: dayjs().format("MM-DD-YYYY"),
  setDate: (date, dontFormat) => {
    const parsedDate = dayjs(date);
    const isValid = parsedDate.isValid();
    set({
      date:
        isValid && !dontFormat
          ? parsedDate.format(
              get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY"
            )
          : date,
      invalid: !isValid,
      format: get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY",
      validDate: isValid
        ? parsedDate.format(
            get().withTime ? "MM-DD-YYYY hh:mm A" : "MM-DD-YYYY"
          )
        : get().validDate,
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
  setWithTime: (withTime) => set({ withTime }),
  validDate: dayjs().format("MM-DD-YYYY"),
  setValidDate: (validDate) => set({ validDate }),
  doFormat: true,
  setDoFormat: (doFormat) => set({ doFormat }),
}));

export default dateStore;
