import { Canvas, IText } from "fabric";
import { useEffect } from "react";

export default function useCreateText(
  canvasRef: React.RefObject<Canvas>,
  tool: string,
  color: string,
  setTool: (tool: string) => void,
  isBold: boolean,
  setIsBold: (isBold: boolean) => void,
  isItalic: boolean,
  setIsItalic: (isItalic: boolean) => void,
  isUnderline: boolean,
  setIsUnderline: (isUnderline: boolean) => void,
  isCreateText: boolean,
  setIsCreateText: (isCreateText: boolean) => void,
  textFontSize: number,
  setTextFontSize: (textFontSize: number) => void,
  textFontWeight: string,
  setTextFontWeight: (textFontWeight: string) => void,
  textFontStyle: string,
  setTextFontStyle: (textFontStyle: string) => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (opt: any) => {
      if (tool !== "text" || !isCreateText) return;
      console.log("isCreateText", isCreateText);
      const pointer = canvas.getPointer(opt.e);
      const text = new IText("This is a text", {
        left: pointer.x,
        top: pointer.y,
        fill: color,
        fontSize: textFontSize,
        editable: true,
        fontFamily: textFontStyle || "Poppins",
        fontWeight: textFontWeight || "400",
        fontStyle: isItalic ? "italic" : "normal",
        underline: isUnderline,
      });

      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();

      // Immediately enter editing mode
      text.enterEditing();
      text.selectAll();
      setIsCreateText(false);
      // Deactivate text tool after adding text
      setTool("");
    };

    // Add selection event handler
    const handleSelection = (e: any) => {
      const selectedObject = e.selected?.[0];
      if (selectedObject instanceof IText) {
        setTool("text"); // Show text settings when text is selected
        setIsCreateText(false);
        // Update text properties in state when text is selected
        setTextFontSize(typeof selectedObject.fontSize === 'number' ? selectedObject.fontSize : 16);
        
        // Handle font weight
        let weight = selectedObject.fontWeight?.toString() || "400";
        // Convert legacy bold/normal to numeric values
        if (weight === "bold") weight = "700";
        if (weight === "normal") weight = "400";
        setTextFontWeight(weight);
        
        setTextFontStyle(selectedObject.fontFamily?.toString() || "Poppins");

        // Update style states
        setIsBold(weight === "700");
        setIsItalic(selectedObject.fontStyle === "italic");
        setIsUnderline(selectedObject.underline || false);
      } else if (e.deselected) {
        setTool(""); // Hide text settings when text is deselected
      }
    };

    // Add text modification handler
    const handleTextModification = (e: any) => {
      const modifiedObject = e.target;
      if (modifiedObject instanceof IText) {
        // Force the text object to recalculate its dimensions
        modifiedObject.set({
          width: modifiedObject.calcTextWidth(),
          height: modifiedObject.calcTextHeight(),
        });
        canvas.renderAll();
      }
    };

    canvas.on("mouse:down", handleMouseDown);
    canvas.on("selection:created", handleSelection);
    canvas.on("selection:cleared", handleSelection);
    canvas.on("selection:updated", handleSelection);
    // Add listeners for text changes
    canvas.on("text:changed", handleTextModification);
    canvas.on("object:modified", handleTextModification);

    // Cleanup event listeners
    return () => {
      canvas.off("mouse:down", handleMouseDown);
      canvas.off("selection:created", handleSelection);
      canvas.off("selection:cleared", handleSelection);
      canvas.off("selection:updated", handleSelection);
      canvas.off("text:changed", handleTextModification);
      canvas.off("object:modified", handleTextModification);
    };
  }, [tool, color, isBold, isItalic, isUnderline, textFontSize, textFontWeight, textFontStyle]); // Added style dependencies
}
