import { Canvas } from "fabric";
import {
  Box,
  Eraser,
  Image,
  MousePointer,
  Pencil,
  StickyNote,
  Type
} from "lucide-react";
import { useRef } from "react";
import CanvasSettings from "../components/Pages/Scratchpad/CanvasSettings";
import Draw from "../components/Pages/Scratchpad/Draw";
import ShapeSettings from "../components/Pages/Scratchpad/ShapeSettings";
import TextSettings from "../components/Pages/Scratchpad/TextSettings";
import useCanvas from "../components/Pages/Scratchpad/useCanvas";
import useCanvasMove from "../components/Pages/Scratchpad/useCanvasMove";
import useCanvasZoom from "../components/Pages/Scratchpad/useCanvasZoom";
import useCreateText from "../components/Pages/Scratchpad/useCreateText";
import useEraser from "../components/Pages/Scratchpad/useEraser";
import { useImageUpload } from "../components/Pages/Scratchpad/useImageUpload";
import useWhiteBoardStore from "../store/whiteBoardStore";

export default function Scratchpad() {
  const canvasRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    color,
    setColor,
    thickness,
    setThickness,
    setIsCreateText,
    setTool,
    tool,
    zoom,
    lockMode,
  } = useWhiteBoardStore();

  const { handleImageUpload } = useImageUpload({ canvasRef, setTool });

  useCanvas({ canvasRef, setTool });
  useEraser(canvasRef, tool);
  useCanvasZoom(canvasRef);
  useCanvasMove(canvasRef);
  useCreateText(canvasRef);

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
    if (lockMode) return; // Prevent tool changes when locked
    
    setTool(selectedTool);
    if (!canvasRef.current) return;

    // toggle drawing mode when pencil is selected
    if (selectedTool === "pencil") {
      canvasRef.current.isDrawingMode = true;
      canvasRef.current.freeDrawingBrush.width = thickness;
      canvasRef.current.freeDrawingBrush.color = selectedColor || color;
    } else if (selectedTool === "image") {
      fileInputRef.current?.click();
    } else if (selectedTool === "eraser") {
      canvasRef.current.defaultCursor = "url('/image/eraser.png') 4 12, auto";
      canvasRef.current.isDrawingMode = false;
      canvasRef.current.discardActiveObject();
      canvasRef.current.requestRenderAll();
    } else if (selectedTool === "text") {
      canvasRef.current.isDrawingMode = false;
      canvasRef.current.defaultCursor = "text";
    } else {
      canvasRef.current.isDrawingMode = false;
      canvasRef.current.defaultCursor = "default";
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
              if (!lockMode) setIsCreateText(true);
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
          <i
            className={tool === "eraser" ? "active" : ""}
            onClick={() => {
              handleToolClick("eraser", color);
              if (!lockMode) setTool("eraser");
            }}
          >
            <Eraser size={18} />
          </i>
        </div>
      </div>

      {/* Canvas container */}
      <div className="canvas-container">
        <canvas id="drawing-canvas" />
      </div>

      {tool === "pencil" && !lockMode && (
        <Draw
          color={color}
          thickness={thickness}
          setColor={setColor}
          setThickness={setThickness}
          canvasRef={canvasRef}
        />
      )}
      {tool === "shape" && !lockMode && <ShapeSettings canvasRef={canvasRef} />}
      {tool === "text" && !lockMode && <TextSettings canvasRef={canvasRef} />}
      <div className="zoom-container">
        <span>{Math.round(zoom * 100)} %</span>
      </div>
      <CanvasSettings canvasRef={canvasRef} />
    </div>
  );
}
