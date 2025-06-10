import * as fabric from "fabric";
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
      const currentZoom = canvas.getZoom();

      let newZoom = currentZoom * (delta > 0 ? 0.9 : 1.1);
      newZoom = Math.max(0.1, Math.min(5, newZoom));

      canvas.setViewportTransform([
        newZoom,
        0,
        0,
        newZoom,
        canvas.viewportTransform![4],
        canvas.viewportTransform![5]
      ]);
      canvas.zoomToPoint(new Point(pointer.x, pointer.y), newZoom);
      canvas.requestRenderAll();
      setZoom(newZoom);
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let lastDistance = 0;
    let wasSelectionEnabled = canvas.selection;

    const getTouchDistance = (touches: TouchList) => {
      const [touch1, touch2] = [touches[0], touches[1]];
      const dx = touch2.clientX - touch1.clientX;
      const dy = touch2.clientY - touch1.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const getTouchMidpoint = (touches: TouchList) => {
      const [touch1, touch2] = [touches[0], touches[1]];
      return new fabric.Point(
        (touch1.clientX + touch2.clientX) / 2,
        (touch1.clientY + touch2.clientY) / 2
      );
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2) return;

      e.preventDefault();

      // Disable selection during pinch
      canvas.selection = false;

      const currentDistance = getTouchDistance(e.touches);
      if (!lastDistance) {
        lastDistance = currentDistance;
        return;
      }

      const canvasZoom = canvas.getZoom();
      const scale = currentDistance / lastDistance;
      let newZoom = canvasZoom * scale;
      newZoom = Math.max(0.1, Math.min(5, newZoom));

      const center = getTouchMidpoint(e.touches);
      canvas.zoomToPoint(center, newZoom);
      setZoom(newZoom);

      lastDistance = currentDistance;
    };

    const resetZoomTouch = () => {
      lastDistance = 0;
      canvas.selection = wasSelectionEnabled; // Restore selection
    };

    canvas.upperCanvasEl.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    canvas.upperCanvasEl.addEventListener("touchend", resetZoomTouch);
    canvas.upperCanvasEl.addEventListener("touchcancel", resetZoomTouch);

    return () => {
      canvas.upperCanvasEl.removeEventListener("touchmove", handleTouchMove);
      canvas.upperCanvasEl.removeEventListener("touchend", resetZoomTouch);
      canvas.upperCanvasEl.removeEventListener("touchcancel", resetZoomTouch);
    };
  }, [canvasRef, setZoom]);
}
