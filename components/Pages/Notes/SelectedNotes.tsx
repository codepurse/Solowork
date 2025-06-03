import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Plus,
  Settings,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Badge from "../../Elements/Badge";
import Space from "../../space";
import BannerNotes from "./Banner/BannerNotes";
import EmojiNotes from "./EmojiNotes";
import LexicalEditor from "./LexicalEditor";
import NoteSettings from "./NotesSettings";
import { StarButton } from "./StarNotes";
import TagsNotes from "./TagsNotes";
interface SelectedNotesProps {
  selectedNote: any;
}

interface Note {
  $id?: string;
  title: string;
  content: string;
  tags: string[];
  emoji: string;
  isStarred: boolean;
}

export default function SelectedNotes({
  selectedNote,
}: Readonly<SelectedNotesProps>) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { useStoreNotes, useStoreUser, useNoteSettings } = useStore();
  const { hideSideNotes, setHideSideNotes, selectedNotes, editMode } =
    useStoreNotes();
  const { user } = useStoreUser();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<any>(null);
  const [tags, setTags] = useState<any>([]);
  const [showEmojiNotes, setShowEmojiNotes] = useState<boolean>(false);
  const [emoji, setEmoji] = useState<string>("❔");
  const [showTagsNotes, setShowTagsNotes] = useState<boolean>(false);
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const { noteSettings, setNoteSettings } = useNoteSettings();
  const [parentWidth, setParentWidth] = useState<number>(0);
  const [metrics, setMetrics] = useState({
    wordCount: 0,
    charCount: 0,
    lineCount: 0,
    readingTime: 0,
  });

  useEffect(() => {
    if (selectedNotes) {
      setNoteSettings({
        hideBanner: selectedNotes.hideNotesBanner,
        spellCheck: selectedNotes.spellCheck,
        autoSave: selectedNotes.autoSave,
        focusMode: selectedNotes.focusMode,
        showFooter: selectedNotes.showFooter,
        readOnly: selectedNotes.readOnly,
        pinned: selectedNotes.pinned,
      });
    }
  }, [selectedNotes]);

  useEffect(() => {
    if (selectedNotes) {
      console.log(selectedNotes, "selectedNotes");
      const note = selectedNotes as unknown as Note;
      setTitle(note?.title);
      if (note?.emoji) {
        setEmoji(note?.emoji);
      } else {
        setEmoji("❔");
      }
      setIsStarred(note?.isStarred);

      if (content !== note.content) {
        try {
          if (
            typeof note.content === "string" &&
            note.content !== "" &&
            note.content !== null
          ) {
            const parsedContent = JSON.parse(note.content);
            setContent(parsedContent);
          } else {
            if (note.content === null) {
              console.log("null");
              setContent(null);
            } else {
              console.log("not null");
              setContent(note.content);
            }
          }
        } catch (e) {
          console.error("Failed to parse note content:", e);
          setContent(note.content);
        }
      }
      if (JSON.stringify(tags) !== JSON.stringify(note.tags))
        setTags(note.tags || []);
    }
  }, [selectedNotes]);

  const handleSave = async () => {
    if (!editMode) return;

    try {
      await databases.updateDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        (selectedNotes as any).$id,
        {
          userId: user.$id,
          folderId: selectedNote,
          title: title,
          content: JSON.stringify(content),
          tags: tags,
          emoji: emoji,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isStarred: isStarred,
        }
      );
      mutate(`notes/${selectedNote}`);
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  // Remove both existing useEffects for auto-saving and replace with this single useEffect
  useEffect(() => {
    let saveTimeoutId: NodeJS.Timeout | null = null;

    const performSave = async () => {
      if (!hasChanges || isSaving || !editMode) return;

      try {
        setIsSaving(true);
        await handleSave();
        setHasChanges(false);
      } finally {
        setIsSaving(false);
      }
    };

    if (hasChanges) {
      // Clear any existing timeout to prevent multiple saves
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
      // Set a new timeout for debounced saving
      saveTimeoutId = setTimeout(performSave, 500);
    }

    // Cleanup function
    return () => {
      if (saveTimeoutId) {
        clearTimeout(saveTimeoutId);
      }
    };
  }, [hasChanges, isSaving, editMode, title, content, tags, emoji, isStarred]); // Include all relevant dependencies

  useEffect(() => {
    if (!parentRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setParentWidth(entry.contentRect.width + 30);
      }
    });

    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const calculateMetrics = (editorContent: any) => {
    if (!editorContent || !editorContent.root || !editorContent.root.children) {
      return {
        wordCount: 0,
        charCount: 0,
        lineCount: 0,
        readingTime: 0,
      };
    }

    let text = "";
    // Extract text from all paragraphs
    editorContent.root.children.forEach((node: any) => {
      if (node.children) {
        node.children.forEach((child: any) => {
          if (child.text) {
            text += child.text + " ";
          }
        });
        text += "\n";
      }
    });

    // Calculate metrics
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);
    const chars = text.replace(/\s/g, "").length;
    const lines = editorContent.root.children.length;

    // Average reading speed is about 200-250 words per minute
    // We'll use 200 for a conservative estimate
    const readingTimeMinutes = Math.ceil(words.length / 200);

    return {
      wordCount: words.length,
      charCount: chars,
      lineCount: lines,
      readingTime: readingTimeMinutes,
    };
  };

  return (
    <Container className="selected-notes">
      <Row>
        <Col ref={parentRef} style={{ height: "100vh", position: "relative" }}>
          <div className="selected-notes-title-container">
            {showSettings && (
              <NoteSettings
                noteId={selectedNotes.$id}
                setShowSettings={setShowSettings}
                selectedNote={selectedNotes}
              />
            )}
            <Space gap={5} align="evenly" className="mb-3">
              <i
                className="settings-icon"
                onClick={() => setHideSideNotes(!hideSideNotes)}
              >
                {hideSideNotes ? (
                  <ChevronsLeftRight size={20} />
                ) : (
                  <ChevronsRightLeft size={20} />
                )}
              </i>
              <i
                className="settings-icon"
                onClick={() => {
                  setShowSettings(!showSettings);
                }}
              >
                <Settings size={20} />
              </i>
            </Space>
            {!noteSettings.hideBanner && (
              <BannerNotes selectedNote={selectedNotes} />
            )}
            <Space gap={5} style={{ position: "relative" }} align="evenly">
              <Space gap={7}>
                <div
                  className="selected-notes-title-icon"
                  onClick={() => setShowEmojiNotes((e) => !e)}
                >
                  {emoji}
                </div>
                {showEmojiNotes && (
                  <EmojiNotes
                    onClose={() => setShowEmojiNotes(false)}
                    onSelect={(emoji) => {
                      setEmoji(emoji);
                      setHasChanges(true);
                      setShowEmojiNotes(false);
                    }}
                  />
                )}
                <input
                  type="text"
                  placeholder="New post title here..."
                  className="selected-notes-title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    console.log("title", title);
                    setHasChanges(true);
                  }}
                />
              </Space>
              <div>
                <StarButton
                  isStarred={isStarred}
                  onToggle={() => {
                    setIsStarred(!isStarred);
                    setHasChanges(true);
                  }}
                  size={20}
                />
              </div>
            </Space>
            <Space gap={5} className="mt-3 ml-1">
              {tags.map((tag, index) => (
                <Badge key={index} index={index} randomColor={true}>
                  {tag}
                </Badge>
              ))}
              <Space gap={5} style={{ position: "relative" }}>
                <i
                  style={{ marginTop: "-4px" }}
                  onClick={() => setShowTagsNotes((e) => !e)}
                >
                  <Plus size={15} color="#bdbdbd" />
                </i>
                <span
                  className="add-tag"
                  onClick={() => setShowTagsNotes((e) => !e)}
                >
                  Add tags
                </span>
                {showTagsNotes && (
                  <TagsNotes
                    onClose={() => {
                      setShowTagsNotes(false);
                      setHasChanges(true);
                    }}
                    setTags={setTags}
                    tags={tags}
                  />
                )}
              </Space>
            </Space>
            <hr className="not-faded-line" />
            <div className="lexical-notes">
              <LexicalEditor
                value={content}
                onChange={(e) => {
                  setContent(e);
                  setHasChanges(true);
                  setMetrics(calculateMetrics(e));
                }}
                hideToolbar={true}
                editable={!noteSettings.readOnly}
                spellCheck={noteSettings.spellCheck}
              />
            </div>
          </div>
          {noteSettings.showFooter && (
            <div
              className="selected-notes-footer animate__animated animate__slideInUp"
              style={{
                width: parentWidth,
              }}
            >
              <Space gap={10} align="evenly">
                <Space gap={10}>
                  <p className="selected-notes-footer-text">
                    Words count: {metrics.wordCount}
                  </p>
                  <span className="selected-notes-footer-text-separator">
                    &#183;
                  </span>
                  <p className="selected-notes-footer-text">
                    Characters count: {metrics.charCount}
                  </p>
                  <span className="selected-notes-footer-text-separator">
                    &#183;
                  </span>
                  <p className="selected-notes-footer-text">
                    Lines count: {metrics.lineCount}
                  </p>
                </Space>
                <p className="selected-notes-footer-text">
                  Reading time: {metrics.readingTime}{" "}
                  {metrics.readingTime === 1 ? "minute" : "minutes"}
                </p>
              </Space>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}
