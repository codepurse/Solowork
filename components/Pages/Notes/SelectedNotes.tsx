import { ID } from "appwrite";
import { Info, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Button from "../../Elements/Button";
import Space from "../../space";
import LexicalEditor from "./LexicalEditor";

interface SelectedNotesProps {
  selectedNote: any;
}

interface Note {
  $id?: string;
  title: string;
  content: string;
  tags: string[];
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

  useEffect(() => {
    if (selectedNotes) {
      console.log("selectedNotes", selectedNotes);
      const note = selectedNotes as unknown as Note;
      if (title !== note.title) setTitle(note.title);

      if (content !== note.content) {
        try {
          if (typeof note.content === "string") {
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

  const color = [
    {
      backgroundColor: "#101914",
      color: "#3DAF6C",
    },
    {
      backgroundColor: "#0F1419",
      color: "#32649C",
    },
    {
      backgroundColor: "#1A170F",
      color: "#B88F31",
    },
  ];

  const onClickMenu = () => {
    setHideSideNotes(!hideSideNotes);
  };

  const handleSave = async () => {
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await databases.createDocument(
          DATABASE_ID,
          NOTES_COLLECTION_ID,
          ID.unique(),
          {
            userId: user.$id,
            folderId: selectedNote,
            title: title,
            content: JSON.stringify(content),
            tags: tags,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Container className="selected-notes">
      <Row>
        <Col className="p-0">
          <div className="selected-notes-header">
            <Space align="evenly">
              <i onClick={onClickMenu}>
                <Menu size={17} />
              </i>
              <i>
                <Info size={17} />
              </i>
            </Space>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="selected-notes-title-container">
            <input
              type="text"
              placeholder="Enter a title"
              className="selected-notes-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Button onClick={handleSave} className="d-none">
              Save
            </Button>
            <div className="selected-notes-tags">
              <Space gap={10}>
                {tags.map((tag, index) => (
                  <div
                    key={tag}
                    className="selected-notes-tag"
                    style={{
                      color: color[index].color,
                    }}
                  >
                    {tag}
                  </div>
                ))}
              </Space>
            </div>
            <div className="lexical-notes">
              <LexicalEditor
                value={content}
                onChange={(e) => {
                  setContent(e);
                }}
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
