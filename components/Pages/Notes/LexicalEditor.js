import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import ErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { useEffect } from "react";
import FloatingToolbar from "./FloatingToolbar";
import Toolbar from "./Toolbar";

function EditorUpdatePlugin({ editorState }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Only update if there's valid editor state and editor is not already focused
    if (!editorState) return;

    const updateEditor = () => {
      try {
        let parsedState;

        if (typeof editorState === "string") {
          // Parse the string to get JSON
          parsedState = JSON.parse(editorState);
        } else {
          // If it's already an object/JSON
          parsedState = editorState;
        }

        // Only set state if it's different from current state
        const currentEditorState = editor.getEditorState().toJSON();
        if (
          JSON.stringify(currentEditorState) !== JSON.stringify(parsedState)
        ) {
          editor.setEditorState(editor.parseEditorState(parsedState));
        }
      } catch (e) {
        console.error("Failed to parse editor state:", e);
      }
    };

    // Only run this once when the component mounts or when editorState changes
    updateEditor();
  }, [editor, editorState]);

  return null;
}

function EditablePlugin({ editable }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
}

function SpellCheckPlugin({ spellCheck }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Get all contenteditable elements within the editor
    const rootElement = editor.getRootElement();
    if (rootElement) {
      // Set spellcheck on the root element
      rootElement.spellcheck = spellCheck;
      
      // Find and set spellcheck on the ContentEditable element
      const contentEditableElement = rootElement.querySelector('[contenteditable="true"]');
      if (contentEditableElement) {
        contentEditableElement.spellcheck = spellCheck;
      }

      // Force a re-render of the contenteditable to apply spellcheck
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(rootElement);
      selection.removeAllRanges();
      selection.addRange(range);
      selection.removeAllRanges();
    }
  }, [editor, spellCheck]);

  return null;
}

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  placeholder: "editor-placeholder",
  paragraph: "editor-paragraph",
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic", 
    underline: "editor-text-underline",
    strikethrough: "editor-text-strikethrough",
    code: "editor-text-code",
  },
};

function onError(error) {
  console.error(error);
}

export default function LexicalEditor({
  value,
  onChange,
  spellCheck,
  editable = true,
  hideToolbar = false,
  hidePlaceholder = false,
  hideFloatingToolbar = false,
}) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    editable: true,
    spellCheck: true,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        {!hideToolbar && <Toolbar />}
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={
            !hidePlaceholder && (
              <div className="editor-placeholder">Enter some text...</div>
            )
          }
          ErrorBoundary={ErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <ListPlugin />
        {!hideFloatingToolbar && <FloatingToolbar />}
        <EditorUpdatePlugin editorState={value} />
        <EditablePlugin editable={editable} />
        <SpellCheckPlugin spellCheck={spellCheck ?? true} />
        {onChange && (
          <OnChangePlugin
            onChange={(editorState) => {
              onChange(editorState.toJSON());
            }}
          />
        )}
      </div>
    </LexicalComposer>
  );
}
