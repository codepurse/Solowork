import { Canvas, Point } from "fabric";
import { useEffect } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

export default function useCanvasZoom(
  canvasRef: React.MutableRefObject<Canvas | null>
) {
  const { zoom, setZoom } = useWhiteBoardStore();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey || !canvasRef.current) return;

      e.preventDefault();
      const canvas = canvasRef.current;
      const delta = e.deltaY;
      const pointer = canvas.getPointer(e);
      const currentZoom = canvas.getZoom(); // 👈 get latest zoom directly

      let newZoom = currentZoom * (delta > 0 ? 0.9 : 1.1);
      newZoom = Math.max(0.1, Math.min(5, newZoom));

      canvas.zoomToPoint(new Point(pointer.x, pointer.y), newZoom);
      setZoom(newZoom); // optional if you want to track in store
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
    
      const zoomStep = 0.1;
      const currentZoom = canvas.getZoom();
      const center = new Point(canvas.getWidth() / 2, canvas.getHeight() / 2); // 👈 center of viewport
    
      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        const newZoom = Math.min(currentZoom + zoomStep, 5);
        canvas.zoomToPoint(center, newZoom); // 👈 use zoomToPoint for better experience
        setZoom(newZoom);
      } else if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        const newZoom = Math.max(currentZoom - zoomStep, 0.1);
        canvas.zoomToPoint(center, newZoom); // 👈 match behavior with wheel
        setZoom(newZoom);
      }
    };
    

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef, zoom, setZoom]);
}
