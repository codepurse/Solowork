import { Canvas, IText } from "fabric";
import { useEffect } from "react";

export default function useCreateText(
  canvasRef: React.RefObject<Canvas>,
  tool: string,
  color: string,
  setTool: (tool: string) => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (opt: any) => {
      if (tool !== "text") return;

      const pointer = canvas.getPointer(opt.e);
      const text = new IText("This is a text", {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontSize: 20,
        editable: true,
        fontFamily: "Poppins",
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();

      // Immediately enter editing mode
      text.enterEditing();
      text.selectAll();

      // Deactivate text tool after adding text
      setTool("");
    };

    canvas.on("mouse:down", handleMouseDown);

    // Cleanup event listener
    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [tool, color]);
}
