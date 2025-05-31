import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Plus,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
  const { useStoreNotes, useStoreUser } = useStore();
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

  useEffect(() => {
    if (selectedNotes) {
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
          if (typeof note.content === "string" && note.content !== "") {
            const parsedContent = JSON.parse(note.content);
            setContent(parsedContent);
          } else {
            setContent(note.content);
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
    setIsSaving(true);
    if (isSaving) {
      return;
    }
    if (editMode) {
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
      } catch (error) {
        console.log(error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasChanges) {
        handleSave();
        setHasChanges(false);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [
    title,
    hasChanges,
    editMode,
    emoji,
    tags,
    selectedNote,
    content,
    user.$id,
    isSaving,
  ]);

  return (
    <Container className="selected-notes">
      <Row>
        <Col>
          <div className="selected-notes-title-container">
            <Space gap={5} align="evenly" className="mb-3">
              <p className="selected-notes-folder-name">
                Parent Folder / Child Folder / Sub Child Folder
              </p>
              <div>
                <Space gap={10}>
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
                  <i className="settings-icon">
                    <Settings size={20} />
                  </i>
                </Space>
              </div>
            </Space>
            <BannerNotes selectedNote={selectedNotes} />
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
                  size={24}
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
                }}
                hideToolbar={true}
                editable={true}
                spellCheck={false}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
