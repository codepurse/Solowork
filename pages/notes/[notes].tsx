import { Query } from "appwrite";
import { PenLine } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useSWR from "swr";
import EmptyNotes from "../../components/Pages/Notes/EmptyNotes";
import NotesList from "../../components/Pages/Notes/NotesList";
import SelectedNotes from "../../components/Pages/Notes/SelectedNotes";
import SelectedNotesHeader from "../../components/Pages/Notes/SelectedNotesHeader";
import Space from "../../components/space";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../constant/appwrite";
import { useStore } from "../../store/store";

export default function Notes() {
  const { useStoreNotes } = useStore();
  const { hideSideNotes, selectedNotes } = useStoreNotes();
  const router = useRouter();
  const { notes } = router.query;
  const [notesList, setNotesList] = useState<any[]>([]);

  const fetchSelectedNote = async (noteId: string) => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [Query.equal("folderId", noteId)]
      );

      const sortedDocuments = res.documents.toSorted((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return (
          new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime()
        );
      });

      return sortedDocuments;
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useSWR(`notes/${notes}`, () =>
    fetchSelectedNote(notes as string)
  );

  useEffect(() => {
    if (data) {
      console.log("data", data);
      setNotesList(data);
    }
  }, [data]);

  return (
    <Container fluid className="notes-container">
      <Row style={{ height: "100%" }}>
        <Col className={`col-side-notes ${hideSideNotes ? "hidden" : ""}`}>
          <div className="all-notes-container">
            <Space align="evenly">
              <p className="all-notes">All Notes</p>
              <i>
                <PenLine size={17} />
              </i>
            </Space>
          </div>
          <SelectedNotesHeader
            setNotesList={setNotesList}
            notesId={notes as string}
            notesList={notesList}
          />
          <NotesList notesList={notesList} />
        </Col>
        <Col className="p-0">
          {selectedNotes ? (
            <SelectedNotes selectedNote={notes} />
          ) : (
            <EmptyNotes />
          )}
        </Col>
      </Row>
    </Container>
  );
}
