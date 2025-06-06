import { Canvas, IText } from "fabric";
import { Bold, Italic, Underline } from "lucide-react";

type TextSettingsProps = {
  canvasRef: React.RefObject<Canvas>;
  isBold: boolean;
  setIsBold: (isBold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (isItalic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (isUnderline: boolean) => void;
};

const TextSettings = ({
  canvasRef,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
}: Readonly<TextSettingsProps>) => {
  const handleTextFormat = (format: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    switch (format) {
      case "bold":
        activeObject.set(
          "fontWeight",
          activeObject.fontWeight === "bold" ? "normal" : "bold"
        );
        setIsBold(activeObject.fontWeight === "bold");
        break;
      case "italic":
        activeObject.set(
          "fontStyle",
          activeObject.fontStyle === "italic" ? "normal" : "italic"
        );
        setIsItalic(activeObject.fontStyle === "italic");
        break;
      case "underline":
        activeObject.set("underline", !activeObject.underline);
        setIsUnderline(activeObject.underline);
        break;
    }
    canvas.renderAll();
  };

  return (
    <div className="text-settings animate__animated animate__slideInRight">
      <div className="text-settings-item">
        <i
          onClick={() => handleTextFormat("bold")}
          className={isBold ? "active" : ""}
        >
          <Bold size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("italic")}
          className={isItalic ? "active" : ""}
        >
          <Italic size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("underline")}
          className={isUnderline ? "active" : ""}
        >
          <Underline size={18} />
        </i>
      </div>
    </div>
  );
};

export default TextSettings;