import { Query } from "appwrite";
import { PenLine, Search } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useSWR from "swr";
import NotesList from "../../components/Pages/Notes/NotesList";
import SelectedNotes from "../../components/Pages/Notes/SelectedNotes";
import Space from "../../components/space";
import {
  DATABASE_ID,
  databases,
  NOTES_COLLECTION_ID,
} from "../../constant/appwrite";
import { useStore } from "../../store/store";

export default function Notes() {
  const { useStoreNotes, useStoreUser } = useStore();
  const { hideSideNotes } = useStoreNotes();
  const { user } = useStoreUser();
  const router = useRouter();
  const { notes } = router.query;
  const [notesList, setNotesList] = useState<any[]>([]);
  const [search, setSearch] = useState<string>("");

  const fetchSelectedNote = async (noteId: string) => {
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        NOTES_COLLECTION_ID,
        [Query.equal("folderId", noteId)]
      );
      return res.documents;
    } catch (error) {
      console.log(error);
    }
  };

  const { data } = useSWR(`notes/${notes}`, () =>
    fetchSelectedNote(notes as string)
  );

  useEffect(() => {
    if (data) {
      console.log(data, "data");
      setNotesList(data);
    }
  }, [data]);

  return (
    <Container fluid className="notes-container">
      <Row style={{ height: "100%" }}>
        {!hideSideNotes && (
          <Col className="col-side-notes">
            <div className="all-notes-container">
              <Space align="evenly">
                <p className="all-notes">All Notes</p>
                <i>
                  <PenLine size={17} />
                </i>
              </Space>
            </div>
            <div className="search-notes">
              <Space gap={10}>
                <i>
                  <Search size={17} color="#888" />
                </i>
                <input
                  type="text"
                  placeholder="Search all notes"
                  className="search-notes-input"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setNotesList(
                      data.filter((note) => {
                        return note.title
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase());
                      })
                    );
                  }}
                />
              </Space>
            </div>
            <NotesList notesList={notesList} />
          </Col>
        )}
        <Col className="p-0">
          <SelectedNotes selectedNote={notes} />
        </Col>
      </Row>
    </Container>
  );
}
