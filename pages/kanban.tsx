import {
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    SquareKanban,
    Table,
} from "lucide-react";
import { Col, Container, Row } from "react-bootstrap";
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
          <div className="kanban-board">
            <p className="kanban-board-title">Dashboard Page</p>
            <Space gap={18}>
              <div>
                <Space gap={10}>
                  <i>
                    <FolderKanban size={16} />
                  </i>
                  <p className="kanban-column-title">Detailed Board</p>
                </Space>
              </div>
              <div>
                <Space gap={10}>
                  <i>
                    <Table size={16} />
                  </i>
                  <p className="kanban-column-title">Table View</p>
                </Space>
              </div>
              <div>
                <Space gap={10}>
                  <i>
                    <SquareKanban size={16} />
                  </i>
                  <p className="kanban-column-title">Overview</p>
                </Space>
              </div>
            </Space>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
