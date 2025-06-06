import { Canvas } from "fabric";
import {
  Box,
  Eraser,
  Image,
  MousePointer,
  Pencil,
  StickyNote,
  Type,
} from "lucide-react";
import { useRef, useState } from "react";
import Draw from "../components/Pages/Scratchpad/Draw";
import ShapeSettings from "../components/Pages/Scratchpad/ShapeSettings";
import TextSettings from "../components/Pages/Scratchpad/TextSettings";
import useCanvas from "../components/Pages/Scratchpad/useCanvas";
import useCanvasMove from "../components/Pages/Scratchpad/useCanvasMove";
import useCanvasZoom from "../components/Pages/Scratchpad/useCanvasZoom";
import useCreateText from "../components/Pages/Scratchpad/useCreateText";
import useEraser from "../components/Pages/Scratchpad/useEraser";
import { useImageUpload } from "../components/Pages/Scratchpad/useImageUpload";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const canvasRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState<string>("#fff");
  const [thickness, setThickness] = useState<number>(2);
  const [selectedShape, setSelectedShape] = useState<string>("box");
  const [shapeColor, setShapeColor] = useState<string>("#FF5252");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isCreateText, setIsCreateText] = useState(false);
  const [textFontSize, setTextFontSize] = useState(16);
  const [textFontWeight, setTextFontWeight] = useState("normal");
  const [textFontStyle, setTextFontStyle] = useState("normal");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isCaseUpper, setIsCaseUpper] = useState(false);
  const [isCaseLower, setIsCaseLower] = useState(false);
  const [text, setText] = useState("This is a text");
  const [textColor, setTextColor] = useState("#ffffff");

  const { handleImageUpload } = useImageUpload({ canvasRef, setTool });

  useCanvas({ canvasRef });
  useEraser(canvasRef, tool);
  useCanvasZoom(canvasRef);
  useCanvasMove(canvasRef);

  // Text creation/styling logic (unchanged)
  useCreateText(
    canvasRef,
    tool,
    color,
    setTool,
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    isCreateText,
    setIsCreateText,
    textFontSize,
    setTextFontSize,
    textFontWeight,
    setTextFontWeight,
    textFontStyle,
    setTextFontStyle,
    isCaseSensitive,
    setIsCaseSensitive,
    isCaseUpper,
    setIsCaseUpper,
    isCaseLower,
    setIsCaseLower,
    text,
    setText,
    textColor,
    setTextColor
  );

  const handleToolClick = (selectedTool: string, selectedColor?: string) => {
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
          <i
            className={tool === "eraser" ? "active" : ""}
            onClick={() => handleToolClick("eraser", color)}
          >
            <Eraser size={18} />
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
          textFontSize={textFontSize}
          setTextFontSize={setTextFontSize}
          textFontWeight={textFontWeight}
          setTextFontWeight={setTextFontWeight}
          textFontStyle={textFontStyle}
          setTextFontStyle={setTextFontStyle}
          isCaseSensitive={isCaseSensitive}
          setIsCaseSensitive={setIsCaseSensitive}
          isCaseUpper={isCaseUpper}
          setIsCaseUpper={setIsCaseUpper}
          isCaseLower={isCaseLower}
          setIsCaseLower={setIsCaseLower}
          text={text}
          setText={setText}
          textColor={textColor}
          setTextColor={setTextColor}
        />
      )}
    </div>
  );
}
