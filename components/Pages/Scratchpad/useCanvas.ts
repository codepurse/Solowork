import { Canvas, PencilBrush } from "fabric";
import { useEffect } from "react";

export default function useCanvas({
  canvasRef,
}: {
  canvasRef: React.RefObject<Canvas>;
}) {
  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new Canvas("drawing-canvas", {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight - 60, // leave room for toolbar
    });
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvasRef.current = canvas;

    // Delete key listener (object-level delete)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
