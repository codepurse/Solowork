import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useStore } from "../../store/store";
import BannerPremium from "./BannerPremium";
import General from "./General";
import Pinned from "./Pinned";
import ProjectList from "./ProjectList";
import Workspace from "./Workspace";

export default function Sidebar() {
  const { useStoreSidebar } = useStore();
  const { showSidebar } = useStoreSidebar();

  const style = {
    width: showSidebar ? "250px" : "58px",
    padding: showSidebar ? "8px 20px" : "8px 12px",
  };
  return (
    <Container className="sidebar" style={style}>
      <Row style={{ height: "100%" }}>
        <Col>
          <ProjectList showSidebar={showSidebar} />
          <div className="sidebar-container mt-3">
            <General showSidebar={showSidebar} />
            <Workspace showSidebar={showSidebar} />
            <Pinned showSidebar={showSidebar} />
          </div>
          <BannerPremium showSidebar={showSidebar} />
        </Col>
      </Row>
    </Container>
  );
}
