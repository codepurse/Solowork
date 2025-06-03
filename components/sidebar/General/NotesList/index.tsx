import { Query } from "appwrite";
import { Folders } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_FOLDER_ID,
} from "../../../../constant/appwrite";
import { useStore } from "../../../../store/store";
import Space from "../../../space";

export default function NotesList() {
  const { useStoreUser, useStoreNotes, useSidebar } = useStore();
  const router = useRouter();
  const { user } = useStoreUser();
  const { setNotesFolders, setSelectedNotes } = useStoreNotes();
  const { sidebarSelected, setSidebarSelected } = useSidebar();
  useSidebar();

  const fetchNotes = async () => {
    const res = await databases.listDocuments(DATABASE_ID, NOTES_FOLDER_ID, [
      Query.equal("userId", user.$id),
    ]);
    return res.documents;
  };

  const { data } = useSWR("notes", fetchNotes);

  const handleNoteClick = (noteId: string) => {
    router.push(`/notes/${noteId}`);
    setSelectedNotes(null);
  };

  useEffect(() => {
    if (data) {
      setNotesFolders(data);
    }
  }, [data]);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      className="sidebar-menu-item-container"
    >
      <Space
        direction="column"
        gap={4}
        alignItems="start"
        className="sidebar-menu-item-container-notes"
        style={{ borderLeft: "1px solid #3d3d3d" }}
      >
        {data?.map((note) => (
          <Space
            gap={10}
            key={note.$id}
            id={note.$id === sidebarSelected ? "selectedNote" : ""}
            className="sidebar-menu-item-container-notes-item"
            onClick={() => {
              handleNoteClick(note.$id);
              setSidebarSelected(note.$id);
            }}
          >
            <i>
              <Folders size={15} color="#888" />
            </i>
            <label className="sidebar-dropdown-item">{note.name}</label>
          </Space>
        ))}
      </Space>
    </div>
  );
}
