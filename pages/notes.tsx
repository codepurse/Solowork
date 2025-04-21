import { PenLine, Search } from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
import NotesList from "../components/Pages/Notes/NotesList";
import SelectedNotes from "../components/Pages/Notes/SelectedNotes";
import Space from "../components/space";
import useStoreNotes from "../store/store";

export default function Notes() {
  const { hideSideNotes } = useStoreNotes();
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
                />
              </Space>
            </div>
            <NotesList />
          </Col>
        )}
        <Col className="p-0">
          <SelectedNotes />
        </Col>
      </Row>
    </Container>
  );
}
