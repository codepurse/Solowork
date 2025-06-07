import type { TPointerEvent, TPointerEventInfo } from "fabric";
import { Canvas } from "fabric";
import { useEffect } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

export default function useEraser(
  canvasRef: React.RefObject<Canvas>,
  tool: string
) {
  const { lockMode } = useWhiteBoardStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only disable selection highlighting when eraser is active and canvas is not locked
    canvas.selection = tool !== "eraser" && !lockMode;

    // Set cursor for all objects when eraser is active and canvas is not locked
    canvas.getObjects().forEach((obj) => {
      obj.hoverCursor =
        tool === "eraser" && !lockMode ? "url('/image/eraser.png') 4 12, auto" : "move";
    });

    // on mouse down: if you click on an object, delete it immediately
    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (tool !== "eraser" || lockMode) return;
      if (opt.target) {
        canvas.remove(opt.target);
        canvas.requestRenderAll();
      }
    };

    // on mouse move: if you're holding the left button AND tool is eraser,
    // remove any object under the cursor
    const handleMouseMove = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (tool !== "eraser" || lockMode) return;
      // opt.e is the native pointer event; buttons===1 means left-button is still down
      if (opt.e && (opt.e as MouseEvent).buttons === 1 && opt.target) {
        canvas.remove(opt.target);
        canvas.requestRenderAll();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:move", handleMouseMove);
    };
  }, [tool, lockMode]);

  useEffect(() => {
    console.log("tool", tool);
    if (canvasRef.current && tool === "eraser" && !lockMode) {
      canvasRef.current.defaultCursor = "url('/image/eraser.png') 4 12, auto";

      // Add mouse event listeners to maintain eraser cursor
      const canvas = canvasRef.current;
      const maintainEraserCursor = () => {
        if (tool === "eraser" && !lockMode) {
          canvas.defaultCursor = "url('/image/eraser.png') 4 12, auto";
        }
      };

      canvas.on("mouse:down", maintainEraserCursor);
      canvas.on("mouse:up", maintainEraserCursor);
      canvas.on("mouse:move", maintainEraserCursor);

      return () => {
        canvas.off("mouse:down", maintainEraserCursor);
        canvas.off("mouse:up", maintainEraserCursor);
        canvas.off("mouse:move", maintainEraserCursor);
      };
    }
  }, [tool, canvasRef, lockMode]);
}
