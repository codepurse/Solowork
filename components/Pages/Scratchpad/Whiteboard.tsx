import {
  ArrowLeft,
  Box,
  Eraser,
  Image,
  MousePointer,
  Pencil,
  Redo,
  Type,
  Undo,
} from "lucide-react";
import { useEffect, useRef } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";
import CanvasSettings from "./CanvasSettings";
import Draw from "./Draw";
import ShapeSettings from "./ShapeSettings";
import TextSettings from "./TextSettings";
import useCanvas from "./useCanvas";
import useCanvasMove from "./useCanvasMove";
import useCanvasZoom from "./useCanvasZoom";
import useCreateText from "./useCreateText";
import useEraser from "./useEraser";
import { useImageUpload } from "./useImageUpload";

export default function Whiteboard() {
  const canvasRef = useRef<any>(null);
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
    isDragging,
    canvasStyle,
    selectedWhiteboard,
    setIsEditMode,
    setSelectedWhiteboard,
    focusMode,
    setFocusMode,
  } = useWhiteBoardStore();

  const { handleImageUpload } = useImageUpload({ canvasRef, setTool });

  useCanvas({ canvasRef, setTool, selectedWhiteboard });
  useEraser(canvasRef, tool);
  useCanvasZoom(canvasRef);
  useCanvasMove(canvasRef, tool);
  useCreateText(canvasRef);

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
    if (lockMode) return; // Prevent tool changes when locked

    setTool(selectedTool);
    if (!canvasRef.current) return;

    // toggle drawing mode when pencil is selected
    if (selectedTool === "pencil" && !isDragging) {
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

  useEffect(() => {
    if (isDragging) {
      canvasRef.current.isDrawingMode = false;
      canvasRef.current.defaultCursor = "grab";
    }
  }, [isDragging]);

  return (
    <div className={`container-scratchpad ${canvasStyle}`}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageUpload}
      />
      <div className="scratchpad-tools-container slideInLeft">
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
          <div className="divider" />
          <i>
            <Undo size={18} />
          </i>
          <i>
            <Redo size={18} />
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
      <div className="zoom-container slideInRight">
        <span>{Math.round(zoom * 100)} %</span>
      </div>
      <CanvasSettings canvasRef={canvasRef} />
      <div
        className="whiteboard-back slideInLeft"
        style={{ top: focusMode ? "10px" : "70px" }}
        onClick={() => {
          setIsEditMode(false);
          setSelectedWhiteboard(null);
          setFocusMode(false);
        }}
      >
        <i>
          <ArrowLeft size={18} />
        </i>
      </div>
    </div>
  );
}
