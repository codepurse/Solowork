import dayjs from "dayjs";
import { Col, Container, Row } from "react-bootstrap";
import LineChart from "../components/Pages/Dashboard/LineChart";
import TaskWidgets from "../components/Pages/Dashboard/Widgets/TaskWidgets";

export default function Dashboard() {
  const checkTime = () => {
    const hours = dayjs().hour();
    if (hours < 12) {
      return "Good morning";
    } else if (hours < 18) {
      return "Good afternoon";
    } else {
      return "Good evening";
    }
  };
  return (
    <Container className="dashboard-container">
      <Row>
        <Col lg={12}>
          <p className="dashboard-title">
            {checkTime()}, Alfon <span className="wave-emoji">👋</span>
          </p>
          <p className="dashboard-date">
            {dayjs().format("dddd, DD MMMM YYYY")}
          </p>
        </Col>
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
      <Row className="mt-4">
        <Col lg={9}>
          <LineChart />
        </Col>
      </Row>
    </Container>
  );
}
