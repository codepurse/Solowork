import { Canvas, TPointerEvent, TPointerEventInfo } from "fabric";
import { useEffect, useRef } from "react";

export default function useCanvasMove(
  canvasRef: React.MutableRefObject<Canvas | null>
) {
  const isSpacePressed = useRef(false);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = true;
        canvas.defaultCursor = "grab";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = false;
        isPanning.current = false;
        canvas.defaultCursor = "default";
      }
    };

    const getPointerPosition = (e: TPointerEvent) => {
      if ('clientX' in e) {
        return { x: e.clientX, y: e.clientY };
      }
      // Touch event
      if (e.touches && e.touches[0]) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
      return { x: 0, y: 0 };
    };

    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (isSpacePressed.current) {
        isPanning.current = true;
        const pos = getPointerPosition(opt.e);
        lastPos.current = pos;
        canvas.defaultCursor = "grabbing";
      }
    };

    const handleMouseMove = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (!isPanning.current || !canvasRef.current) return;

      const pos = getPointerPosition(opt.e);
      const dx = pos.x - lastPos.current.x;
      const dy = pos.y - lastPos.current.y;

      const vpt = canvasRef.current.viewportTransform;
      if (vpt) {
        vpt[4] += dx;
        vpt[5] += dy;
        canvasRef.current.requestRenderAll();
      }

      lastPos.current = pos;
    };

    const handleMouseUp = () => {
      isPanning.current = false;
      if (isSpacePressed.current) {
        canvas.defaultCursor = "grab";
      } else {
        canvas.defaultCursor = "default";
      }
    };

    // Add Fabric listeners
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);

    // Add global key listeners
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
      canvas.off("mouse:up", handleMouseUp);

      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [canvasRef]);
}
