import { ChevronLeft, ChevronRight } from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
import HeaderTabs from "../components/Pages/Kanban/HeaderTabs";
import Space from "../components/space";

export default function Kanban() {
  return (
    <Container fluid className="kanban-container">
      <Row>
        <Col className="p-0">
          <div className="kanban-header">
            <Space gap={10}>
              <div>
                <Space>
                  <i>
                    <ChevronLeft size={17} />
                  </i>
                  <i>
                    <ChevronRight size={17} />
                  </i>
                </Space>
              </div>
              <p className="kanban-header-title">Kanban</p>
            </Space>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <HeaderTabs />
        </Col>
      </Row>
    </Container>
  );
}
