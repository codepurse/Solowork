import { Col, Container, Row } from "react-bootstrap";
import TaskWidgets from "../components/Pages/Dashboard/Widgets/TaskWidgets";
export default function Dashboard() {
  return (
    <Container className="dashboard-container">
      <Row>
        <Col>
          <TaskWidgets label="Task Completed" />
        </Col>
        <Col>
          <TaskWidgets label="In Progress" />
        </Col>
        <Col>
          <TaskWidgets label="Completed" />
        </Col>
        <Col>
          <TaskWidgets label="Cancelled" />
        </Col>
      </Row>
    </Container>
  );
}
