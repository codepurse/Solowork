import { Canvas, PencilBrush } from "fabric";
import { useEffect } from "react";

type UseCanvasProps = {
  canvasRef: React.RefObject<Canvas>;
  setTool: (tool: string) => void;
  setShapeFill?: (fill: string) => void;
  setShapeStroke?: (stroke: string) => void;
};

export default function useCanvas({
  canvasRef,
  setTool,
  setShapeFill,
  setShapeStroke,
}: Readonly<UseCanvasProps>) {
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
        console.log(`Multiple objects selected: ${selectedObjects.length} items`);
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

    // Add drag opacity handlers
    const handleDragStart = (e: any) => {
      const target = e.target;
      if (!target) return;

      // Store the original opacity if not already stored
      if (!originalOpacities.has(target)) {
        originalOpacities.set(target, target.opacity || 1);
      }
      // Set a lower opacity while dragging
      target.set('opacity', 0.5);
      canvas.requestRenderAll();
    };

    const handleDragEnd = (e: any) => {
      const target = e.target || canvas.getActiveObject();
      if (!target) return;

      // Restore the original opacity
      const originalOpacity = originalOpacities.get(target);
      if (originalOpacity !== undefined) {
        target.set('opacity', originalOpacity);
        originalOpacities.delete(target);
        canvas.requestRenderAll();
      }
    };

    // Handle mouse down to reset opacity if needed
    const handleMouseDown = (e: any) => {
      const target = e.target;
      if (target && originalOpacities.has(target)) {
        target.set('opacity', originalOpacities.get(target)!);
        originalOpacities.delete(target);
        canvas.requestRenderAll();
      }
    };

    // Handle selection cleared to reset opacity
    const handleSelectionCleared = () => {
      const objects = canvas.getObjects();
      objects.forEach(obj => {
        const originalOpacity = originalOpacities.get(obj);
        if (originalOpacity !== undefined) {
          obj.set('opacity', originalOpacity);
          originalOpacities.delete(obj);
        }
      });
      canvas.requestRenderAll();
      setTool("");
    };

    canvas.on("object:moving", handleDragStart);
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
      canvas.off("object:moving", handleDragStart);
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
