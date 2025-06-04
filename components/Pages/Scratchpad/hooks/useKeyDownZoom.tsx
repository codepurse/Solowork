import { Dispatch, SetStateAction, useEffect } from "react";

export default function useKeyDownZoom(
  setScale: Dispatch<SetStateAction<number>>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === "=" || e.key === "+") {
          e.preventDefault();
          setScale((prev) => Math.min(prev * 1.1, 5));
        } else if (e.key === "-") {
          e.preventDefault();
          setScale((prev) => Math.max(prev / 1.1, 0.1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
