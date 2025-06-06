import { Canvas, IText } from "fabric";
import { useEffect } from "react";

function detectCase(text: string) {
  if (!text) return "empty";

  if (text === text.toUpperCase()) {
    return "uppercase";
  } else if (text === text.toLowerCase()) {
    return "lowercase";
  } else if (
    text[0] === text[0].toUpperCase() &&
    text.slice(1) === text.slice(1).toLowerCase()
  ) {
    return "capitalized";
  } else {
    return "mixed";
  }
}

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
  setTextFontStyle: (textFontStyle: string) => void,
  isCaseSensitive: boolean,
  setIsCaseSensitive: (isCaseSensitive: boolean) => void,
  isCaseUpper: boolean,
  setIsCaseUpper: (isCaseUpper: boolean) => void,
  isCaseLower: boolean,
  setIsCaseLower: (isCaseLower: boolean) => void,
  text: string,
  setText: (text: string) => void,
  textColor: any,
  setTextColor: (textColor: any) => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (opt: any) => {
      if (tool !== "text" || !isCreateText) return;
      const pointer = canvas.getPointer(opt.e);
      let transformedText = text;

      if (isCaseUpper) {
        transformedText = transformedText.toUpperCase();
      } else if (isCaseLower) {
        transformedText = transformedText.toLowerCase();
      } else if (!isCaseSensitive) {
        // Title case (capitalize every word)
        transformedText =
          transformedText.charAt(0).toUpperCase() +
          transformedText.slice(1).toLowerCase();
      }

      const textObject = new IText(transformedText, {
        left: pointer.x,
        top: pointer.y,
        fill: textColor,
        fontSize: textFontSize,
        editable: false,
        fontFamily: textFontStyle || "Poppins",
        fontWeight: textFontWeight || "400",
        fontStyle: isItalic ? "italic" : "normal",
        underline: isUnderline,
      });

      canvas.add(textObject);
      canvas.setActiveObject(textObject);
      canvas.renderAll();

      // Immediately enter editing mode
      textObject.enterEditing();
      textObject.selectAll();
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
        setTextFontSize(
          typeof selectedObject.fontSize === "number"
            ? selectedObject.fontSize
            : 16
        );

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

        // Update text
        setText(selectedObject.text);
        // Update text color - ensure we have a valid color value
        setTextColor(selectedObject.fill?.toString() || "#000000");
        
        // Update case transform states
        setIsCaseSensitive(detectCase(selectedObject.text) === "mixed");
        setIsCaseUpper(detectCase(selectedObject.text) === "uppercase");
        setIsCaseLower(detectCase(selectedObject.text) === "lowercase");
      } else if (e.deselected) {
        setTool(""); // Hide text settings when text is deselected
      }
    };

    // Add text modification handler
    const handleTextModification = (e: any) => {
      const modifiedObject = e.target;
      if (modifiedObject instanceof IText) {
        // Apply text transformations
        let transformedText = modifiedObject.text;
        if (isCaseUpper) {
          transformedText = transformedText.toUpperCase();
        } else if (isCaseLower) {
          transformedText = transformedText.toLowerCase();
        } else if (isCaseSensitive) {
          transformedText = transformedText.replace(/\b\w/g, (char) =>
            char.toUpperCase()
          );
        }

        // Only update if the text actually changed
        if (transformedText !== modifiedObject.text) {
          modifiedObject.set("text", transformedText);
        }

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
  }, [
    tool,
    color,
    isBold,
    isItalic,
    isUnderline,
    textFontSize,
    textFontWeight,
    textFontStyle,
    isCaseSensitive,
    isCaseUpper,
    isCaseLower,
    text,
    textColor,
  ]); // Added style dependencies

  // Add new effect to update text when text state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    // Only update if the text has actually changed
    if (activeObject.text !== text) {
      activeObject.set("text", text);
      canvas.renderAll();
    }
  }, [text]);
}
