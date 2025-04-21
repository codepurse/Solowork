import { Info } from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
import Space from "../../space";
import LexicalEditor from "./LexicalEditor";

export default function SelectedNotes() {
  const tags = ["Document", "Project", "Task"];

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
  return (
    <Container className="selected-notes">
      <Row>
        <Col className="p-0">
          <div className="selected-notes-header">
            <Space align="end">
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
            />
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
              <LexicalEditor />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
