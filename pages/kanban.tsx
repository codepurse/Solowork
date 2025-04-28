import { ChevronLeft, ChevronRight } from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
import HeaderTabs from "../components/Pages/Kanban/HeaderTabs";
import KanbanBoard from "../components/Pages/Kanban/KanbanBoard";
import TableView from "../components/Pages/Kanban/TableView";
import Space from "../components/space";
import { useStore } from "../store/store";

export default function Kanban() {
  const { useStoreKanban } = useStore();
  const { selectedKanban } = useStoreKanban();
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
          <hr className="not-faded-line" style={{ marginTop: "-13px" }} />
        </Col>
      </Row>
      {selectedKanban === 1 && <KanbanBoard />}
      {selectedKanban === 2 && <TableView />}
    </Container>
  );
}
