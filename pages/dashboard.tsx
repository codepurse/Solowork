import { Col, Container, Row } from "react-bootstrap";
import TaskWidgets from "../components/Pages/Dashboard/Widgets/TaskWidgets";
export default function Dashboard() {
  return (
    <Container className="dashboard-container">
      <Row>
        <Col>
          <TaskWidgets label="To Do" subLabel="Waiting for approval" />
        </Col>
        <Col>
          <TaskWidgets
            label="In Progress"
            subLabel="Curently being worked on"
          />
        </Col>
        <Col>
          <TaskWidgets label="Completed" subLabel="Task finished last month" />
        </Col>
        <Col>
          <TaskWidgets label="Cancelled" subLabel="Task cancelled last week" />
        </Col>
      </Row>
    </Container>
  );
}
