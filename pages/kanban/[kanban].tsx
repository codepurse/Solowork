import { Query } from "appwrite";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useSWR from "swr";
import DrawerInfo from "../../components/Pages/Kanban/DrawerInfo";
import HeaderTabs from "../../components/Pages/Kanban/HeaderTabs";
import KanbanBoard from "../../components/Pages/Kanban/KanbanBoard";
import Overview from "../../components/Pages/Kanban/Overview";
import TableView from "../../components/Pages/Kanban/TableView";
import Space from "../../components/space";
import {
  DATABASE_ID,
  databases,
  KANBAN_COLLECTION_ID,
  KANBAN_FOLDER_ID,
} from "../../constant/appwrite";
import { useStore } from "../../store/store";

export default function KanbanPage() {
  const { useStoreKanban, useStoreTasks, useStoreProjects } = useStore();
  const { selectedKanban, showDrawerInfo } = useStoreKanban();
  const { tasks, setTasks } = useStoreTasks();
  const router = useRouter();
  const { kanban } = router.query;
  const [kanbanDetails, setKanbanDetails] = useState<any>(null);
  const { selectedProject } = useStoreProjects();
  // Convert to string if it's an array
  const kanbanId = Array.isArray(kanban) ? kanban[0] : kanban;

  const fetchTasks = async (kanbanId: string) => {
    const tasks = await databases.listDocuments(
      DATABASE_ID,
      KANBAN_COLLECTION_ID,
      [Query.equal("kanbanId", kanbanId)]
    );
    return tasks;
  };

  useEffect(() => {
    const fetchPinnedKanban = async () => {
      const kanbanDetails = await databases.listDocuments(
        DATABASE_ID,
        KANBAN_FOLDER_ID,
        [Query.equal("$id", kanbanId)]
      );
      setKanbanDetails(kanbanDetails?.documents[0]);
    };
    fetchPinnedKanban();
  }, [kanbanId]);

  const { data } = useSWR(kanbanId ? ["kanban_tasks", kanbanId] : null, () =>
    fetchTasks(kanbanId!)
  );

  useEffect(() => {
    if (data) {
      setTasks(data.documents);
    }
  }, [data]);

  return (
    <Container className="kanban-container">
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
          <HeaderTabs kanbanId={kanbanId} kanbanDetails={kanbanDetails} />
          <hr className="not-faded-line" style={{ marginTop: "-13px" }} />
        </Col>
      </Row>
      {selectedKanban === "kanban" && <KanbanBoard tasksList={tasks} />}
      {selectedKanban === "table" && <TableView tasksList={tasks} />}
      {selectedKanban === "gantt" && <Overview tasksList={tasks} />}
      {showDrawerInfo && <DrawerInfo />}
    </Container>
  );
}
