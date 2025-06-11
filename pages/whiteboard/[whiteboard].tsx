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
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import CanvasSettings from "../../components/Pages/Scratchpad/CanvasSettings";
import Draw from "../../components/Pages/Scratchpad/Draw";
import ShapeSettings from "../../components/Pages/Scratchpad/ShapeSettings";
import TextSettings from "../../components/Pages/Scratchpad/TextSettings";
import useCanvas from "../../components/Pages/Scratchpad/useCanvas";
import useCanvasMove from "../../components/Pages/Scratchpad/useCanvasMove";
import useCanvasZoom from "../../components/Pages/Scratchpad/useCanvasZoom";
import useCreateText from "../../components/Pages/Scratchpad/useCreateText";
import useEraser from "../../components/Pages/Scratchpad/useEraser";
import { useImageUpload } from "../../components/Pages/Scratchpad/useImageUpload";
import {
    DATABASE_ID,
    WHITEBOARD_COLLECTION_ID,
    databases,
} from "../../constant/appwrite";
import useWhiteBoardStore from "../../store/whiteBoardStore";

export default function Whiteboard() {
  const router = useRouter();
  const { whiteboard } = router.query;
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
    isEditMode,
  } = useWhiteBoardStore();

  const { handleImageUpload } = useImageUpload({ canvasRef, setTool });
  const [whiteboardData, setWhiteboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set edit mode to true when component mounts
    setIsEditMode(true);
  }, []);

  useEffect(() => {
    const fetchWhiteboard = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching whiteboard with ID:', whiteboard);
        const res = await databases.getDocument(
          DATABASE_ID,
          WHITEBOARD_COLLECTION_ID,
          whiteboard as string
        );
        console.log('Fetched whiteboard data:', res);
        setSelectedWhiteboard(res as any);
        setWhiteboardData(res as any);
      } catch (error) {
        console.error('Error fetching whiteboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if we have a whiteboard ID and router is ready
    if (whiteboard && router.isReady) {
      fetchWhiteboard();
    }
  }, [whiteboard, router.isReady]);

  // Add a log after state update
  useEffect(() => {
    console.log('Current state:', {
      whiteboardData,
      isLoading,
      isEditMode,
      routerReady: router.isReady
    });
  }, [whiteboardData, isLoading, isEditMode, router.isReady]);

  useCanvas({ canvasRef, setTool, whiteboardData });
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
