import { Query } from "appwrite";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import HeaderTabs from "../components/Pages/Kanban/HeaderTabs";
import KanbanBoard from "../components/Pages/Kanban/KanbanBoard";
import TableView from "../components/Pages/Kanban/TableView";
import Space from "../components/space";
import {
  DATABASE_ID,
  TASKS_COLLECTION_ID,
  databases,
} from "../constant/appwrite";
import { useStore } from "../store/store";

export default function Kanban() {
  const { useStoreKanban, useStoreProjects, useStoreTasks } = useStore();
  const { selectedKanban } = useStoreKanban();
  const { selectedProject } = useStoreProjects();
  const { tasks, setTasks } = useStoreTasks();

  useEffect(() => {
    const fetchTasks = async () => {
      const tasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_COLLECTION_ID,
        [Query.equal("projectId", selectedProject)]
      );
      console.log(tasks.documents);
      setTasks(tasks.documents);
    };
    if (selectedProject) {
      console.log("fetching tasks");
      fetchTasks();
    }
  }, [selectedProject]);

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
      {selectedKanban === 1 && <KanbanBoard tasksList={tasks} />}
      {selectedKanban === 2 && <TableView />}
    </Container>
  );
}
