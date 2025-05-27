import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  TextNode,
} from "lexical";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Palette,
  Strikethrough,
  Underline
} from "lucide-react";
import { useEffect, useState } from "react";

type FontSize = "12px" | "16px" | "20px" | "24px";
type Alignment = "left" | "center" | "right";
type ListType = "bullet" | "number";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState<FontSize>("16px");
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string>("#ffffff");
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(new Set());

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const formats = new Set<TextFormatType>();
          if (selection.hasFormat('bold')) formats.add('bold');
          if (selection.hasFormat('italic')) formats.add('italic');
          if (selection.hasFormat('underline')) formats.add('underline');
          if (selection.hasFormat('strikethrough')) formats.add('strikethrough');
          setActiveFormats(formats);
        }
      });
    });
  }, [editor]);

  const formatText = (format: TextFormatType): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          // If no text is selected, insert a space to prevent empty state
          selection.insertText(" ");
        }
        selection.formatText(format);
      }
    });
  };

  const formatAlignment = (alignment: Alignment): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          selection.insertText(" ");
        }
        selection.getNodes().forEach((node) => {
          if (node instanceof TextNode) {
            node.setFormat(0);
            node.setStyle(`text-align: ${alignment}`);
          }
        });
      }
    });
  };

  const formatHeading = (level: 1 | 2 | 3): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          selection.insertText(" ");
        }
        selection.getNodes().forEach((node) => {
          if (node instanceof TextNode) {
            node.setFormat(0);
            node.setStyle(
              `font-size: ${
                level === 1 ? "2em" : level === 2 ? "1.5em" : "1.17em"
              }; font-weight: bold;`
            );
          }
        });
      }
    });
  };

  const formatList = (type: ListType): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          selection.insertText(" ");
        }
        if (type === "bullet") {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      }
    });
  };

  const clearFormatting = (): void => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node instanceof TextNode) {
            node.setFormat(0);
            node.setStyle("");
          }
        });
      }
    });
  };

  const changeFontSize = (size: FontSize): void => {
    setFontSize(size);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node instanceof TextNode) {
            if (node.hasFormat("bold")) {
              node.setFormat("bold");
            }
            if (node.hasFormat("italic")) {
              node.setFormat("italic");
            }
            if (node.hasFormat("underline")) {
              node.setFormat("underline");
            }
            node.setStyle(`font-size: ${size}`);
          }
        });
      }
    });
  };

  const changeTextColor = (color: string): void => {
    setSelectedColor(color);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node instanceof TextNode) {
            node.setStyle(`color: ${color}`);
          }
        });
      }
    });
  };

  const predefinedColors: string[] = [
    "#ffffff", // white
    "#000000", // black
    "#ff0000", // red
    "#00ff00", // green
    "#0000ff", // blue
    "#ffff00", // yellow
    "#ff00ff", // magenta
    "#00ffff", // cyan
    "#ffa500", // orange
    "#800080", // purple
  ];

  return (
    <div className="lexical-toolbar">
      <div className="toolbar-group">
        <button
          onClick={() => formatText("bold")}
          className={`toolbar-button ${activeFormats.has('bold') ? 'toolbar-button-active' : ''}`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          onClick={() => formatText("italic")}
          className={`toolbar-button ${activeFormats.has('italic') ? 'toolbar-button-active' : ''}`}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          onClick={() => formatText("underline")}
          className={`toolbar-button ${activeFormats.has('underline') ? 'toolbar-button-active' : ''}`}
          title="Underline"
        >
          <Underline size={14} />
        </button>
        <button
          onClick={() => formatText("strikethrough")}
          className={`toolbar-button ${activeFormats.has('strikethrough') ? 'toolbar-button-active' : ''}`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          onClick={() => formatHeading(1)}
          className="toolbar-button"
          title="Heading 1"
        >
          <Heading1 size={14} />
        </button>
        <button
          onClick={() => formatHeading(2)}
          className="toolbar-button"
          title="Heading 2"
        >
          <Heading2 size={14} />
        </button>
        <button
          onClick={() => formatHeading(3)}
          className="toolbar-button"
          title="Heading 3"
        >
          <Heading3 size={14} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          onClick={() => formatAlignment("left")}
          className="toolbar-button"
          title="Align Left"
        >
          <AlignLeft size={14} />
        </button>
        <button
          onClick={() => formatAlignment("center")}
          className="toolbar-button"
          title="Align Center"
        >
          <AlignCenter size={14} />
        </button>
        <button
          onClick={() => formatAlignment("right")}
          className="toolbar-button"
          title="Align Right"
        >
          <AlignRight size={14} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          onClick={() => formatList("bullet")}
          className="toolbar-button"
          title="Bullet List"
        >
          <List size={14} />
        </button>
        <button
          onClick={() => formatList("number")}
          className="toolbar-button"
          title="Numbered List"
        >
          <ListOrdered size={14} />
        </button>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <button
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.formatText("code");
              }
            });
          }}
          className="toolbar-button"
          title="Code Block"
        >
          <Code size={14} />
        </button>
     {/*    <button
          onClick={clearFormatting}
          className="toolbar-button"
          title="Clear Formatting"
        >
          <X size={14} />
        </button> */}
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group">
        <select
          value={fontSize}
          onChange={(e) => changeFontSize(e.target.value as FontSize)}
          className="font-size-select"
        >
          <option value="12px">Small</option>
          <option value="16px">Normal</option>
          <option value="20px">Large</option>
          <option value="24px">Larger</option>
        </select>
      </div>

      <div className="toolbar-separator" />

      <div className="toolbar-group color-picker-group">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="toolbar-button"
          title="Text Color"
        >
          <Palette size={14} />
        </button>
        {showColorPicker && (
          <div className="color-picker-dropdown">
            <div className="color-picker-grid">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  className="color-option"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    changeTextColor(color);
                    setShowColorPicker(false);
                  }}
                  title={color}
                />
              ))}
            </div>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => changeTextColor(e.target.value)}
              className="color-input"
            />
          </div>
        )}
      </div>
    </div>
  );
}
