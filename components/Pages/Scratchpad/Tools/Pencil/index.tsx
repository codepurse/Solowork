import { Fragment, useMemo, useRef, useState } from "react";
import { Line } from "react-konva";

interface PencilProps {
  tool?: string;
  lines: any;
  scale?: number;
  onUpdateLines?: (newLines: any) => void;
  getRelativePointerPosition?: (node: any) => { x: number; y: number };
}

interface ColorSelectorProps {
  tool: string;
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const COLORS = {
  white: "#ffffff",
  red: "#ff4444",
  blue: "#4444ff",
  green: "#44ff44",
  yellow: "#ffff44",
};

// Moved ColorSelector outside as a separate component
const ColorSelector = ({
  tool,
  selectedColor,
  onColorSelect,
}: ColorSelectorProps) => {
  if (tool !== "pencil") return null;
  console.log(tool);
  return (
    <Fragment>
      {Object.entries(COLORS).map(([colorName, colorValue]) => (
        <button
          key={colorName}
          onClick={() => onColorSelect(colorValue)}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: colorValue,
            border:
              selectedColor === colorValue
                ? "2px solid #fff"
                : "2px solid transparent",
            cursor: "pointer",
            padding: 0,
          }}
          aria-label={`Select ${colorName} color`}
        />
      ))}
    </Fragment>
  );
};

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
  const [selectedColor, setSelectedColor] = useState(COLORS.white);

  // Memoize the ColorSelector component as a function component
  const MemoizedColorSelector = useMemo(
    () => () =>
      (
        <ColorSelector
          tool={tool}
          selectedColor={selectedColor}
          onColorSelect={setSelectedColor}
        />
      ),
    [tool, selectedColor] // Only re-render when tool or selectedColor changes
  );

  const handleStart = (e: any) => {
    if (tool !== "pencil") return;
    isDrawing.current = true;
    const pos = getRelativePointerPosition(e.target.getStage());
    onUpdateLines([
      ...lines,
      {
        tool: "pencil",
        points: [pos.x, pos.y],
        color: selectedColor,
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
    handlers: {
      onMouseDown: handleStart,
      onTouchStart: handleStart,
      onMouseMove: handleMove,
      onTouchMove: handleMove,
      onMouseUp: handleEnd,
      onTouchEnd: handleEnd,
      onMouseLeave: handleEnd,
      onTouchCancel: handleEnd,
    },
    ColorSelector: MemoizedColorSelector, // Return the memoized component function
    selectedColor,
  };
};
