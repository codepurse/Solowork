import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode } from "@lexical/rich-text";
import { $createTextNode, $getSelection, $isRangeSelection, TextFormatType } from "lexical";
import { Bold, Heading1, Heading2, Heading3, Italic, Strikethrough, Underline } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

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
          }
        } else {
          setIsVisible(false);
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
        
        // Create a new heading node with text
        const headingNode = new HeadingNode(`h${level}`);
        const textNode = $createTextNode(selectedText);
        headingNode.append(textNode);
        
        // Replace the selected content with the new heading
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
        <button onClick={() => formatHeading(1)} className="toolbar-button" title="Heading 1">
          <Heading1 size={16} />
        </button>
        <button onClick={() => formatHeading(2)} className="toolbar-button" title="Heading 2">
          <Heading2 size={16} />
        </button>
        <button onClick={() => formatHeading(3)} className="toolbar-button" title="Heading 3">
          <Heading3 size={16} />
        </button>
      </div>
      <div className="toolbar-separator" />
      <div className="toolbar-group">
        <button onClick={() => formatText("bold")} className="toolbar-button" title="Bold">
          <Bold size={16} />
        </button>
        <button onClick={() => formatText("italic")} className="toolbar-button" title="Italic">
          <Italic size={16} />
        </button>
        <button onClick={() => formatText("underline")} className="toolbar-button" title="Underline">
          <Underline size={16} />
        </button>
        <button onClick={() => formatText("strikethrough")} className="toolbar-button" title="Strikethrough">
          <Strikethrough size={16} />
        </button>
      </div>
    </div>
  );
} 