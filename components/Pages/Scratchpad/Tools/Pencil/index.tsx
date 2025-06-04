import { useRef } from "react";
import { Line } from "react-konva";

interface PencilProps {
  tool?: string;
  lines: any;
  scale?: number;
  onUpdateLines?: (newLines: any) => void;
  getRelativePointerPosition?: (node: any) => { x: number; y: number };
}

export default function PencilTool({ lines }: PencilProps) {
  return (
    <div style={{ position: "relative" }}>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={line.points}
          stroke={line.color}
          strokeWidth={line.strokeWidth}
          tension={0.5}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation="source-over"
        />
      ))}
    </div>
  );
}

export const usePencilHandlers = (
  tool: string,
  lines: any,
  scale: number,
  onUpdateLines: (newLines: any) => void,
  getRelativePointerPosition: (node: any) => { x: number; y: number }
) => {
  const isDrawing = useRef(false);

  const handleStart = (e: any) => {
    if (tool !== "pencil") return;

    isDrawing.current = true;
    const pos = getRelativePointerPosition(e.target.getStage());

    onUpdateLines([
      ...lines,
      {
        tool: "pencil",
        points: [pos.x, pos.y],
        color: "#ffffff",
        strokeWidth: 2 / scale,
      },
    ]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing.current || tool !== "pencil") return;

    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;

    const pos = getRelativePointerPosition(e.target.getStage());

    const newLines = [...lines];
    newLines[newLines.length - 1] = {
      ...lastLine,
      points: [...lastLine.points, pos.x, pos.y],
    };

    onUpdateLines(newLines);
  };

  const handleEnd = () => {
    isDrawing.current = false;
  };

  return {
    onMouseDown: handleStart,
    onTouchStart: handleStart,
    onMouseMove: handleMove,
    onTouchMove: handleMove,
    onMouseUp: handleEnd,
    onTouchEnd: handleEnd,
    onMouseLeave: handleEnd,
    onTouchCancel: handleEnd,
  };
};
