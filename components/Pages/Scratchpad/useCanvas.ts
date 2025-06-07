import { Canvas, Line, PencilBrush } from "fabric";
import { useEffect, useRef } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

type UseCanvasProps = {
  canvasRef: React.RefObject<Canvas>;
  setTool: (tool: string) => void;
  setShapeFill?: (fill: string) => void;
  setShapeStroke?: (stroke: string) => void;
};

// Alignment guide configuration
const ALIGNMENT_THRESHOLD = 10; // Distance in pixels to trigger alignment
const GUIDE_COLOR = "#ff69b4"; // Pink color for vertical guides
const GUIDE_COLOR_ALT = "#00bfff"; // Blue color for horizontal guides

interface GuideLines {
  vertical: { x: number; y1: number; y2: number }[];
  horizontal: { y: number; x1: number; x2: number }[];
}

export default function useCanvas({
  canvasRef,
  setTool,
  setShapeFill,
  setShapeStroke,
}: Readonly<UseCanvasProps>) {
  const { focusMode, lockMode } = useWhiteBoardStore();
  const focusModeRef = useRef(focusMode);
  const lockModeRef = useRef(lockMode);

  useEffect(() => {
    focusModeRef.current = focusMode;
  }, [focusMode]);

  useEffect(() => {
    lockModeRef.current = lockMode;
  }, [lockMode]);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new Canvas("drawing-canvas", {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight - 60, // leave room for toolbar
    });
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvasRef.current = canvas;

    // Create a WeakMap to store original opacity values
    const originalOpacities = new WeakMap<object, number>();

    // Store guide lines
    let activeGuideLines: Line[] = [];

    // Helper function to clear existing guide lines
    const clearGuideLines = () => {
      activeGuideLines.forEach((line) => canvas.remove(line));
      activeGuideLines = [];
      canvas.requestRenderAll();
    };

    // Helper function to create a guide line
    const createGuideLine = (
      coords: { x1: number; y1: number; x2: number; y2: number },
      isVertical: boolean
    ) => {
      return new Line([coords.x1, coords.y1, coords.x2, coords.y2], {
        stroke: isVertical ? GUIDE_COLOR : GUIDE_COLOR_ALT,
        strokeWidth: 1,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        excludeFromExport: true,
        strokeLineCap: "round",
      });
    };

    // Helper function to get object boundaries
    const getObjectBounds = (obj: any) => {
      const bounds = obj.getBoundingRect(true);
      return {
        left: bounds.left,
        top: bounds.top,
        right: bounds.left + bounds.width,
        bottom: bounds.top + bounds.height,
        centerX: bounds.left + bounds.width / 2,
        centerY: bounds.top + bounds.height / 2,
      };
    };

    // Function to find alignment points
    const findAlignmentGuides = (activeObj: any): GuideLines => {
      const guides: GuideLines = { vertical: [], horizontal: [] };
      const activeBounds = getObjectBounds(activeObj);

      canvas.getObjects().forEach((obj) => {
        if (obj === activeObj || !obj.visible || obj instanceof Line) return;

        const targetBounds = getObjectBounds(obj);

        // Vertical alignments (left, center, right)
        [
          { active: activeBounds.left, target: targetBounds.left },
          { active: activeBounds.centerX, target: targetBounds.centerX },
          { active: activeBounds.right, target: targetBounds.right },
        ].forEach(({ active, target }) => {
          if (Math.abs(active - target) < ALIGNMENT_THRESHOLD) {
            guides.vertical.push({
              x: target,
              y1: Math.min(activeBounds.top, targetBounds.top) - 20,
              y2: Math.max(activeBounds.bottom, targetBounds.bottom) + 20,
            });
          }
        });

        // Horizontal alignments (top, middle, bottom)
        [
          { active: activeBounds.top, target: targetBounds.top },
          { active: activeBounds.centerY, target: targetBounds.centerY },
          { active: activeBounds.bottom, target: targetBounds.bottom },
        ].forEach(({ active, target }) => {
          if (Math.abs(active - target) < ALIGNMENT_THRESHOLD) {
            guides.horizontal.push({
              y: target,
              x1: Math.min(activeBounds.left, targetBounds.left) - 20,
              x2: Math.max(activeBounds.right, targetBounds.right) + 20,
            });
          }
        });
      });

      return guides;
    };

    // Selection event listeners
    const getObjectType = (obj: any) => {
      if (obj.type === "text") return "text";
      if (obj.type === "image") return "image";
      if (["rect", "circle", "triangle", "polygon"].includes(obj.type))
        return "shape";
      if (obj.type === "line") return "line";
      if (obj.type === "path") {
        // If the path was created by the PencilBrush, it will have this property
        if (obj.path) return "drawing";
      }
      return obj.type;
    };

    const updateShapeColors = (selectedObject: any) => {
      if (!selectedObject) return;

      const objectType = getObjectType(selectedObject);
      if (objectType === "shape") {
        setTool("shape");
        // Update shape colors in UI when shape is selected
        if (setShapeFill && typeof selectedObject.fill === "string") {
          setShapeFill(selectedObject.fill || "#ffffff");
        }
        if (setShapeStroke && typeof selectedObject.stroke === "string") {
          setShapeStroke(selectedObject.stroke || "#ffffff");
        }
      }
    };

    const handleSelection = (e: any) => {
      if (lockModeRef.current) return; // Prevent selection when locked
      
      const selectedObjects = e.selected;
      if (!selectedObjects) return;

      // Check if multiple objects are selected
      if (selectedObjects.length > 1) {
        console.log(
          `Multiple objects selected: ${selectedObjects.length} items`
        );
        setTool(""); // Optional: clear or set specific tool for multiple selection
        return;
      }

      // Single object selection handling
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        updateShapeColors(selectedObject);
        if (getObjectType(selectedObject) === "drawing") {
          console.log("pencil trigger");
          setTool("pencil");
        }
        if (getObjectType(selectedObject) === "shape") {
          setTool("shape");
          console.log("shape");
        }
      }
    };

    const handleDragMove = (e: any) => {
      if (lockModeRef.current) return; // Prevent dragging when locked
      
      const target = e.target;
      if (!target) return;

      clearGuideLines();

      // Only show guide lines if focus mode is enabled
      if (focusModeRef.current) {
        const guides = findAlignmentGuides(target);

        // Create and add guide lines
        guides.vertical.forEach((guide) => {
          const line = createGuideLine(
            { x1: guide.x, y1: guide.y1, x2: guide.x, y2: guide.y2 },
            true
          );
          canvas.add(line);
          activeGuideLines.push(line);
        });

        guides.horizontal.forEach((guide) => {
          const line = createGuideLine(
            { x1: guide.x1, y1: guide.y, x2: guide.x2, y2: guide.y },
            false
          );
          canvas.add(line);
          activeGuideLines.push(line);
        });

        canvas.requestRenderAll();
      }
    };

    const handleDragEnd = (e: any) => {
      if (lockModeRef.current) return; // Prevent drag end when locked
      
      const target = e.target || canvas.getActiveObject();
      if (!target) return;

      clearGuideLines();
      const originalOpacity = originalOpacities.get(target);
      if (originalOpacity !== undefined) {
        target.set("opacity", originalOpacity);
        originalOpacities.delete(target);
        canvas.requestRenderAll();
      }
    };

    // Handle mouse down to reset opacity if needed
    const handleMouseDown = (e: any) => {
      if (lockModeRef.current) return; // Prevent mouse down when locked
      
      const target = e.target;
      if (target && originalOpacities.has(target)) {
        target.set("opacity", originalOpacities.get(target)!);
        originalOpacities.delete(target);
        canvas.requestRenderAll();
      }
    };

    // Handle selection cleared to reset opacity
    const handleSelectionCleared = () => {
      if (lockModeRef.current) return; // Prevent selection clearing when locked
      
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        const originalOpacity = originalOpacities.get(obj);
        if (originalOpacity !== undefined) {
          obj.set("opacity", originalOpacity);
          originalOpacities.delete(obj);
        }
      });
      canvas.requestRenderAll();
      setTool("");
    };

    // Update canvas selection and object selection based on lock mode
    const updateCanvasInteractivity = () => {
      canvas.selection = !lockModeRef.current;
      canvas.getObjects().forEach((obj) => {
        obj.selectable = !lockModeRef.current;
        obj.evented = !lockModeRef.current;
      });
      canvas.requestRenderAll();
    };

    // Add effect to update canvas interactivity when lock mode changes
    const handleLockModeChange = () => {
      updateCanvasInteractivity();
    };

    // Initial setup
    updateCanvasInteractivity();

    canvas.on("object:moving", handleDragMove);
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleDragEnd);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);

    // Delete key listener (object-level delete)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lockModeRef.current) return; // Prevent deletion when locked
      
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          activeObjects.forEach((obj) => {
            originalOpacities.delete(obj);
            canvas.remove(obj);
          });
          canvas.discardActiveObject();
          canvas.requestRenderAll();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearGuideLines();
      canvas.off("object:moving", handleDragMove);
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("mouse:up", handleDragEnd);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("selection:cleared", handleSelectionCleared);
      canvas.dispose();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
