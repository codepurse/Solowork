import dayjs from "dayjs";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import Badge from "../../../Elements/Badge";

export default function Overview({
  tasksList,
}: Readonly<{ tasksList: any[] }>) {
  const router = useRouter();
  const { kanban } = router.query;
  const [dueSoonTasks, setDueSoonTasks] = useState<Array<any>>([]);
  const kanbanId = Array.isArray(kanban) ? kanban[0] : kanban;

  useEffect(() => {
    if (tasksList && tasksList.length > 0 && kanbanId) {
      // Filter tasks for current kanban board
      const kanbanTasks = tasksList.filter(
        (task) => task.kanbanId === kanbanId
      );

      // Get date range (now to one month from now)
      const now = new Date();
      const oneMonthFromNow = new Date();
      oneMonthFromNow.setMonth(now.getMonth() + 1);

      // Filter tasks with due dates in the next month
      const upcomingTasks = kanbanTasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= oneMonthFromNow;
      });

      setDueSoonTasks(upcomingTasks);
    }
  }, [tasksList, kanbanId]);

  const getColor = (status: string) => {
    if (status === "To Do") return "badge-gray";
    if (status === "In Progress") return "badge-blue";
    if (status === "Completed") return "badge-green";
    if (status === "Cancelled") return "badge-red";
    return "badge-gray";
  };

  const getColorPriority = (priority: string) => {
    if (priority === "High") return "badge-red";
    if (priority === "Medium") return "badge-yellow";
    if (priority === "Low") return "badge-green";
    return "badge-gray";
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
                        <td>
                          <Badge className={getColor(task.status)}>
                            {task.status}
                          </Badge>
                        </td>
                        <td>
                          <Badge className={getColorPriority(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>
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
