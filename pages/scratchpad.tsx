import { Canvas, PencilBrush } from "fabric";
import { Box, Minus, Pencil, StickyNote, Type } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Draw from "../components/Pages/Scratchpad/Draw";
import ShapeSettings from "../components/Pages/Scratchpad/ShapeSettings";
import useCreateText from "../components/Pages/Scratchpad/useCreateText";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const canvasRef = useRef<Canvas | null>(null);
  const [color, setColor] = useState<string>("#fff");
  const [thickness, setThickness] = useState<number>(2);
  const [selectedShape, setSelectedShape] = useState<string>("box");
  const [shapeColor, setShapeColor] = useState<string>("#FF5252"); // Initialize with a default color

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
  }, []); // Empty dependency array since this should only run once

  // Separate useEffect for handling text too
  useCreateText(canvasRef, tool, color, setTool);

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
    setTool(selectedTool);

    if (!canvasRef.current) return;

    if (selectedTool === "pencil") {
      canvasRef.current.isDrawingMode = true;
      canvasRef.current.freeDrawingBrush.width = thickness;
      canvasRef.current.freeDrawingBrush.color = selectedColor || color;
    } else {
      canvasRef.current.isDrawingMode = false;
    }
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
          <i
            className={tool === "shape" ? "active" : ""}
            onClick={() => handleToolClick("shape", color)}
          >
            <Box size={18} />
          </i>
          <i
            onClick={() => handleToolClick("text", color)}
            className={tool === "text" ? "active" : ""}
          >
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
      {tool === "pencil" && (
        <Draw
          color={color}
          thickness={thickness}
          setColor={setColor}
          setThickness={setThickness}
          canvasRef={canvasRef}
        />
      )}
      {tool === "shape" && (
        <ShapeSettings
          selectedShape={selectedShape}
          setSelectedShape={setSelectedShape}
          shapeColor={shapeColor}
          setShapeColor={setShapeColor}
          canvasRef={canvasRef}
          tool={tool}
          thickness={thickness}
          setTool={setTool}
        />
      )}
    </div>
  );
}
