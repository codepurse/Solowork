import * as fabric from "fabric";
import {
  Canvas,
  FabricObject,
  IText,
  Line,
  PencilBrush,
  Textbox,
} from "fabric";
import LZString from "lz-string";
import { useEffect, useRef } from "react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";

// Disable object caching globally
FabricObject.prototype.objectCaching = false;

// Helper function to mark object as dirty and request render
const markDirty = (canvas: Canvas, obj: FabricObject) => {
  if (!obj) return;
  obj.dirty = true;
  canvas.requestRenderAll();
};

// Helper function to mark multiple objects as dirty
const markObjectsDirty = (canvas: Canvas, objects: FabricObject[]) => {
  objects.forEach((obj) => (obj.dirty = true));
  canvas.requestRenderAll();
};

type UseCanvasProps = {
  canvasRef: React.RefObject<Canvas>;
  setTool: (tool: string) => void;
  setShapeFill?: (fill: string) => void;
  setShapeStroke?: (stroke: string) => void;
  selectedWhiteboard: any;
};

// Alignment guide configuration
const ALIGNMENT_THRESHOLD = 10; // Distance in pixels to trigger alignment
const GUIDE_COLOR = "#FF5252"; // Pink color for vertical guides
const GUIDE_COLOR_ALT = "#8C9EFF"; // Blue color for horizontal guides

interface GuideLines {
  vertical: { x: number; y1: number; y2: number }[];
  horizontal: { y: number; x1: number; x2: number }[];
}

// Helper function to load whiteboard data
const loadWhiteboardData = (canvas: Canvas | null, whiteboard: any) => {
  if (!canvas || !whiteboard?.body) return;

  try {
    // Clear all existing objects and reset canvas state
    canvas.clear();
    canvas.renderAll(); // Ensure clear is rendered immediately

    const whiteBoardJson = JSON.parse(
      LZString.decompressFromUTF16(whiteboard.body)
    );

    if (!whiteBoardJson.objects || !Array.isArray(whiteBoardJson.objects)) {
      console.warn("No objects found in whiteboard data");
      return;
    }

    // Apply canvas properties first
    if (whiteBoardJson.background)
      canvas.backgroundColor = whiteBoardJson.background;
    if (whiteBoardJson.viewportTransform)
      canvas.setViewportTransform(whiteBoardJson.viewportTransform);

    // Count total images for tracking
    const totalImages = whiteBoardJson.objects.filter(
      (obj: any) => obj.type === "image"
    ).length;
    let loadedImages = 0;

    // Use enlivenObjects for better performance
    fabric.util
      .enlivenObjects(whiteBoardJson.objects)
      .then((objects) => {
        // Double-check canvas is still valid and clear
        if (!canvas || canvas.disposed) return;

        objects.forEach((obj) => {
          canvas.add(obj as fabric.Object);
          markDirty(canvas, obj as FabricObject);

          // Track image loading
          if ((obj as fabric.Object).type === "image") {
            loadedImages++;
            if (loadedImages === totalImages) {
              canvas.requestRenderAll();
            }
          }
        });

        // If no images, render immediately
        if (totalImages === 0) {
          canvas.renderAll();
        }
      })
      .catch((error) => {
        console.error("Error enlivening objects:", error);
        canvas.clear();
        canvas.renderAll();
      });
  } catch (error) {
    console.error("Error loading whiteboard:", error);
    canvas.clear();
    canvas.renderAll();
  }
};

