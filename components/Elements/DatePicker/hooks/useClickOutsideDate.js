import dayjs from "dayjs";
import { useEffect } from "react";
import dateStore from "../store";

export default function useClickOutsideDate({ dateCmpRef }) {
  const { isOpen, setIsOpen, date, setDate, format, setDoFormat, validDate } =
    dateStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dateCmpRef.current && !dateCmpRef.current.contains(event.target)) {
        setIsOpen(false);
        const parsedDate = dayjs(date);
        const isValid = parsedDate.isValid();
        const validFormat = dayjs(date, format, true).isValid();
        if ((isValid && !validFormat) || !isValid) {
          setDate(validDate);
          setDoFormat(true);
        } else if (isValid) {
          setDate(date, false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, date]);
}
