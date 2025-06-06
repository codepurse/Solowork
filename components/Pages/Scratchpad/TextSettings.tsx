import { Canvas, IText } from "fabric";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Underline,
} from "lucide-react";
import Dropdown from "../../Elements/Dropdown";
import Space from "../../space";

type TextSettingsProps = {
  canvasRef: React.RefObject<Canvas>;
  isBold: boolean;
  setIsBold: (isBold: boolean) => void;
  isItalic: boolean;
  setIsItalic: (isItalic: boolean) => void;
  isUnderline: boolean;
  setIsUnderline: (isUnderline: boolean) => void;
  setTextFontSize: (textFontSize: number) => void;
  textFontSize: number;
  textFontWeight: string;
  setTextFontWeight: (textFontWeight: string) => void;
  textFontStyle: string;
  setTextFontStyle: (textFontStyle: string) => void;
};

const fontOptions = [
  { label: "Poppins", value: "Poppins" },
  { label: "Roboto", value: "Roboto" },
  { label: "Open Sans", value: "Open Sans" },
  { label: "Montserrat", value: "Montserrat" },
];

const fontWeightOptions = [
  { label: "Light", value: "300" },
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semi Bold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" }
];

const fontSizeOptions = [
  { label: "12px", value: 12 },
  { label: "14px", value: 14 },
  { label: "16px", value: 16 },
  { label: "18px", value: 18 },
  { label: "20px", value: 20 },
];

const TextSettings = ({
  canvasRef,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline,
  setTextFontSize,
  textFontSize,
  textFontWeight,
  setTextFontWeight,
  textFontStyle,
  setTextFontStyle,
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

  const handleFontSize = (size: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    activeObject.set("fontSize", size);
    setTextFontSize(size);
    canvas.renderAll();
  };

  const handleFontWeight = (weight: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    activeObject.set("fontWeight", weight);
    setTextFontWeight(weight);
    canvas.renderAll();
  };

  const handleFontFamily = (font: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    activeObject.set("fontFamily", font);
    setTextFontStyle(font);
    canvas.renderAll();
  };

  return (
    <div className="text-settings animate__animated animate__slideInRight">
      <p className="draw-title mb-2">Text styles</p>
      <div className="text-settings-item-container">
        <i className="text-settings-item" onClick={() => handleFontSize(16)}>
          <Heading1 size={18} />
        </i>
        <i className="text-settings-item" onClick={() => handleFontSize(20)}>
          <Heading2 size={18} />
        </i>
        <i className="text-settings-item" onClick={() => handleFontSize(24)}>
          <Heading3 size={18} />
        </i>
        <i className="text-settings-item" onClick={() => handleFontSize(28)}>
          <Heading4 size={18} />
        </i>
        <i className="text-settings-item" onClick={() => handleFontSize(32)}>
          <Heading5 size={18} />
        </i>
        <i className="text-settings-item" onClick={() => handleFontSize(36)}>
          <Heading6 size={18} />
        </i>
      </div>
      <div className="mt-2">
        <Dropdown
          options={fontSizeOptions}
          onChange={(value) => handleFontSize(value.value)}
          value={fontSizeOptions.find(
            (option) => option.value === textFontSize
          )}
        />
        <Space gap={5}>
          <div style={{ width: "100%" }}>
            <Dropdown
              options={fontOptions}
              onChange={(value) => handleFontFamily(value.value)}
              value={fontOptions.find(
                (option) => option.value === textFontStyle
              )}
            />
          </div>
          <div style={{ width: "100%" }}>
            <Dropdown
              options={fontWeightOptions}
              onChange={(value) => handleFontWeight(value.value)}
              value={fontWeightOptions.find(
                (option) => option.value === textFontWeight
              )}
            />
          </div>
        </Space>
      </div>

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
