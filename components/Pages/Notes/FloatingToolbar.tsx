import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import {
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
} from "lexical";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [activeFormats, setActiveFormats] = useState<Set<TextFormatType>>(
    new Set()
  );
  const [activeHeading, setActiveHeading] = useState<number | null>(null);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          const domSelection = window.getSelection();
          if (domSelection && domSelection.rangeCount > 0) {
            const range = domSelection.getRangeAt(0).getBoundingClientRect();
            setPosition({
              top: range.top - 50,
              left: range.left + range.width / 2 - 100,
            });
            setIsVisible(true);

            const formats = new Set<TextFormatType>();
            if (selection.hasFormat("bold")) formats.add("bold");
            if (selection.hasFormat("italic")) formats.add("italic");
            if (selection.hasFormat("underline")) formats.add("underline");
            if (selection.hasFormat("strikethrough"))
              formats.add("strikethrough");

            setActiveFormats(formats);

            // Check for active heading
            const anchor = selection.anchor;
            const anchorNode = anchor.getNode();
            let parentNode = anchorNode.getParent();
            while (parentNode !== null) {
              if (parentNode instanceof HeadingNode) {
                const tag = parentNode.getTag();
                setActiveHeading(parseInt(tag.charAt(1)));
                break;
              }
              parentNode = parentNode.getParent();
            }
            if (!parentNode) {
              setActiveHeading(null);
            }
          }
        } else {
          setIsVisible(false);
          setActiveFormats(new Set());
          setActiveHeading(null);
        }
      });
    });
  }, [editor]);

  const formatText = (format: TextFormatType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.formatText(format);
      }
    });
  };

  const formatHeading = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();

        const headingNode = new HeadingNode(`h${level}`);
        const textNode = $createTextNode(selectedText);
        headingNode.append(textNode);

        selection.insertNodes([headingNode]);
      }
    });
  };

  if (!isVisible) return null;

  return (
    <div
      className="floating-toolbar"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
      }}
    >
      <div className="toolbar-group">
        <button
          onClick={() => formatHeading(1)}
          className="toolbar-button"
          title="Heading 1"
        >
          <Heading1 
            size={16}
            color={activeHeading === 1 ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
        <button
          onClick={() => formatHeading(2)}
          className="toolbar-button"
          title="Heading 2"
        >
          <Heading2 
            size={16}
            color={activeHeading === 2 ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
        <button
          onClick={() => formatHeading(3)}
          className="toolbar-button"
          title="Heading 3"
        >
          <Heading3 
            size={16}
            color={activeHeading === 3 ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
      </div>
      <div className="toolbar-separator" />
      <div className="toolbar-group">
        <button
          onClick={() => formatText("bold")}
          className="toolbar-button"
          title="Bold"
        >
          <Bold
            color={activeFormats.has("bold") ? "#7a3dff" : "#bdbdbd"}
            size={16}
          />
        </button>
        <button
          onClick={() => formatText("italic")}
          className="toolbar-button"
          title="Italic"
        >
          <Italic
            size={16}
            color={activeFormats.has("italic") ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
        <button
          onClick={() => formatText("underline")}
          className="toolbar-button"
          title="Underline"
        >
          <Underline
            size={16}
            color={activeFormats.has("underline") ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
        <button
          onClick={() => formatText("strikethrough")}
          className="toolbar-button"
          title="Strikethrough"
        >
          <Strikethrough
            size={16}
            color={activeFormats.has("strikethrough") ? "#7a3dff" : "#bdbdbd"}
          />
        </button>
      </div>
    </div>
  );
}
