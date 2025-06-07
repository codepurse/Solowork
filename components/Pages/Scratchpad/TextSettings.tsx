import { Canvas, IText } from "fabric";
import {
  Bold,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  Underline,
} from "lucide-react";
import useWhiteBoardStore from "../../../store/whiteBoardStore";
import Dropdown from "../../Elements/Dropdown";
import TextArea from "../../Elements/TextArea";
import Space from "../../space";

type TextSettingsProps = {
  canvasRef: React.RefObject<Canvas>;
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
  { label: "Extra Bold", value: "800" },
];

const fontSizeOptions = [
  { label: "12px", value: 12 },
  { label: "14px", value: 14 },
  { label: "16px", value: 16 },
  { label: "18px", value: 18 },
  { label: "20px", value: 20 },
];

const colorOptions = [
  { label: "#000000", value: "#000000" },
  { label: "#ffffff", value: "#ffffff" },
  { label: "#EF5350", value: "#EF5350" },
  { label: "#9C27B0", value: "#9C27B0" },
  { label: "#3F51B5", value: "#3F51B5" },
  { label: "#03A9F4", value: "#03A9F4" },
  { label: "#009688", value: "#009688" },
  { label: "#8BC34A", value: "#8BC34A" },
  { label: "#FFEB3B", value: "#FFEB3B" },
  { label: "#FF9800", value: "#FF9800" },
  { label: "#795548", value: "#795548" },
  { label: "#9b74ff", value: "#9b74ff" },
];

const TextSettings = ({ canvasRef }: Readonly<TextSettingsProps>) => {
  const {
    isBold,
    setIsBold,
    isItalic,
    setIsItalic,
    isUnderline,
    setIsUnderline,
    textFontSize,
    setTextFontSize,
    textFontWeight,
    setTextFontWeight,
    textFontStyle,
    setTextFontStyle,
    isCaseSensitive,
    setIsCaseSensitive,
    isCaseUpper,
    setIsCaseUpper,
    isCaseLower,
    setIsCaseLower,
    text,
    setText,
    textColor,
    setTextColor,
  } = useWhiteBoardStore();
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
      case "caseSensitive":
        activeObject.set(
          "text",
          activeObject.text.replace(/\b\w/g, (char) => char.toUpperCase())
        );
        setIsCaseSensitive(true);
        setIsCaseUpper(false);
        setIsCaseLower(false);
        break;
      case "caseUpper":
        activeObject.set("text", activeObject.text.toUpperCase());
        setIsCaseUpper(true);
        setIsCaseSensitive(false);
        setIsCaseLower(false);
        break;
      case "caseLower":
        activeObject.set("text", activeObject.text.toLowerCase());
        setIsCaseLower(true);
        setIsCaseSensitive(false);
        setIsCaseUpper(false);
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

  const handleColorChange = (color: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!(activeObject instanceof IText)) return;

    activeObject.set("fill", color);
    setTextColor(color);
    canvas.renderAll();
  };

  return (
    <div className="text-settings animateSlideInRight">
      <p className="draw-title mb-2">Text</p>
      <div className="mt-2">
        <TextArea
          placeholder="Enter text"
          style={{ borderColor: "#313131" }}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <p className="draw-title mb-2">Default styles</p>
      <div className="text-settings-item-container">
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(16)}
          id={textFontSize === 16 ? "activeStyle" : ""}
        >
          <Heading1 size={18} />
        </i>
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(20)}
          id={textFontSize === 20 ? "activeStyle" : ""}
        >
          <Heading2 size={18} />
        </i>
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(24)}
          id={textFontSize === 24 ? "activeStyle" : ""}
        >
          <Heading3 size={18} />
        </i>
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(28)}
          id={textFontSize === 28 ? "activeStyle" : ""}
        >
          <Heading4 size={18} />
        </i>
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(32)}
          id={textFontSize === 32 ? "activeStyle" : ""}
        >
          <Heading5 size={18} />
        </i>
        <i
          className="text-settings-item"
          onClick={() => handleFontSize(36)}
          id={textFontSize === 36 ? "activeStyle" : ""}
        >
          <Heading6 size={18} />
        </i>
      </div>
      <div className="mt-3">
        <p className="draw-title mb-2">Font styles</p>
        <Dropdown
          options={fontSizeOptions}
          onChange={(value) => handleFontSize(value.value)}
          value={fontSizeOptions.find(
            (option) => option.value === textFontSize
          )}
          withBorder
        />
        <Space gap={5} className="mt-1">
          <div style={{ width: "100%" }}>
            <Dropdown
              options={fontOptions}
              onChange={(value) => handleFontFamily(value.value)}
              value={fontOptions.find(
                (option) => option.value === textFontStyle
              )}
              withBorder
            />
          </div>
          <div style={{ width: "100%" }}>
            <Dropdown
              options={fontWeightOptions}
              onChange={(value) => handleFontWeight(value.value)}
              value={fontWeightOptions.find(
                (option) => option.value === textFontWeight
              )}
              withBorder
            />
          </div>
        </Space>
      </div>

      <div
        className="text-settings-item-container"
        style={{ marginTop: "9px" }}
      >
        <i
          onClick={() => handleTextFormat("bold")}
          className="text-settings-item"
          id={isBold ? "activeStyle" : ""}
        >
          <Bold size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("italic")}
          className="text-settings-item"
          id={isItalic ? "activeStyle" : ""}
        >
          <Italic size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("underline")}
          className="text-settings-item"
          id={isUnderline ? "activeStyle" : ""}
        >
          <Underline size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("caseSensitive")}
          className="text-settings-item"
          id={isCaseSensitive ? "activeStyle" : ""}
        >
          <CaseSensitive size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("caseUpper")}
          className="text-settings-item"
          id={isCaseUpper ? "activeStyle" : ""}
        >
          <CaseUpper size={18} />
        </i>
        <i
          onClick={() => handleTextFormat("caseLower")}
          className="text-settings-item"
          id={isCaseLower ? "activeStyle" : ""}
        >
          <CaseLower size={18} />
        </i>
      </div>
      <div className="mt-3">
        <p className="draw-title mb-2">Color</p>
        <div className="text-settings-item-container">
          {colorOptions.map((color) => (
            <div
              key={color.value}
              className="text-settings-item p-2"
              style={{ width: "100%", height: "34px" }}
              onClick={() => handleColorChange(color.value)}
              id={textColor === color.value ? "activeStyle" : ""}
            >
              <div
                className="color-preview"
                style={{ backgroundColor: color.value }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextSettings;
