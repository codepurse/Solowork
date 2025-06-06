import type { TPointerEvent, TPointerEventInfo } from "fabric";
import { Canvas } from "fabric";
import { useEffect } from "react";

export default function useEraser(
  canvasRef: React.RefObject<Canvas>,
  tool: string
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Only disable selection highlighting when eraser is active
    canvas.selection = tool !== "eraser";

    // Set cursor for all objects when eraser is active
    canvas.getObjects().forEach((obj) => {
      obj.hoverCursor =
        tool === "eraser" ? "url('/image/eraser.png') 4 12, auto" : "move";
    });

    // on mouse down: if you click on an object, delete it immediately
    const handleMouseDown = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (tool !== "eraser") return;
      if (opt.target) {
        canvas.remove(opt.target);
        canvas.requestRenderAll();
      }
    };

    // on mouse move: if you're holding the left button AND tool is eraser,
    // remove any object under the cursor
    const handleMouseMove = (opt: TPointerEventInfo<TPointerEvent>) => {
      if (tool !== "eraser") return;
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
  }, [tool]);
}
