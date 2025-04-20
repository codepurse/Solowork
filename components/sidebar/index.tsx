import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import BannerPremium from "./BannerPremium";
import General from "./General";
import ProjectList from "./ProjectList";
import Support from "./Support";
import Workspace from "./Workspace";

export default function Sidebar() {
  return (
    <Container className="sidebar">
      <Row style={{ height: "100%" }}>
        <Col>
          <ProjectList />
          <div className="sidebar-container mt-3">
            <General />
            <hr className="faded-line" />
            <Workspace />
            <hr className="faded-line" />
            <Support />
          </div>
          <BannerPremium />
        </Col>
      </Row>
    </Container>
  );
}
