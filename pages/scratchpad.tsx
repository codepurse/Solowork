import { Canvas, PencilBrush } from "fabric";
import { Minus, Pencil, StickyNote, Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const canvasRef = useRef<Canvas | null>(null);
  const [color, setColor] = useState<string>("#fff");

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new Canvas("drawing-canvas", {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight - 60, // Adjust based on your toolbar height
    });

    // Initialize the brush
    canvas.freeDrawingBrush = new PencilBrush(canvas);

    canvasRef.current = canvas;

    // Cleanup on unmount
    return () => {
      canvas.dispose();
    };
  }, []);

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
    setTool(selectedTool);

    if (!canvasRef.current) return;

    if (selectedTool === "pencil") {
      canvasRef.current.isDrawingMode = true;
      canvasRef.current.freeDrawingBrush.width = 2;
      canvasRef.current.freeDrawingBrush.color = selectedColor || color;
    } else {
      canvasRef.current.isDrawingMode = false;
    }
  };

  const colorSettings = () => {
    const colors = ["#fff", "#000", "#f00", "#0f0", "#00f", "#ff0", "#0ff"];
    return (
      <div className="color-settings">
        {colors.map((c) => (
          <div
            key={c}
            className="color-settings-item-color"
            style={{ backgroundColor: c }}
            onClick={() => {
              setColor(c);
              if (canvasRef.current) {
                canvasRef.current.freeDrawingBrush.color = c;
              }
            }}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-scratchpad">
      <div className="scratchpad-tools-container">
        <div className="scratchpad-tools-container-item">
          <i
            className={tool === "pencil" ? "active" : ""}
            onClick={() => handleToolClick("pencil", color)}
          >
            <Pencil size={18} />
          </i>
          <i
            className={tool === "stickynote" ? "active" : ""}
            onClick={() => handleToolClick("stickynote", color)}
          >
            <StickyNote size={18} />
          </i>
          <i onClick={() => handleToolClick("text", color)}>
            <Type size={18} />
          </i>
          <i onClick={() => handleToolClick("line", color)}>
            <Minus size={18} />
          </i>
        </div>
      </div>

      {/* Canvas container */}
      <div className="canvas-container">
        <canvas id="drawing-canvas" />
      </div>
      {tool === "pencil" && colorSettings()}
    </div>
  );
}
