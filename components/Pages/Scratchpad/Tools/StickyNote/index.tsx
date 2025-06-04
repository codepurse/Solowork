import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef, useState } from "react";
import { Rect, Text } from "react-konva";

interface StickyNoteProps {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  id: string;
  isSelected: boolean;
  onTextChange: (id: string, newText: string) => void;
  onClick: (e: KonvaEventObject<MouseEvent>) => void;
}

export default function StickyNote({
  x,
  y,
  text,
  width = 200,
  height = 200,
  id,
  isSelected,
  onTextChange,
  onClick,
}: StickyNoteProps) {
  return (
    <>
      {/* Yellow background rectangle */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#fff9c4"
        shadowColor="black"
        shadowBlur={5}
        shadowOpacity={0.3}
        cornerRadius={5}
        onClick={onClick}
      />
      {/* Editable text */}
      <Text
        x={x + 10}
        y={y + 10}
        width={width - 20}
        height={height - 20}
        text={text}
        fontSize={16}
        fill="#2d2d2d"
        fontStyle="300"
        lineHeight={1.3}
        wrap="word"
        onClick={onClick}
        listening={true}
        align="left"
        verticalAlign="top"
      />
    </>
  );
}

// TextEditor component for editing sticky notes
export function TextEditor({
  x,
  y,
  text,
  width,
  height,
  onTextChange,
  onClose,
}: {
  x: number;
  y: number;
  text: string;
  width: number;
  height: number;
  onTextChange: (newText: string) => void;
  onClose: () => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <textarea
      ref={textareaRef}
      style={{
        position: "absolute",
        top: y + "px",
        left: x + "px",
        width: width + "px",
        height: height + "px",
        fontSize: "14px",
        padding: "10px",
        border: "none",
        backgroundColor: "#fff9c4",
        resize: "none",
        outline: "none",
        borderRadius: "5px",
        fontFamily: "inherit",
        pointerEvents: "auto",
      }}
      value={text}
      onChange={(e) => onTextChange(e.target.value)}
      onBlur={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    />
  );
}

// Custom hook for handling sticky notes
export const useStickyNoteHandlers = (
  tool: string,
  stickyNotes: any[],
  setStickyNotes: React.Dispatch<React.SetStateAction<any[]>>,
  getRelativePointerPosition: (node: any) => { x: number; y: number },
  setTool: (tool: string) => void
) => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const handleStickyNoteClick = (e: any) => {
    if (tool !== "stickynote") return;

    const stage = e.target.getStage();
    const pos = getRelativePointerPosition(stage);

    const newNote = {
      id: Date.now().toString(),
      x: pos.x,
      y: pos.y,
      text: "Type here...",
      width: 200,
      height: 200,
    };

    setStickyNotes([...stickyNotes, newNote]);
    setSelectedNote(newNote.id);
    setEditingNote(newNote.id);
    setTool(""); // Deactivate the tool after placing a note
  };

  const updateNoteText = (id: string, newText: string) => {
    setStickyNotes(
      stickyNotes.map((note) =>
        note.id === id ? { ...note, text: newText } : note
      )
    );
  };

  return {
    handleStickyNoteClick,
    updateNoteText,
    selectedNote,
    setSelectedNote,
    editingNote,
    setEditingNote,
  };
};
