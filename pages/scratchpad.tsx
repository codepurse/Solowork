import { Minus, Pencil, StickyNote, Type } from "lucide-react";
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import { handleWheel } from "../components/Pages/Scratchpad/helper";
import useHandleResize from "../components/Pages/Scratchpad/hooks/useHandleResize";
import useKeyDownZoom from "../components/Pages/Scratchpad/hooks/useKeyDownZoom";
import {
  default as PencilTool,
  usePencilHandlers,
} from "../components/Pages/Scratchpad/Tools/Pencil";
import {
  default as StickyNoteTool,
  TextEditor,
  useStickyNoteHandlers,
} from "../components/Pages/Scratchpad/Tools/StickyNote";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const [lines, setLines] = useState<any>([]);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const stageRef = useRef<any>(null);
  const [stickyNotes, setStickyNotes] = useState<any[]>([]);

  // Handle tool selection
  const handleToolClick = (selectedTool: string) => {
    setTool(selectedTool);
  };

  // Get relative pointer position
  const getRelativePointerPosition = (node: any) => {
    const transform = node.getAbsoluteTransform().copy();
    // Reset the transform's scale and rotation
    transform.invert();
    // Get pointer position
    const pos = node.getStage().getPointerPosition();
    return transform.point(pos);
  };

  // Get pencil event handlers
  const { handlers, ColorSelector } = usePencilHandlers(
    tool,
    lines,
    scale,
    setLines,
    getRelativePointerPosition
  );

  // Get sticky note handlers with the additional editing state
  const {
    handleStickyNoteClick,
    updateNoteText,
    selectedNote,
    setSelectedNote,
    editingNote,
    setEditingNote,
    ColorSelector: StickyNoteColorSelector,
  } = useStickyNoteHandlers(
    tool,
    stickyNotes,
    setStickyNotes,
    getRelativePointerPosition,
    setTool
  );

  // Handle keyboard shortcuts for zoom
  useKeyDownZoom(setScale);

  // Handle window resize
  useHandleResize(stageRef);

  // Update handlers to include sticky note click
  const combinedHandlers = {
    ...handlers,
    onClick: (e: any) => {
      if (tool === "stickynote") {
        handleStickyNoteClick(e);
      }
    },
  };

  // Function to convert stage coordinates to screen coordinates
  const stageToScreenCoordinates = (x: number, y: number) => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };

    const transform = stage.getAbsoluteTransform();
    const point = transform.point({ x, y });
    return {
      x: point.x,
      y: point.y,
    };
  };

  return (
    <div className="container-scratchpad">
      <div className="scratchpad-tools-container">
        <div className="scratchpad-tools-container-item">
          <i
            onClick={() => handleToolClick("pencil")}
            className={tool === "pencil" ? "active" : ""}
          >
            <Pencil size={18} />
          </i>
          <i
            onClick={() => handleToolClick("stickynote")}
            className={tool === "stickynote" ? "active" : ""}
          >
            <StickyNote size={18} />
          </i>
          <i>
            <Type size={18} />
          </i>
          <i>
            <Minus size={18} />
          </i>
        </div>
      </div>

      {/* Add zoom indicator */}
      <div className="zoom-indicator">{Math.round(scale * 100)}%</div>

      {/* Canvas */}
      <div style={{ position: "relative" }}>
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          {...combinedHandlers}
          onWheel={(e) =>
            handleWheel(e, stageRef, scale, setScale, position, setPosition)
          }
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
        >
          <Layer>
            <PencilTool lines={lines} />
            {stickyNotes.map((note) => (
              <StickyNoteTool
                key={note.id}
                {...note}
                isSelected={selectedNote === note.id}
                onTextChange={updateNoteText}
                onClick={(e) => {
                  e.cancelBubble = true; // Prevent stage click
                  setSelectedNote(note.id);
                  setEditingNote(note.id);
                }}
              />
            ))}
          </Layer>
        </Stage>

        {/* Text Editor Overlay */}
        {editingNote && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: "none",
            }}
          >
            {stickyNotes.map((note) => {
              if (note.id !== editingNote) return null;
              const screenPos = stageToScreenCoordinates(note.x, note.y);
              return (
                <TextEditor
                  key={note.id}
                  x={screenPos.x}
                  y={screenPos.y}
                  text={note.text}
                  width={note.width}
                  height={note.height}
                  onTextChange={(newText) => updateNoteText(note.id, newText)}
                  onClose={() => setEditingNote(null)}
                />
              );
            })}
          </div>
        )}

        {tool === "pencil" && (
          <div className="color-selector animate__animated animate__slideInUp">
            <ColorSelector />
          </div>
        )}

        {tool === "stickynote" && (
          <div className="color-selector animate__animated animate__slideInUp">
            <StickyNoteColorSelector />
          </div>
        )}
      </div>
    </div>
  );
}
