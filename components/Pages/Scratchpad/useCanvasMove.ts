import { Canvas, TPointerEvent, TPointerEventInfo } from "fabric";
import { useEffect, useRef } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

export default function useCanvasMove(
  canvasRef: React.MutableRefObject<Canvas | null>,
  tool: string
) {
  const isSpacePressed = useRef(false);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const wasSelectionEnabled = useRef(true);
  const { setIsDragging } = useWhiteBoardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isSpacePressed.current) {
        if (tool === "pencil") {
          canvasRef.current.isDrawingMode = false;
        }
        isSpacePressed.current = true;
        // Store current selection state
        wasSelectionEnabled.current = canvas.selection || false;
        // Disable selection and make objects non-selectable
        canvas.selection = false;
        canvas.getObjects().forEach((obj) => {
          obj.selectable = false;
          obj.evented = false;
        });
        canvas.defaultCursor = "grab";
        canvas.upperCanvasEl.style.cursor = "grab";
        canvas.requestRenderAll();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressed.current = false;
        isPanning.current = false;
        // Restore previous selection state
        canvas.selection = wasSelectionEnabled.current;
        canvas.getObjects().forEach((obj) => {
          obj.selectable = wasSelectionEnabled.current;
          obj.evented = wasSelectionEnabled.current;
        });
        canvas.defaultCursor = "default";
        canvas.upperCanvasEl.style.cursor = "default";
        canvas.requestRenderAll();

        // Restore drawing mode if tool is pencil
        if (tool === "pencil" && canvasRef.current) {
          canvasRef.current.isDrawingMode = true;
        }
      }
    };

    const getPointerPosition = (e: TPointerEvent) => {
      if ("clientX" in e) {
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
        canvas.upperCanvasEl.style.cursor = "grabbing";
        setIsDragging(true);
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
        canvas.upperCanvasEl.style.cursor = "default";
        canvas.defaultCursor = "default";
        setIsDragging(false);
        if (tool === "pencil") {
          canvasRef.current.isDrawingMode = true;
        }
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
