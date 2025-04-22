import { Col, Row } from "react-bootstrap";
import KanbanToDo from "./KanbanToDo";

export default function KanbanBoard() {
  return (
    <Row className="mt-3">
      <Col>
        <KanbanToDo label="To Do" count={10} />
      </Col>
      <Col>
        <KanbanToDo label="In Progress" count={10} />
      </Col>
      <Col>
        <KanbanToDo label="Completed" count={10} />
      </Col>
      <Col>
        <KanbanToDo label="Cancelled" count={10} />
      </Col>
    </Row>
  );
}
