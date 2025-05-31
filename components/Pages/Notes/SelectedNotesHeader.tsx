import { ID, Query } from "appwrite";
import { ListFilter, Plus, Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { mutate } from "swr";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../../constant/appwrite";
import { useStore } from "../../../store/store";
import Space from "../../space";
type SelectedNotesHeaderProps = {
  setNotesList: (notes: any[]) => void;
  notesId: string;
};

export default function SelectedNotesHeader({
  setNotesList,
  notesId,
}: Readonly<SelectedNotesHeaderProps>) {
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { useStoreUser, useStoreNotes } = useStore();
  const { user } = useStoreUser();
  const { setSelectedNotes, setEditMode } = useStoreNotes();

  const router = useRouter();
  const folderId =
    typeof router.query?.notes === "string" ? router.query.notes : undefined;

  useEffect(() => {
    if (isSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearch]);

  const handleAddNote = async () => {
    console.log(folderId);
    try {
      await databases.createDocument(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        ID.unique(),
        {
          title: "New Note",
          content: "",
          tags: [],
          emoji: "❔",
          isStarred: false,
          userId: user.$id,
          folderId: folderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      const res = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [Query.equal("folderId", notesId), Query.orderDesc("$createdAt")]
      );
      setEditMode(true);
      mutate(`notes/${notesId}`);
      setNotesList(res.documents);
      setSelectedNotes(res.documents[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="notes-list-header">
      {isSearch ? (
        <Space
          key={2}
          className="search-notes animate__animated animate__slideInDown"
          align="evenly"
        >
          <Space gap={2}>
            <i>
              <Search size={17} color="#888" />
            </i>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search all notes"
              className="search-notes-input"
            />
          </Space>
          <i
            style={{ marginBottom: "-1px" }}
            onClick={() => setIsSearch(false)}
          >
            <X size={20} color="#888" />
          </i>
        </Space>
      ) : (
        <Space
          gap={5}
          align="evenly"
          key={1}
          className="animate__animated animate__slideInDown"
          style={{ animationDuration: "0.2s" }}
        >
          <p className="notes-list-header-title">All Notes</p>
          <div>
            <Space gap={7}>
              <i onClick={() => setIsSearch(true)}>
                <Search size={18} />
              </i>
              <i>
                <ListFilter size={18} />
              </i>
              <i onClick={handleAddNote}>
                <Plus size={18} />
              </i>
            </Space>
          </div>
        </Space>
      )}
    </div>
  );
}
