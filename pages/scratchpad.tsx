import { Canvas, PencilBrush } from "fabric";
import {
  Box,
  Image,
  MousePointer,
  Pencil,
  StickyNote,
  Type,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Draw from "../components/Pages/Scratchpad/Draw";
import ShapeSettings from "../components/Pages/Scratchpad/ShapeSettings";
import TextSettings from "../components/Pages/Scratchpad/TextSettings";
import useCanvasMove from "../components/Pages/Scratchpad/useCanvasMove";
import useCanvasZoom from "../components/Pages/Scratchpad/useCanvasZoom";
import useCreateText from "../components/Pages/Scratchpad/useCreateText";
import { useImageUpload } from "../components/Pages/Scratchpad/useImageUpload";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const canvasRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState<string>("#fff");
  const [thickness, setThickness] = useState<number>(2);
  const [selectedShape, setSelectedShape] = useState<string>("box");
  const [shapeColor, setShapeColor] = useState<string>("#FF5252"); // Initialize with a default color
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCreateText, setIsCreateText] = useState(false);

  const { handleImageUpload } = useImageUpload({ canvasRef, setTool });

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

    // Handle keyboard events for delete
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => canvas.remove(obj));
          canvas.discardActiveObject();
          canvas.renderAll();
        }
      }
    };

    // Add keyboard event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      canvas.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array since this should only run once

  useCanvasZoom(canvasRef);
  useCanvasMove(canvasRef);

  // Separate useEffect for handling text too
  useCreateText(
    canvasRef,
    tool,
    color,
    setTool,
    isBold,
    isItalic,
    isUnderline,
    isCreateText,
    setIsCreateText
  );

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
    setTool(selectedTool);

    if (!canvasRef.current) return;

    if (selectedTool === "pencil") {
      canvasRef.current.isDrawingMode = true;
      canvasRef.current.freeDrawingBrush.width = thickness;
      canvasRef.current.freeDrawingBrush.color = selectedColor || color;
    } else if (selectedTool === "image") {
      fileInputRef.current?.click();
    } else {
      canvasRef.current.isDrawingMode = false;
    }
  };

  return (
    <div className="container-scratchpad">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className="scratchpad-tools-container">
        <div className="scratchpad-tools-container-item">
          <i
            className={tool === "mouse" ? "active" : ""}
            onClick={() => handleToolClick("mouse", color)}
          >
            <MousePointer size={18} />
          </i>
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
            onClick={() => {
              handleToolClick("text", color);
              setIsCreateText(true);
            }}
            className={tool === "text" ? "active" : ""}
          >
            <Type size={18} />
          </i>
          <i
            className={tool === "image" ? "active" : ""}
            onClick={() => handleToolClick("image", color)}
          >
            <Image size={18} />
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
      {tool === "text" && (
        <TextSettings
          canvasRef={canvasRef}
          isBold={isBold}
          setIsBold={setIsBold}
          isItalic={isItalic}
          setIsItalic={setIsItalic}
          isUnderline={isUnderline}
          setIsUnderline={setIsUnderline}
        />
      )}
    </div>
  );
}
