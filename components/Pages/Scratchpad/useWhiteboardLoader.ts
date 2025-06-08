import { Canvas } from "fabric";
import { useEffect } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

export const useWhiteboardLoader = (canvasRef: React.RefObject<Canvas>) => {
  const { selectedWhiteboard } = useWhiteBoardStore();

  useEffect(() => {
    if (!canvasRef.current || !selectedWhiteboard) return;

    // Load whiteboard data when selectedWhiteboard changes
    const loadWhiteboard = async () => {
      try {
        // Here you can implement loading logic for your whiteboard
        // For example, loading from localStorage or an API
        const savedData = JSON.parse(selectedWhiteboard.body);
        if (savedData) {
          canvasRef.current.loadFromJSON(savedData, () => {
            canvasRef.current?.renderAll();
          });
        }
      } catch (error) {
        console.error("Error loading whiteboard:", error);
      }
    };

    loadWhiteboard();
  }, [selectedWhiteboard]);
};
