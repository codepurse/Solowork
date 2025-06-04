import { Minus, Pencil, SquareDashed, Type } from "lucide-react";
import { useRef, useState } from "react";
import { Layer, Stage } from "react-konva";
import {
    default as PencilTool,
    usePencilHandlers,
} from "../components/Pages/Scratchpad/Tools/Pencil";
import { handleWheel } from "../components/Pages/Scratchpad/helper";
import useHandleResize from "../components/Pages/Scratchpad/hooks/useHandleResize";
import useKeyDownZoom from "../components/Pages/Scratchpad/hooks/useKeyDownZoom";

export default function Scratchpad() {
  const [tool, setTool] = useState<string>("");
  const [lines, setLines] = useState<any>([]);
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const stageRef = useRef<any>(null);

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
  const pencilEventHandlers = usePencilHandlers(
    tool,
    lines,
    scale,
    setLines,
    getRelativePointerPosition
  );

  // Handle keyboard shortcuts for zoom
  useKeyDownZoom(setScale);

  // Handle window resize
  useHandleResize(stageRef);

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
          <i>
            <SquareDashed size={18} />
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
      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        {...pencilEventHandlers}
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
        </Layer>
      </Stage>
    </div>
  );
}
