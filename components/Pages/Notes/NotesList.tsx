import dayjs from "dayjs";
import { Calendar, Pin } from "lucide-react";
import React from "react";
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
    emoji: string;
    pinned: boolean;
  }>;
}

export default function NotesList({ notesList }: Readonly<NotesListProps>) {
  const { useStoreNotes } = useStore();
  const { setSelectedNotes, setEditMode } = useStoreNotes();

  // Add a ref to keep track of previous notes length
  const prevNotesLength = React.useRef(notesList.length);
  // Add a ref to track initial load
  const isInitialLoad = React.useRef(true);

  // Determine if a note is new based on its index
  const isNewNote = (index: number) => {
    if (isInitialLoad.current) return false;
    return index === 0 && notesList.length > prevNotesLength.current;
  };

  // Update the ref after render
  React.useEffect(() => {
    if (isInitialLoad.current && notesList.length > 0) {
      isInitialLoad.current = false;
    }
    prevNotesLength.current = notesList.length;
  }, [notesList.length]);

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
      {notesList.map((note, index) => (
        <div
          key={note.$id}
          className={
            isNewNote(index)
              ? "animate__animated animate__slideInLeft animate__faster"
              : ""
          }
        >
          <div
            className="note"
            onClick={() => {
              handleClick(note);
            }}
          >
            <Space gap={5} className="mb-2">
              {note.emoji && (
                <span className="note-emoji" style={{ fontSize: "14px" }}>
                  {note.emoji}
                </span>
              )}
              <Space gap={5} align="evenly" fill>
                <h3 className="note-title mb-0">{note.title}</h3>
                {note.pinned && (
                  <i>
                    <Pin size={17} color="#EC407A" />
                  </i>
                )}
              </Space>
            </Space>
            <div className="note-content">
              <LexicalEditor
                value={note.content}
                editable={false}
                hideToolbar
                onChange={() => {}}
                spellCheck={false}
                hidePlaceholder={true}
                hideFloatingToolbar={true}
              />
            </div>
            <Space gap={5} align="evenly" className="mt-3">
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
        </div>
      ))}
    </div>
  );
}
