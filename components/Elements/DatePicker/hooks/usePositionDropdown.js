import { useEffect } from "react";

export default function usePositionDropdown({
  isOpen,
  calendarRef,
  dateCmpRef,
  setPosition,
}) {
  useEffect(() => {
    if (isOpen && calendarRef.current && dateCmpRef.current) {
      const calendar = calendarRef.current.getBoundingClientRect();
      const input = dateCmpRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const spaceBelow = viewportHeight - input.bottom;
      const calendarHeight = calendar.height;

      setPosition(
        spaceBelow < calendarHeight ? "top-position" : "bottom-position"
      );
    }
  }, [isOpen]);
}
