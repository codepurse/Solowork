import { Canvas, Point } from "fabric";
import { useEffect } from "react";

export default function useCanvasZoom(
  canvasRef: React.MutableRefObject<Canvas | null>
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey || !canvasRef.current) return;

      e.preventDefault();
      const delta = e.deltaY;
      const zoom = canvasRef.current.getZoom();
      const pointer = canvasRef.current.getPointer(e);

      let newZoom = zoom * (delta > 0 ? 0.9 : 1.1);
      newZoom = Math.max(0.1, Math.min(5, newZoom));

      canvasRef.current.zoomToPoint(new Point(pointer.x, pointer.y), newZoom);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!canvasRef.current) return;

      const zoomStep = 0.1;
      let zoom = canvasRef.current.getZoom();

      if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
        e.preventDefault();
        zoom = Math.min(zoom + zoomStep, 5);
        canvasRef.current.setZoom(zoom);
      } else if (e.ctrlKey && e.key === "-") {
        e.preventDefault();
        zoom = Math.max(zoom - zoomStep, 0.1);
        canvasRef.current.setZoom(zoom);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef]);
}
