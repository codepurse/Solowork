import dayjs from "dayjs";
import { Calendar, EllipsisVertical } from "lucide-react";
import { useStore } from "../../../store/store";
import Badge from "../../Elements/Badge";
import Space from "../../space";
import LexicalEditor from "./LexicalEditor";

interface NotesListProps {
  notesList: Array<{
    $id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
  }>;
}

export default function NotesList({ notesList }: Readonly<NotesListProps>) {
  const { useStoreNotes } = useStore();
  const { setSelectedNotes, setEditMode } = useStoreNotes();

  const handleClick = (note: any) => {
    setSelectedNotes(note);
    setEditMode(true);
  };

  const taggClasses = ["badge-blue", "badge-green", "badge-yellow"];

  const randomTagClass = () => {
    return taggClasses[Math.floor(Math.random() * taggClasses.length)];
  };

  return (
    <div className="notes-list">
      {notesList.map((note) => (
        <div
          key={note.$id}
          className="note"
          onClick={() => {
            handleClick(note);
          }}
        >
          <Space gap={5} align="evenly">
            <h3 className="note-title">{note.title}</h3>
            <i style={{ cursor: "pointer", marginTop: "-5px" }}>
              <EllipsisVertical size={16} color="#888" />
            </i>
          </Space>
          <div className="note-content">
            <LexicalEditor value={note.content} editable={false} hideToolbar />
          </div>
          <Space gap={5} align="evenly" className="mt-2">
            <Space gap={5}>
              <i style={{ marginTop: "-3px" }}>
                <Calendar size={14} color="#BDBDBD" />
              </i>
              <span className="note-date">
                {dayjs(note.createdAt).format("DD-MM-YYYY")}
              </span>
            </Space>
            <div className="note-tags">
              {note.tags.length > 0 && (
                <Badge className={randomTagClass()}>{note.tags[0]}</Badge>
              )}
              {note.tags.length > 1 && (
                <Badge className="badge-blue">+{note.tags.length - 1}</Badge>
              )}
            </div>
          </Space>
        </div>
      ))}
    </div>
  );
}
