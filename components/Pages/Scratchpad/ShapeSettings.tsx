import * as fabric from "fabric";
import { Canvas } from "fabric";
import {
  Circle,
  Cylinder,
  Diamond,
  Heart,
  Hexagon,
  Minus,
  MoveRight,
  Octagon,
  Pentagon,
  RectangleHorizontal,
  Square,
  Squircle,
  Star,
  Triangle,
} from "lucide-react";
import { useEffect } from "react";

const fillColors = [
  "#FF5252",
  "#EA80FC",
  "#B388FF",
  "#8C9EFF",
  "#84FFFF",
  "#A7FFEB",
  "#CCFF90",
  "#F4FF81",
  "#FFE57F",
];

type ShapeSettingsProps = {
  selectedShape: string;
  setSelectedShape: (shape: string) => void;
  shapeColor: string;
  setShapeColor: (color: string) => void;
  canvasRef: React.RefObject<Canvas>;
  tool: string;
  thickness: number;
  setTool: (tool: string) => void;
};

export default function ShapeSettings({
  selectedShape,
  setSelectedShape,
  shapeColor,
  setShapeColor,
  canvasRef,
  tool,
  thickness,
  setTool,
}: Readonly<ShapeSettingsProps>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (event: any) => {
      if (tool !== "shape") return;

      const pointer = canvas.getPointer(event.e);

      let shape;

      switch (selectedShape) {
        case "box":
          shape = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            width: 60,
            height: 60,
            stroke: shapeColor,
            strokeWidth: thickness,
          });
          break;
        case "circle":
          shape = new fabric.Circle({
            left: pointer.x,
            top: pointer.y,
            radius: 30,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            originX: "center",
            originY: "center",
          });
          break;
        case "triangle":
          shape = new fabric.Triangle({
            left: pointer.x,
            top: pointer.y,
            width: 60,
            height: 60,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
          });
          break;
        case "rectangle":
          shape = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            width: 100,
            height: 60,
            stroke: shapeColor,
            strokeWidth: thickness,
          });
          break;
        case "pentagon":
          const pentagonPoints = [
            { x: 30, y: 0 },
            { x: 60, y: 20 },
            { x: 48, y: 55 },
            { x: 12, y: 55 },
            { x: 0, y: 20 },
          ];
          shape = new fabric.Polygon(pentagonPoints, {
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            scaleX: 1,
            scaleY: 1,
          });
          break;
        case "hexagon":
          const hexagonPoints = [
            { x: 30, y: 0 },
            { x: 60, y: 15 },
            { x: 60, y: 45 },
            { x: 30, y: 60 },
            { x: 0, y: 45 },
            { x: 0, y: 15 },
          ];
          shape = new fabric.Polygon(hexagonPoints, {
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            scaleX: 1,
            scaleY: 1,
          });
          break;
        case "diamond":
          const diamondPoints = [
            { x: 30, y: 0 },
            { x: 60, y: 30 },
            { x: 30, y: 60 },
            { x: 0, y: 30 },
          ];
          shape = new fabric.Polygon(diamondPoints, {
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            scaleX: 1,
            scaleY: 1,
          });
          break;
        case "octagon":
          const radius = 40;
          const octagonPoints = Array.from({ length: 8 }, (_, i) => {
            const angle = (Math.PI / 4) * i;
            return {
              x: radius * Math.cos(angle),
              y: radius * Math.sin(angle),
            };
          });

          shape = new fabric.Polygon(octagonPoints, {
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            originX: "center",
            originY: "center",
          });
          break;
        case "line":
          shape = new fabric.Line(
            [pointer.x, pointer.y, pointer.x + 100, pointer.y],
            {
              stroke: shapeColor,
              strokeWidth: thickness,
              selectable: true,
            }
          );
          break;
        case "blockArrow": {
          const shaftLength = 120;
          const shaftHeight = 20;
          const headSize = 30;
          const startX = pointer.x;
          const startY = pointer.y;

          // Shaft of the arrow (rounded ends)
          const shaft = new fabric.Rect({
            left: startX,
            top: startY - shaftHeight / 2,
            width: shaftLength,
            height: shaftHeight,
            rx: shaftHeight / 2, // round ends
            ry: shaftHeight / 2,
            fill: shapeColor,
            selectable: false,
          });

          // Arrowhead (a triangle pointing right)
          const head = new fabric.Triangle({
            left: startX + shaftLength,
            top: startY,
            width: headSize,
            height: shaftHeight * 2,
            angle: 90,
            originX: "center",
            originY: "center",
            fill: shapeColor,
            selectable: false,
          });

          // Group them
          shape = new fabric.Group([shaft, head], {
            selectable: true,
          });
          break;
        }
        case "lineArrow": {
          const shaftLength = 120;
          const shaftHeight = 4; // thinner shaft
          const headSize = 20; // smaller arrowhead
          const startX = pointer.x;
          const startY = pointer.y;

          // Shaft of the arrow
          const shaft = new fabric.Rect({
            left: startX,
            top: startY - shaftHeight / 2,
            width: shaftLength,
            height: shaftHeight,
            rx: shaftHeight / 2, // rounded ends
            ry: shaftHeight / 2,
            fill: shapeColor,
            selectable: false,
          });

          // Arrowhead (triangle)
          const head = new fabric.Triangle({
            left: startX + shaftLength,
            top: startY,
            width: headSize,
            height: shaftHeight * 2,
            angle: 90,
            originX: "center",
            originY: "center",
            fill: shapeColor,
            selectable: false,
          });

          // Group them together
          shape = new fabric.Group([shaft, head], {
            selectable: true,
          });
          break;
        }
        case "squircle":
          shape = new fabric.Rect({
            left: pointer.x,
            top: pointer.y,
            width: 100,
            height: 100,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            rx: 20,
            ry: 20,
          });
          break;
        case "heart":
          shape = new fabric.Path(
            "M 75 40 \
               C 75 37, 70 25, 50 25 \
               C 20 25, 20 62.5, 20 62.5 \
               C 20 80, 40 102, 75 120 \
               C 110 102, 130 80, 130 62.5 \
               C 130 62.5, 130 25, 100 25 \
               C 85 25, 75 37, 75 40 Z",
            {
              left: pointer.x,
              top: pointer.y,
              scaleX: 0.5, // adjust scale if too large
              scaleY: 0.5,
              fill: shapeColor,
              stroke: shapeColor,
              strokeWidth: thickness,
              originX: "center",
              originY: "center",
            }
          );
          break;
        case "star":
          const starPoints = [
            { x: 50, y: 0 },
            { x: 61, y: 35 },
            { x: 98, y: 35 },
            { x: 68, y: 57 },
            { x: 79, y: 91 },
            { x: 50, y: 70 },
            { x: 21, y: 91 },
            { x: 32, y: 57 },
            { x: 2, y: 35 },
            { x: 39, y: 35 },
          ];

          shape = new fabric.Polygon(starPoints, {
            left: pointer.x,
            top: pointer.y,
            fill: shapeColor,
            stroke: shapeColor,
            strokeWidth: thickness,
            originX: "center",
            originY: "center",
            scaleX: 0.8,
            scaleY: 0.8,
          });
          break;
        case "cylinder":
          shape = new fabric.Path(
            // A vertical cylinder with top and bottom ellipses and side lines
            "M 50 20 \
               A 40 10 0 0 1 130 20 \
               L 130 100 \
               A 40 10 0 0 1 50 100 \
               Z \
               M 50 20 \
               A 40 10 0 0 0 130 20",
            {
              left: pointer.x,
              top: pointer.y,
              fill: shapeColor,
              stroke: shapeColor,
              strokeWidth: thickness,
              originX: "center",
              originY: "center",
              scaleX: 0.5,
              scaleY: 0.5,
            }
          );
          break;

        default:
          return;
      }

      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.requestRenderAll();

      // Deactivate shape tool after adding shape
      setTool("");
    };

    canvas.on("mouse:down", handleMouseDown);

    return () => {
      canvas.off("mouse:down", handleMouseDown);
    };
  }, [tool, selectedShape, shapeColor, thickness]);

  const shapes = [
    {
      name: "box",
      icon: <Square size={22} />,
    },
    {
      name: "heart",
      icon: <Heart size={22} />,
    },
    {
      name: "star",
      icon: <Star size={22} />,
    },
    {
      name: "squircle",
      icon: <Squircle size={22} />,
    },
    {
      name: "circle",
      icon: <Circle size={22} />,
    },
    {
      name: "triangle",
      icon: <Triangle size={22} />,
    },
    {
      name: "rectangle",
      icon: <RectangleHorizontal size={22} />,
    },
    {
      name: "pentagon",
      icon: <Pentagon size={22} />,
    },
    {
      name: "diamond",
      icon: <Diamond size={22} />,
    },
    {
      name: "hexagon",
      icon: <Hexagon size={22} />,
    },
    {
      name: "octagon",
      icon: <Octagon size={22} />,
    },
    {
      name: "cylinder",
      icon: <Cylinder size={22} />,
    },
    {
      name: "lineArrow",
      icon: <MoveRight size={22} />,
    },
    {
      name: "line",
      icon: <Minus size={22} />,
    },
  ];
  return (
    <div className="shape-settings">
      <p className="shape-title mb-2">Shapes</p>
      <div className="shape-settings-item">
        {shapes.map((shape) => (
          <div
            key={shape.name}
            className={`shape-settings-item-container`}
            id={selectedShape === shape.name ? "active" : ""}
          >
            <div
              className={`shape-settings-item-icon`}
              onClick={() => setSelectedShape(shape.name)}
            >
              <i>{shape.icon}</i>
            </div>
          </div>
        ))}
      </div>
      <p className="shape-title mb-2 mt-3">Fill Color</p>
      <div className="shape-settings-item">
        {fillColors.map((color) => (
          <div
            key={color}
            className="shape-settings-color"
            style={{ backgroundColor: color }}
            onClick={() => setShapeColor(color)}
            id={shapeColor === color ? "active" : ""}
          ></div>
        ))}
      </div>
      <p className="shape-title mb-2 mt-3">Stroke Color</p>
      <div className="shape-settings-item">
        {fillColors.map((color) => (
          <div
            key={color}
            className="shape-settings-color"
            style={{ backgroundColor: color }}
            onClick={() => setShapeColor(color)}
            id={shapeColor === color ? "active" : ""}
          ></div>
        ))}
      </div>
    </div>
  );
}
