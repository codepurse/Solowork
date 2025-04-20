import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import General from "./General";
import ProjectList from "./ProjectList";
import Support from "./Support";
import Workspace from "./Workspace";

export default function Sidebar() {
  return (
    <Container className="sidebar">
      <Row>
        <Col>
          <ProjectList />
          <hr className="faded-line" />
          <div className="sidebar-container">
            <General />
            <hr className="faded-line" />
            <Workspace />
            <hr className="faded-line" />
            <Support />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
