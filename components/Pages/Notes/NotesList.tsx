import { useStore } from "../../../store/store";
import LexicalEditor from "./LexicalEditor";
interface NotesListProps {
  notesList: Array<{
    $id: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function NotesList({ notesList }: Readonly<NotesListProps>) {
  const { useStoreNotes } = useStore();
  const { setSelectedNotes, setEditMode } = useStoreNotes();

  const handleClick = (note: any) => {
    setSelectedNotes(note);
    setEditMode(true);
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
          <h3 className="note-title">{note.title}</h3>
          <div className="note-content">
            <LexicalEditor value={note.content} editable={false} />
          </div>
        </div>
      ))}
    </div>
  );
}
