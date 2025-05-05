import { Query } from "appwrite";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import useSWR from "swr";
import {
    DATABASE_ID,
    databases,
    KANBAN_COLLECTION_ID,
} from "../../../../constant/appwrite";

export default function Overview() {
  const router = useRouter();
  const { kanban } = router.query;
  const [dueSoonTasks, setDueSoonTasks] = useState<Array<any>>([]);
  const kanbanId = Array.isArray(kanban) ? kanban[0] : kanban;

  const fetchTasks = async (kanbanId: string) => {
    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    const tasks = await databases.listDocuments(
      DATABASE_ID,
      KANBAN_COLLECTION_ID,
      [
        Query.equal("kanbanId", kanbanId),
        Query.greaterThanEqual("dueDate", now.toISOString()),
        Query.lessThanEqual("dueDate", oneMonthFromNow.toISOString()),
      ]
    );
    return tasks;
  };

  const { data } = useSWR(kanbanId ? ["kanban_tasks", kanbanId] : null, () =>
    fetchTasks(kanbanId!)
  );

  useEffect(() => {
    if (data) {
      console.log(data, "Data");
      setDueSoonTasks(Array.isArray(data.documents) ? data.documents : []);
    }
  }, [data]);

  const getColor = (status: string) => {
    if (status === "To Do") return "table-view-to-do";
    if (status === "In Progress") return "table-view-in-progress";
    if (status === "Completed") return "table-view-completed";
    if (status === "Cancelled") return "table-view-cancelled";
    return "#000";
  };

  return (
    <Container>
      <Row>
        <Col lg={8}>
          <div className="table-due-soon">
            <div className="table-due-soon-header">
              <p className="table-due-soon-header-title">
                Approaching Deadline
              </p>
              <p className="table-due-soon-header-date">
                {dayjs().format("D MMMM YYYY")} -{" "}
                {dayjs().add(1, "month").format("D MMMM YYYY")}
              </p>
            </div>
            <div className="table-due-soon-body">
              <table>
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(dueSoonTasks) &&
                    dueSoonTasks.map((task) => (
                      <tr key={task.$id}>
                        <td>{task.title}</td>
                        <td>{dayjs(task.dueDate).format("MMMM D, YYYY")}</td>
                        <td>{getColor(task.status)}</td>
                        <td>{task.priority}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
