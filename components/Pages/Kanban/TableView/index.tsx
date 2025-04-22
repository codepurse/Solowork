import { ChevronUp, Logs } from "lucide-react";
import { tasks } from "../../../../constant/dummy";
import Space from "../../../space";

export default function TableView() {
  const getColor = (status: string) => {
    if (status === "High") return "#FF1744";
    if (status === "Medium") return "#ffa500";
    if (status === "Low") return "#008000";
    return "#000";
  };

  return (
    <div className="table-view-container">
      <div>
        <Space gap={15} align="evenly">
          <div>
            <Space gap={10}>
              <div className="table-view-header-title">
                <Logs size={14} color="#888" />
                <p>To Do</p>
              </div>
              <p className="table-view-header-count">2</p>
            </Space>
          </div>
          <ChevronUp size={18} color="#888" />
        </Space>
      </div>
      <div className="table-view-content">
        <table>
          <thead>
            <th>Name</th>
            <th>Description</th>
            <th>Tags</th>
            <th>Priority</th>
            <th>Due Date</th>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td>
                  <p>{task.title}</p>
                </td>
                <td>
                  <p className="table-view-description">{task.description}</p>
                </td>
                <td>
                  <p>{task.tags.join(", ")}</p>
                </td>
                <td>
                  <p style={{ color: getColor(task.priority) }}>
                    {task.priority}
                  </p>
                </td>
                <td>
                  <p>{task.dueDate}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