export default function useCanvas({
  canvasRef,
  setTool,
  setShapeFill,
  setShapeStroke,
  selectedWhiteboard,
}: Readonly<UseCanvasProps>) {
  const { showGridLines, lockMode, isEditMode } = useWhiteBoardStore();
  const focusModeRef = useRef(showGridLines);
  const loadedWhiteboardRef = useRef<string | null>(null);
  const isLoadingRef = useRef(false); // Add loading state protection

  useEffect(() => {
    focusModeRef.current = showGridLines;
  }, [showGridLines]);

  useEffect(() => {
    // Initialize Fabric.js canvas
    const canvas = new Canvas("drawing-canvas", {
      isDrawingMode: false,
      width: window.innerWidth,
      height: window.innerHeight - 60,
      renderOnAddRemove: false,
      stateful: true,
      enableRetinaScaling: true,
      skipTargetFind: false,
      skipOffscreen: false,
    });
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.preserveObjectStacking = true;
    canvasRef.current = canvas;

    // Create a WeakMap to store original opacity values
    const originalOpacities = new WeakMap<object, number>();

    // Store guide lines
    let activeGuideLines: Line[] = [];

    // Helper function to clear existing guide lines
    const clearGuideLines = () => {
      markObjectsDirty(canvas, activeGuideLines);
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
      const selectedObjects = e.selected;
      if (!selectedObjects) return;

      // Check if multiple objects are selected
      if (selectedObjects.length > 1) {
        setTool(""); // Optional: clear or set specific tool for multiple selection
        return;
      }

      // Single object selection handling
      const selectedObject = selectedObjects[0];
      if (selectedObject) {
        updateShapeColors(selectedObject);
        if (getObjectType(selectedObject) === "drawing") {
          setTool("pencil");
        }
        if (getObjectType(selectedObject) === "shape") {
          setTool("shape");
        }
        if (getObjectType(selectedObject) === "image") {
          setTool("image");
        }
      }
    };

    const handleDragMove = (e: any) => {
      const target = e.target;
      if (!target) return;

      clearGuideLines();
      markDirty(canvas, target);

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
          markDirty(canvas, line);
          activeGuideLines.push(line);
        });

        guides.horizontal.forEach((guide) => {
          const line = createGuideLine(
            { x1: guide.x1, y1: guide.y, x2: guide.x2, y2: guide.y },
            false
          );
          canvas.add(line);
          markDirty(canvas, line);
          activeGuideLines.push(line);
        });
      }
    };

    const handleDragEnd = (e: any) => {
      const target = e.target || canvas.getActiveObject();
      if (!target) return;

      clearGuideLines();
      const originalOpacity = originalOpacities.get(target);
      if (originalOpacity !== undefined) {
        target.set("opacity", originalOpacity);
        markDirty(canvas, target);
        originalOpacities.delete(target);
      }
    };

    // Handle mouse down to reset opacity if needed
    const handleMouseDown = (e: any) => {
      const target = e.target;
      if (target && originalOpacities.has(target)) {
        target.set("opacity", originalOpacities.get(target)!);
        markDirty(canvas, target);
        originalOpacities.delete(target);
      }
    };

    // Handle selection cleared to reset opacity
    const handleSelectionCleared = () => {
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        const originalOpacity = originalOpacities.get(obj);
        if (originalOpacity !== undefined) {
          obj.set("opacity", originalOpacity);
          markDirty(canvas, obj);
          originalOpacities.delete(obj);
        }
      });
      setTool("");
    };

    canvas.on("object:moving", handleDragMove);
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:up", handleDragEnd);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:updated", handleSelection);
    canvas.on("selection:cleared", handleSelectionCleared);

    // Delete key listener (object-level delete)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          markObjectsDirty(canvas, activeObjects);
          activeObjects.forEach((obj) => {
            originalOpacities.delete(obj);
            canvas.remove(obj);
          });
          canvas.discardActiveObject();
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

      canvas.dispose();
      canvasRef.current = null;
    };
  }, []);

  // Enhanced whiteboard loading effect with better protection
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!isEditMode || !canvas || !selectedWhiteboard?.body) return;

    const currentWhiteboardId = selectedWhiteboard.id;

    // Prevent duplicate loading
    if (
      loadedWhiteboardRef.current === currentWhiteboardId ||
      isLoadingRef.current
    ) {
      return;
    }

    isLoadingRef.current = true;

    // Small delay to ensure canvas is fully initialized
    const timeoutId = setTimeout(() => {
      loadWhiteboardData(canvas, selectedWhiteboard);
      loadedWhiteboardRef.current = currentWhiteboardId;
      isLoadingRef.current = false;
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      isLoadingRef.current = false;
    };
  }, [selectedWhiteboard, isEditMode]);

  // Effect to handle lock mode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Make canvas and all objects non-interactive when locked
    canvas.selection = !lockMode;
    canvas.isDrawingMode = false;
    canvas.defaultCursor = lockMode ? "not-allowed" : "default";
    setTool("");

    // Update all objects to be non-selectable and non-editable when locked
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
      obj.selectable = !lockMode;
      obj.evented = !lockMode;
      if (obj instanceof IText || obj instanceof Textbox) {
        obj.editable = !lockMode;
      }
    });
    markObjectsDirty(canvas, objects);

    canvas.requestRenderAll();
  }, [lockMode]);
}
